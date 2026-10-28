import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/integrations/supabase';

const PHOTO_WIDTH = 1080;
const CERTIFICATE_WIDTH = 1600;
const JPEG_QUALITY = 0.7;
const CERTIFICATE_BUCKET = 'pet-certificates';

interface CloudinarySignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: { message?: string };
}

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add the Supabase env vars to .env.');
  }
  return supabase;
}

/** Opens the gallery and returns the chosen image's local URI, or `null` if cancelled/denied. */
export async function pickImage(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
  });
  if (result.canceled) return null;
  return result.assets[0]?.uri ?? null;
}

/** Resizes and compresses on the phone to save bandwidth and storage. */
async function compressImage(uri: string, width: number): Promise<string> {
  const rendered = await ImageManipulator.manipulate(uri).resize({ width }).renderAsync();
  const saved = await rendered.saveAsync({ compress: JPEG_QUALITY, format: SaveFormat.JPEG });
  return saved.uri;
}

/** Uploads a pet photo to Cloudinary using a signature from the `cloudinary-sign` function. */
export async function uploadPetPhoto(localUri: string): Promise<string> {
  const client = requireSupabase();
  const compressedUri = await compressImage(localUri, PHOTO_WIDTH);

  const { data, error } = await client.functions.invoke<CloudinarySignature>('cloudinary-sign');
  if (error || !data) throw error ?? new Error('Could not get an upload signature');

  const form = new FormData();
  form.append('file', { uri: compressedUri, type: 'image/jpeg', name: 'photo.jpg' } as never);
  form.append('api_key', data.apiKey);
  form.append('timestamp', String(data.timestamp));
  form.append('folder', data.folder);
  form.append('signature', data.signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const json = (await response.json()) as CloudinaryUploadResponse;
  if (!response.ok || !json.secure_url) {
    throw new Error(json.error?.message ?? 'Upload failed');
  }
  return json.secure_url;
}

/** Uploads a health/pedigree document to the private bucket. Returns its storage path. */
export async function uploadCertificate(
  userId: string,
  petId: string,
  localUri: string
): Promise<string> {
  const client = requireSupabase();
  const compressedUri = await compressImage(localUri, CERTIFICATE_WIDTH);
  const bytes = await (await fetch(compressedUri)).arrayBuffer();

  const path = `${userId}/${petId}.jpg`;
  const { error } = await client.storage
    .from(CERTIFICATE_BUCKET)
    .upload(path, bytes, { contentType: 'image/jpeg', upsert: true });
  if (error) throw error;
  return path;
}

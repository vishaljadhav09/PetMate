import { createClient } from 'jsr:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
};

async function sha1Hex(text: string) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401, headers: cors });

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `petmate/${user.id}`;
  const toSign = `folder=${folder}&timestamp=${timestamp}`; // params in alphabetical order
  const signature = await sha1Hex(toSign + Deno.env.get('CLOUDINARY_API_SECRET')!);

  return new Response(
    JSON.stringify({
      cloudName: Deno.env.get('CLOUDINARY_CLOUD_NAME'),
      apiKey: Deno.env.get('CLOUDINARY_API_KEY'),
      timestamp,
      folder,
      signature,
    }),
    { headers: { ...cors, 'Content-Type': 'application/json' } }
  );
});

import { createClient } from 'jsr:@supabase/supabase-js@2';

interface MatchRequestRow {
  id: string;
  pet_id: string;
  sender_id: string;
  recipient_id: string;
  status: string;
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE';
  record: MatchRequestRow;
  old_record: MatchRequestRow | null;
}

Deno.serve(async (req) => {
  if (req.headers.get('x-webhook-secret') !== Deno.env.get('WEBHOOK_SECRET')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const payload = (await req.json()) as WebhookPayload;
  const r = payload.record;

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  let userId: string | null = null;
  let title = '';
  let body = '';

  if (payload.type === 'INSERT') {
    userId = r.recipient_id;
    const { data: pet } = await admin.from('pets').select('pet_name').eq('id', r.pet_id).single();
    title = 'New match request';
    body = `Someone is interested in ${pet?.pet_name ?? 'your pet'}.`;
  } else if (payload.type === 'UPDATE' && payload.old_record?.status !== r.status) {
    if (r.status === 'accepted') {
      userId = r.sender_id;
      title = 'Request accepted';
      body = 'Open PetMate to see contact details.';
    } else if (r.status === 'declined') {
      userId = r.sender_id;
      title = 'Request declined';
      body = 'The owner declined your request.';
    }
  }

  if (!userId) return new Response('skipped');

  const { data: priv } = await admin
    .from('profile_private')
    .select('push_token')
    .eq('id', userId)
    .single();
  if (!priv?.push_token) return new Response('no token');

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const expoToken = Deno.env.get('EXPO_ACCESS_TOKEN'); // optional
  if (expoToken) headers['Authorization'] = `Bearer ${expoToken}`;

  const res = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      to: priv.push_token,
      title,
      body,
      sound: 'default',
      data: { requestId: r.id },
    }),
  });
  return new Response(await res.text(), { status: res.status });
});

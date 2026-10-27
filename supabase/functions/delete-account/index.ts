import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const userClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
  );
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  const { error } = await admin.auth.admin.deleteUser(user.id); // cascades to all PetMate tables
  if (error) return new Response(error.message, { status: 500 });
  return new Response(JSON.stringify({ deleted: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

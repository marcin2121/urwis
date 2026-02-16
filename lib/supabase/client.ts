'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

export function createClient() {
  if (client) return client;

  client = createClientComponentClient();
  return client;
}
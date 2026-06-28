import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// This ensures the build doesn't crash if keys are missing, 
// while still throwing errors at runtime if they aren't provided.
// SECURITY NOTE: Ensure Row Level Security (RLS) is enabled on your Supabase tables.
// The 'anon' key used here should only have access to public data or data protected by RLS.
// For sensitive operations, consider using a Service Role key in server-side routes only.
export const supabase = createClient(supabaseUrl, supabaseKey);
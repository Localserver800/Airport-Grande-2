import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// This ensures the build doesn't crash if keys are missing, 
// while still throwing errors at runtime if they aren't provided.
export const supabase = createClient(supabaseUrl, supabaseKey);
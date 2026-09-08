import { createClient } from '@supabase/supabase-js';

// Read from env or local storage configuration
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('sideq_supabase_url') || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('sideq_supabase_key') || '' : '';

  const url = (envUrl && !envUrl.includes('your-project-ref')) ? envUrl : localUrl;
  const key = (envKey && envKey.length > 15 && !envKey.includes('your-supabase-anon-key')) ? envKey : localKey;

  return { url: url.trim(), key: key.trim() };
};

export const saveSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('sideq_supabase_url', url.trim());
  localStorage.setItem('sideq_supabase_key', key.trim());
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseConfig();
  return Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    key.length > 15 &&
    !url.includes('your-project-ref')
  );
};

const { url, key } = getSupabaseConfig();

export const supabase = createClient(
  isSupabaseConfigured() ? url : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? key : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

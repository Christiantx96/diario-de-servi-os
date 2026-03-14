import { createClient } from '@supabase/supabase-js';

// Use a more defensive way to access environment variables in Vite
const getEnvVar = (key: string) => {
  try {
    return (import.meta as any).env?.[key] || '';
  } catch (e) {
    return '';
  }
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Ensure we always pass a valid URL string to createClient to avoid crashing on startup
// even if the user hasn't configured their secrets yet.
const validUrl = (url: string) => {
  try {
    new URL(url);
    return url;
  } catch (e) {
    return 'https://placeholder-project.supabase.co';
  }
};

if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
  console.warn('Supabase URL is missing or using placeholder. Please configure VITE_SUPABASE_URL in your secrets.');
}

export const supabase = createClient(
  validUrl(supabaseUrl),
  supabaseAnonKey || 'placeholder-key'
);

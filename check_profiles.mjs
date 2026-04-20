import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = Object.fromEntries(envFile.split('\n').filter(Boolean).map(l => {
  const i = l.indexOf('='); 
  return [l.slice(0, i).trim(), l.slice(i+1).trim().replace(/^"|"$/g, '').replace(/\r$/, '')];
}));

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('profiles').select('full_name, gender, profile_completed, is_public').neq('full_name', null);
  if (error) console.error(error);
  console.log("Total profiles:", data.length);
  console.log(data);
}

run();

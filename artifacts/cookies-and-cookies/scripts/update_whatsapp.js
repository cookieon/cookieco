import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('store_config').update({ whatsapp_number: '5566992292676' }).eq('id', 1);
  if (error) console.error(error);
  else console.log('WhatsApp updated!');
}

run();

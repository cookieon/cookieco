import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const defaultPhotos = [
    { image_url: '/images/lifestyle_bite.jpg' },
    { image_url: '/images/lifestyle_split.jpg' },
    { image_url: '/images/lifestyle_hold.jpg' },
    { image_url: '/images/lifestyle_box.jpg' }
  ];

  const { error } = await supabase.from('mural_photos').insert(defaultPhotos);
  if (error) console.error(error);
  else console.log('Photos inserted!');
}

run();

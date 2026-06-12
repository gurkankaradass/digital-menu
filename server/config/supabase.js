const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("⚠️ SUPABASE_URL veya SUPABASE_ANON_KEY eksik!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

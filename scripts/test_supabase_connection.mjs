import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qftazzsvitxwcahhkhnb.supabase.co';
const supabaseAnonKey = 'sb_publishable_jCzHyjOt_ULj5ZmoQO3CQw_qBizItWL';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log('Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('leads').select('*').limit(1);
    if (error) {
      console.log('Response from Supabase:', error.message);
      if (error.message.includes('relation "public.leads" does not exist') || error.code === '42P01') {
        console.log('STATUS: Credentials are VALID! The table "leads" needs to be created by running schema.sql in Supabase SQL editor.');
      } else {
        console.log('Error details:', error);
      }
    } else {
      console.log('STATUS: Connection SUCCESSFUL! Table leads exists and is queryable. Rows:', data);
    }
  } catch (err) {
    console.error('Fatal connection error:', err.message);
  }
}

test();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qftazzsvitxwcahhkhnb.supabase.co';
const supabaseAnonKey = 'sb_publishable_jCzHyjOt_ULj5ZmoQO3CQw_qBizItWL';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  for (const table of ['leads', 'reminders', 'message_templates']) {
    const { data, error } = await supabase.from(table).select('*').limit(2);
    if (error) {
      console.log(`Table ${table}: ERROR -> ${error.message} (${error.code})`);
    } else {
      console.log(`Table ${table}: OK! Rows found: ${data.length}`);
    }
  }
}

test();

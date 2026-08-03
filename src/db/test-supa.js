const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://chslfdzbiydrzuenwk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoc2xmZHpzYml5ZHJ6dWV1bndrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTY3MDE2MSwiZXhwIjoyMTAxMjQ2MTYxfQ.KQKnGdCecCCyYGN-2Tfa_KvMi8ApBhhuGN5chTI1HIA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Testing Supabase REST endpoint...');
  const { data, error } = await supabase.from('services').select('*');
  console.log('Data:', data);
  console.log('Error:', error);
}

check();

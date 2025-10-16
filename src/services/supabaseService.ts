import { supabase } from '../lib/supabase';

export async function fetchExampleData() {
  const { data, error } = await supabase
    .from('your_table_name') // Replace 'your_table_name' with the actual table you want to query
    .select('*');

  if (error) {
    console.error('Error fetching data:', error);
    return null;
  }

  return data;
}
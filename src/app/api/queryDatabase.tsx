import { supabase } from '@/lib/supabase';

export const queryDatabase = async (sql: string, params?: any[]) => {
  const { data, error } = await supabase.rpc('raw_sql', {
    sql,
    params: params || []
  });

  if (error) {
    throw new Error(`Supabase query error: ${error.message}`);
  }

  return data;
};
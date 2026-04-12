import { supabase } from './supabase';

export async function getEntry(userId, date) {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .maybeSingle();

  if (error) {
    console.error('Error fetching entry:', error);
    return null;
  }
  return data;
}

export async function upsertEntry(userId, date, entryData) {
  const { data, error } = await supabase
    .from('entries')
    .upsert(
      {
        user_id: userId,
        date,
        ...entryData,
        net: (entryData.creation || 0) + (entryData.reflection || 0) - (entryData.consumption || 0),
      },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting entry:', error);
    return null;
  }
  return data;
}

export async function getEntries(userId, days) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startStr)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching entries:', error);
    return [];
  }
  return data || [];
}

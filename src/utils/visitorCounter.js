import { supabase } from '../lib/supabase';

export const getVisitorCount = async () => {
  try {
    const { data, error } = await supabase
      .from('portfolio_stats')
      .select('visits')
      .eq('id', 1)
      .single();

    if (error) throw error;
    return data.visits;
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    return null;
  }
};

export const incrementVisitorCount = async () => {
  try {
    // Check localStorage
    const lastVisit = localStorage.getItem('portfolio_visited');
    const now = new Date().getTime();
    
    // 24 hours in milliseconds
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (lastVisit && (now - parseInt(lastVisit, 10) < twentyFourHours)) {
      // Not enough time passed, just return current count without incrementing
      return await getVisitorCount();
    }

    // Need to increment
    const currentCount = await getVisitorCount();
    if (currentCount === null) return null;

    const newCount = currentCount + 1;

    const { error } = await supabase
      .from('portfolio_stats')
      .update({ visits: newCount })
      .eq('id', 1);

    if (error) throw error;

    // Save flag to localStorage
    localStorage.setItem('portfolio_visited', now.toString());

    return newCount;
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    return null;
  }
};

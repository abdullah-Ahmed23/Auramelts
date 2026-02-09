
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxtrovtqsmqwroxpdauv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dHJvdnRxc21xd3JveHBkYXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTcyMDIsImV4cCI6MjA4NTk3MzIwMn0.zJI8ygMe2KQDv6hvyaYz_pevzXku3Ng_qLgDLYEXLFw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectOrder() {
    console.log('Fetching one order...');
    const { data, error } = await supabase.from('orders').select('*').limit(1);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Order structure:', JSON.stringify(data[0], null, 2));
    }
}

inspectOrder();

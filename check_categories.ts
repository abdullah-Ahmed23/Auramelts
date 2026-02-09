
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxtrovtqsmqwroxpdauv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dHJvdnRxc21xd3JveHBkYXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTcyMDIsImV4cCI6MjA4NTk3MzIwMn0.zJI8ygMe2KQDv6hvyaYz_pevzXku3Ng_qLgDLYEXLFw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCategories() {
    console.log('Fetching categories...');
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
        console.error('Error fetching categories:', JSON.stringify(error, null, 2));
    } else {
        console.log('Categories found:', data.length);
        data.forEach(cat => {
            console.log(`- ${cat.name}: Image URL = ${cat.image ? cat.image : 'NULL/EMPTY'}, Icon = ${cat.icon}`);
        });
    }
}

checkCategories();

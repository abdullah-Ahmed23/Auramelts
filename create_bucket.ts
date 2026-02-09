
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxtrovtqsmqwroxpdauv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dHJvdnRxc21xd3JveHBkYXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTcyMDIsImV4cCI6MjA4NTk3MzIwMn0.zJI8ygMe2KQDv6hvyaYz_pevzXku3Ng_qLgDLYEXLFw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createBucket() {
    console.log('Attempting to create "categories" bucket...');
    const { data, error } = await supabase.storage.createBucket('categories', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    });

    if (error) {
        console.error('Error creating bucket:', JSON.stringify(error, null, 2));
    } else {
        console.log('Bucket created:', JSON.stringify(data, null, 2));
    }
}

createBucket();

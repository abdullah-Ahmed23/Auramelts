
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxtrovtqsmqwroxpdauv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dHJvdnRxc21xd3JveHBkYXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzOTcyMDIsImV4cCI6MjA4NTk3MzIwMn0.zJI8ygMe2KQDv6hvyaYz_pevzXku3Ng_qLgDLYEXLFw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySetup() {
    console.log('--- STARTING VERIFICATION ---');

    // 1. Check if 'categories' bucket allows upload
    console.log('\n1. Testing Storage Bucket (categories)...');
    try {
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('categories')
            .upload(`test-${Date.now()}.txt`, new Blob(['test'], { type: 'text/plain' }));

        if (uploadError) {
            console.error('❌ Upload Failed:', uploadError.message);
            if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('row-level security')) {
                console.error('   -> ACTION REQUIRED: Create "categories" bucket and set it to PUBLIC.');
            }
        } else {
            console.log('✅ Upload Success! Bucket exists and is writable.');
            // Cleanup
            await supabase.storage.from('categories').remove([uploadData.path]);
        }
    } catch (e: any) {
        console.error('❌ Unexpected Storage Error:', e.message);
    }

    // 2. Check if 'categories' table has 'image' column
    console.log('\n2. Testing Database Schema (categories table)...');
    try {
        // Attempt to insert a dummy row ONLY to check if 'image' column is accepted
        // We expect this to either succeed or fail with "column does not exist"
        // We won't actually commit this row if we can avoid it, but listing columns is hard with RLS.
        // So we'll try a select with the image column.

        const { data, error } = await supabase
            .from('categories')
            .select('id, name, image')
            .limit(1);

        if (error) {
            console.error('❌ Select Failed:', error.message);
            if (error.message.includes('does not exist')) {
                console.error('   -> ACTION REQUIRED: Run SQL: alter table categories add column image text;');
            }
        } else {
            console.log('✅ Column "image" exists!');
            console.log('   Sample Row:', data[0] || 'No rows found, but query worked.');
        }

    } catch (e: any) {
        console.error('❌ Unexpected Database Error:', e.message);
    }
}

verifySetup();

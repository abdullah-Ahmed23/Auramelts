
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSubscribersTable() {
    console.log('Checking subscribers table...');
    const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching subscribers:', error);
        if (error.message.includes('not found')) {
            console.error('TABLE DOES NOT EXIST');
        }
    } else {
        console.log('Subscribers table exists. Records found:', data.length);
    }
}

checkSubscribersTable();

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

function getEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        const env: Record<string, string> = {};
        envContent.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) env[key.trim()] = value.trim();
        });
        return env;
    } catch (e) {
        return {};
    }
}

const env = getEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env');
    process.exit(1);
}

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

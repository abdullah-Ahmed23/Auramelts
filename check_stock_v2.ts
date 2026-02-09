
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
        console.error("Failed to read .env", e);
        return {};
    }
}

async function checkProductSchema() {
    const env = getEnv();
    const url = env.VITE_SUPABASE_URL;
    const key = env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return console.error("Missing env vars");

    const supabase = createClient(url, key);
    const { data, error } = await supabase.from('products').select('*').limit(1);

    if (error) {
        console.error(error);
    } else {
        if (data.length > 0) {
            console.log("Keys:", Object.keys(data[0]));
            console.log("Has stock?", 'stock' in data[0]);
        } else {
            console.log("No products.");
        }
    }
}

checkProductSchema();

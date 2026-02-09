
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Manual .env parsing since we can't use dotenv/vite
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

async function debugProductsQuery() {
    const env = getEnv();
    const url = env.VITE_SUPABASE_URL;
    const key = env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error("Missing credentials in .env");
        return;
    }

    const supabase = createClient(url, key);

    console.log("Running debug query...");
    const { data, error } = await supabase
        .from('products')
        .select('*, categories(slug, name)')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Query Error:", error);
    } else {
        console.log("Query Success! Count:", data.length);
        if (data.length > 0) {
            const p = data[0];
            console.log("First item:", {
                id: p.id,
                name: p.name,
                price: p.price,
                priceType: typeof p.price,
                featured: p.featured,
                featuredType: typeof p.featured,
                categories: p.categories,
                categoriesType: typeof p.categories,
                isArray: Array.isArray(p.categories)
            });
        } else {
            console.log("No products returned.");
        }
    }
}

debugProductsQuery();


import { supabase } from './src/lib/supabase';

async function debugProductsQuery() {
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
            console.log("First item:", JSON.stringify(data[0], null, 2));
            console.log("Featured exists?", 'featured' in data[0]);
        }
    }
}

debugProductsQuery();

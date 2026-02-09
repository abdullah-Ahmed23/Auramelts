
import { supabase } from './src/lib/supabase';

async function checkProductSchema() {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error) {
        console.error(error);
    } else {
        if (data.length > 0) {
            console.log("Product keys:", Object.keys(data[0]));
        } else {
            console.log("No products found to check schema.");
        }
    }
}

checkProductSchema();

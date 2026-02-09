
import { supabase } from './src/lib/supabase';

async function checkSchema() {
    const { data, error } = await supabase
        .from('orders')
        .select('payment_proof')
        .limit(1);

    if (error) {
        console.log('Column check failed (likely missing):', error.message);
    } else {
        console.log('Column payment_proof exists.');
    }
}

checkSchema();

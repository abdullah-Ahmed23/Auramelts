
import { supabase } from './src/lib/supabase';

async function checkSchema() {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error:', error);
    } else {
        const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
        console.log('Orders Columns:', columns);
        console.log('Has payment_proof:', columns.includes('payment_proof'));
    }
}

checkSchema();

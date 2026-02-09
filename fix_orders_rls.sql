-- Enable deletion for orders and order_items
-- Checks if policies exist before creating them to avoid errors

-- Policy for ORDERS table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'orders' AND policyname = 'Enable delete for users'
    ) THEN
        CREATE POLICY "Enable delete for users" ON orders FOR DELETE USING (true);
    END IF;
END
$$;

-- Policy for ORDER_ITEMS table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'order_items' AND policyname = 'Enable delete for users'
    ) THEN
        CREATE POLICY "Enable delete for users" ON order_items FOR DELETE USING (true);
    END IF;
END
$$;

-- Ensure RLS is enabled (optional, but good practice)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Add ON DELETE CASCADE to order_items foreign key if needed
-- This makes it so deleting an order automatically deletes its items
BEGIN;
    ALTER TABLE order_items 
    DROP CONSTRAINT IF EXISTS order_items_order_id_fkey,
    ADD CONSTRAINT order_items_order_id_fkey 
    FOREIGN KEY (order_id) 
    REFERENCES orders(id) 
    ON DELETE CASCADE;
COMMIT;

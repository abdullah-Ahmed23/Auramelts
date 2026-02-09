
-- Add variants column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- Add variant_name column to order_items table to track which variant was sold
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS variant_name TEXT;

-- Comment on columns
COMMENT ON COLUMN products.variants IS 'Array of variants, e.g. [{"name": "Small", "price": 100, "cost": 50}, {"name": "Large", "price": 200, "cost": 100}]';
COMMENT ON COLUMN order_items.variant_name IS 'Name of the variant sold, e.g. "Small"';

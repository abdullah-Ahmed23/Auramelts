-- Add stock column to products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- Optional: Add constraint to prevent negative stock
ALTER TABLE products 
ADD CONSTRAINT check_stock_non_negative CHECK (stock >= 0);

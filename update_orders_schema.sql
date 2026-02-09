-- Add governorate and city columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS governorate TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

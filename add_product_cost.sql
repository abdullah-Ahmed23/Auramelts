-- Run this in your Supabase SQL Editor

-- Add 'cost' column to products table
alter table products 
add column cost numeric default 0;

-- Optional: Update existing products to have a default cost (e.g. 50% of price) if you want
-- update products set cost = price * 0.5 where cost = 0;

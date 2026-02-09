-- Check which products have variants
SELECT id, name, variants 
FROM products 
WHERE variants IS NOT NULL AND variants != '[]'::jsonb
LIMIT 10;

-- If no results, check all products to see their current variant status
SELECT id, name, variants 
FROM products 
ORDER BY created_at DESC
LIMIT 10;

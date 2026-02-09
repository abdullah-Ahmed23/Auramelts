-- Update Candles with variants
UPDATE products 
SET variants = '[
  {"name": "Small (4oz)", "price": 450, "stock": 10},
  {"name": "Medium (8oz)", "price": 650, "stock": 15},
  {"name": "Large (12oz)", "price": 850, "stock": 5}
]'::jsonb
WHERE category_id IN (SELECT id FROM categories WHERE slug = 'candles');

-- Update Wax Melts with variants
UPDATE products 
SET variants = '[
  {"name": "Pack of 6", "price": 150, "stock": 20},
  {"name": "Pack of 12", "price": 280, "stock": 10}
]'::jsonb
WHERE category_id IN (SELECT id FROM categories WHERE slug = 'wax-melts');

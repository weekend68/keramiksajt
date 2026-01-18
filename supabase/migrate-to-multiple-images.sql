-- Migration: Support multiple images per product
-- Changes the 'image' column to 'images' and stores JSON array

-- Step 1: Add new 'images' column as TEXT (will store JSON array)
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT;

-- Step 2: Migrate existing data from 'image' to 'images'
-- Convert single image URL to JSON array format
UPDATE products
SET images = CASE
  WHEN image IS NOT NULL AND image != '' THEN '["' || image || '"]'
  ELSE '[]'
END
WHERE images IS NULL;

-- Step 3: Drop old 'image' column
ALTER TABLE products DROP COLUMN IF EXISTS image;

-- Verify migration
-- SELECT id, name, images FROM products LIMIT 5;

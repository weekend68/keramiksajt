-- Add reservation columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS reserved_by TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reserved_at TIMESTAMPTZ;
ALTER TABLE products ADD COLUMN IF NOT EXISTS delivery_address TEXT;

-- Note: Status column already exists with TEXT type
-- It currently supports 'available' and 'sold'
-- Now it will also support 'reserved'
-- No need to modify the column type as TEXT supports any string value

-- Update the index to remain efficient with the new status value
-- The existing index idx_products_status will work fine with 'reserved' status

-- Optional: Add index on reserved_at for potential cleanup queries
CREATE INDEX IF NOT EXISTS idx_products_reserved_at ON products(reserved_at);

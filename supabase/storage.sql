-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow anyone to upload images (we handle auth in app layer)
CREATE POLICY "Public can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow anyone to update images
CREATE POLICY "Public can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- Allow anyone to delete images
CREATE POLICY "Public can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

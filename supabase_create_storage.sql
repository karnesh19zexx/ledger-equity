-- Create storage bucket for proof documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('proof-documents', 'proof-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the bucket
CREATE POLICY "Anyone can upload proof documents"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'proof-documents');

CREATE POLICY "Anyone can view proof documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'proof-documents');

-- Allow authenticated users to delete (for admin cleanup)
CREATE POLICY "Authenticated users can delete proof documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'proof-documents');

SELECT 'Storage bucket created successfully! ✅' AS message;

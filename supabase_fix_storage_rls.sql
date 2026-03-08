-- Fix RLS policies for storage bucket

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can upload proof documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view proof documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete proof documents" ON storage.objects;

-- Create new policies that work with anonymous users
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'proof-documents' );

CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'proof-documents' );

CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'proof-documents' );

-- Verify
SELECT 'Storage RLS policies fixed! ✅' AS message;

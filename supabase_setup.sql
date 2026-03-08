-- Ledger Equity Donation Platform - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create the tables

-- Table: requests
-- Stores all funding requests from students and organizations
CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('student', 'organization')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  
  -- Personal Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT NOT NULL,
  
  -- Student-specific fields
  school TEXT,
  
  -- Organization-specific fields
  organization_name TEXT,
  organization_type TEXT,
  beneficiaries INTEGER,
  
  -- Funding details
  needs TEXT NOT NULL,
  target_amount DECIMAL(18, 8) NOT NULL,
  description TEXT NOT NULL,
  proof_documents TEXT,
  
  -- Tracking
  raised DECIMAL(18, 8) DEFAULT 0,
  donors INTEGER DEFAULT 0,
  
  -- Review information
  review_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT positive_target CHECK (target_amount > 0),
  CONSTRAINT non_negative_raised CHECK (raised >= 0)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_type ON requests(type);
CREATE INDEX IF NOT EXISTS idx_requests_submitted_at ON requests(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_email ON requests(email);

-- Enable Row Level Security (RLS)
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read approved requests
CREATE POLICY "Anyone can view approved requests"
  ON requests
  FOR SELECT
  USING (status = 'approved');

-- Policy: Allow anyone to insert requests (for public submissions)
CREATE POLICY "Anyone can create requests"
  ON requests
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow authenticated users to view all requests (for admin)
-- Note: You'll need to set up authentication in Supabase for this
CREATE POLICY "Authenticated users can view all requests"
  ON requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to update requests (for admin)
CREATE POLICY "Authenticated users can update requests"
  ON requests
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to delete requests (for admin)
CREATE POLICY "Authenticated users can delete requests"
  ON requests
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for approved requests only (for easier querying)
CREATE OR REPLACE VIEW approved_requests AS
  SELECT * FROM requests
  WHERE status = 'approved'
  ORDER BY submitted_at DESC;

-- Comments for documentation
COMMENT ON TABLE requests IS 'Stores funding requests from students and organizations';
COMMENT ON COLUMN requests.id IS 'Unique request identifier (format: REQ-timestamp-random)';
COMMENT ON COLUMN requests.type IS 'Type of request: student or organization';
COMMENT ON COLUMN requests.status IS 'Request status: pending, approved, or rejected';
COMMENT ON COLUMN requests.raised IS 'Amount raised so far in ETH';
COMMENT ON COLUMN requests.donors IS 'Number of donors who have contributed';

-- Success message
SELECT 'Database schema created successfully! ✅' AS message;

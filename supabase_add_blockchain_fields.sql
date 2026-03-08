-- Add blockchain tracking fields to requests table
ALTER TABLE requests 
ADD COLUMN IF NOT EXISTS blockchain_id TEXT,
ADD COLUMN IF NOT EXISTS blockchain_tx TEXT;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_requests_blockchain_id ON requests(blockchain_id);

-- Add comments
COMMENT ON COLUMN requests.blockchain_id IS 'Student ID in the blockchain smart contract';
COMMENT ON COLUMN requests.blockchain_tx IS 'Transaction hash for blockchain creation';

SELECT 'Blockchain fields added successfully! ✅' AS message;

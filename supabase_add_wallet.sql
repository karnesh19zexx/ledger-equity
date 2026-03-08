-- Add wallet_address column to requests table
ALTER TABLE requests 
ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Add index for wallet address lookups
CREATE INDEX IF NOT EXISTS idx_requests_wallet_address ON requests(wallet_address);

-- Add comment
COMMENT ON COLUMN requests.wallet_address IS 'Ethereum wallet address where donations will be sent';

-- Verify the column was added
SELECT 'Wallet address column added successfully! ✅' AS message;

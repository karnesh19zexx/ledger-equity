-- Clear all requests from database
DELETE FROM requests;

-- Reset any auto-increment if needed
-- (PostgreSQL doesn't have auto-increment, but just to be safe)

SELECT 'All requests cleared! ✅' AS message;

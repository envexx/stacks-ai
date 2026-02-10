/*
  # Update Schema - Minimal Design & Remove Credits

  ## Changes
  - Remove credits system
  - Simplify users table (remove credits, total_spent)
  - Keep only essential fields
  - Update related tables accordingly
*/

-- Drop constraints yang melibatkan credits
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'credits'
  ) THEN
    ALTER TABLE users DROP COLUMN IF EXISTS credits;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'total_spent'
  ) THEN
    ALTER TABLE users DROP COLUMN IF EXISTS total_spent;
  END IF;
END $$;

-- Drop transactions table
DROP TABLE IF EXISTS transactions CASCADE;
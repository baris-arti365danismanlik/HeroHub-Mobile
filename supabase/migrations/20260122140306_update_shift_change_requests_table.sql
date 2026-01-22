/*
  # Update shift change requests table

  1. Changes
    - Remove columns: current_shift_type, requested_shift_type, reason, effective_date
    - Add column: shift_plan_id (integer, not null)
  
  2. Notes
    - This migration removes unnecessary fields
    - Now only tracks the requested shift plan ID
*/

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shift_change_requests' AND column_name = 'current_shift_type'
  ) THEN
    ALTER TABLE shift_change_requests DROP COLUMN IF EXISTS current_shift_type;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shift_change_requests' AND column_name = 'requested_shift_type'
  ) THEN
    ALTER TABLE shift_change_requests DROP COLUMN IF EXISTS requested_shift_type;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shift_change_requests' AND column_name = 'reason'
  ) THEN
    ALTER TABLE shift_change_requests DROP COLUMN IF EXISTS reason;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shift_change_requests' AND column_name = 'effective_date'
  ) THEN
    ALTER TABLE shift_change_requests DROP COLUMN IF EXISTS effective_date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'shift_change_requests' AND column_name = 'shift_plan_id'
  ) THEN
    ALTER TABLE shift_change_requests ADD COLUMN shift_plan_id integer NOT NULL DEFAULT 0;
  END IF;
END $$;
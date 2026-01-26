/*
  # Add last_contacted_at field to patients table

  1. Changes
    - Add `last_contacted_at` column to `patients` table
    - This field will track when the nutritionist last contacted the patient
    - Used to calculate alerts and active reminders correctly

  2. Security
    - No changes to RLS policies needed
    - Field follows existing table permissions
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'patients' AND column_name = 'last_contacted_at'
  ) THEN
    ALTER TABLE patients ADD COLUMN last_contacted_at timestamptz;
  END IF;
END $$;
/*
  # Add Category Field to Onboarding Tasks

  1. Changes
    - Add `category` column to `onboarding_tasks` table
    - Update existing tasks with default categories

  2. Categories
    - Bilgi Teknolojileri (IT)
    - İnsan Kaynakları (HR)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'onboarding_tasks' AND column_name = 'category'
  ) THEN
    ALTER TABLE onboarding_tasks ADD COLUMN category text;
  END IF;
END $$;

UPDATE onboarding_tasks
SET category = CASE
  WHEN title ILIKE '%e-posta%' OR title ILIKE '%email%' OR title ILIKE '%sistem%' OR title ILIKE '%bilgisayar%' OR title ILIKE '%teknoloji%' THEN 'Bilgi Teknolojileri'
  WHEN title ILIKE '%çalışma%' OR title ILIKE '%yeni işe%' OR title ILIKE '%telefon%' OR title ILIKE '%insan%' OR title ILIKE '%kaynak%' THEN 'İnsan Kaynakları'
  ELSE 'İnsan Kaynakları'
END
WHERE category IS NULL;
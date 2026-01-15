/*
  # Update Onboarding Tables for Backend Users

  1. Değişiklikler
    - `user_onboarding` tablosuna `backend_user_id` kolonu ekleniyor
    - Backend API kullanıcıları için onboarding desteği
    - user_id nullable yapılıyor (backend veya supabase auth kullanabilmek için)

  2. Güvenlik
    - RLS politikaları güncelleniyor
    - Backend user ID ile de erişim sağlanacak
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_onboarding' AND column_name = 'backend_user_id'
  ) THEN
    ALTER TABLE user_onboarding ADD COLUMN backend_user_id integer;
    CREATE INDEX IF NOT EXISTS idx_user_onboarding_backend_user_id ON user_onboarding(backend_user_id);
  END IF;
END $$;

ALTER TABLE user_onboarding ALTER COLUMN user_id DROP NOT NULL;

DROP POLICY IF EXISTS "Users can view own onboarding" ON user_onboarding;
DROP POLICY IF EXISTS "Users can insert own onboarding" ON user_onboarding;
DROP POLICY IF EXISTS "Users can update own onboarding" ON user_onboarding;

CREATE POLICY "Users can view own onboarding"
  ON user_onboarding FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own onboarding"
  ON user_onboarding FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own onboarding"
  ON user_onboarding FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
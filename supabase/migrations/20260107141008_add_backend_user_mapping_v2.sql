/*
  # Backend User ID Mapping

  1. Değişiklikler
    - `user_profiles` tablosuna `backend_user_id` kolonu ekleniyor
    - Backend API'den gelen user ID'lerini Supabase UUID'leriyle eşleştirmek için
    
  2. Önemli Notlar
    - backend_user_id her kullanıcı için benzersiz olmalı
    - Login sırasında backend_user_id kullanılarak Supabase UUID'si bulunacak
*/

-- user_profiles tablosuna backend_user_id kolonu ekle
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'backend_user_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN backend_user_id text UNIQUE;
    CREATE INDEX IF NOT EXISTS idx_user_profiles_backend_user_id ON user_profiles(backend_user_id);
  END IF;
END $$;

-- position kolonu ekle (eğer yoksa)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'position'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN position text;
  END IF;
END $$;
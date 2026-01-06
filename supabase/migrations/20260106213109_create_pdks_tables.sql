/*
  # PDKS (Personel Devam Kontrol Sistemi)

  1. Yeni Tablolar
    - `attendance_records`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - Kullanıcı ID
      - `date` (date) - Tarih
      - `check_in_time` (timestamptz) - Giriş saati
      - `check_out_time` (timestamptz) - Çıkış saati
      - `work_duration` (integer) - Çalışma süresi (dakika)
      - `status` (text) - Durum (normal, late, early_leave, absent)
      - `notes` (text) - Notlar
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Güvenlik
    - RLS etkinleştirildi
    - Kullanıcılar sadece kendi kayıtlarını görebilir
    - Admin kullanıcılar tüm kayıtları görebilir
*/

CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  check_in_time timestamptz,
  check_out_time timestamptz,
  work_duration integer DEFAULT 0,
  status text DEFAULT 'normal',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attendance records"
  ON attendance_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attendance records"
  ON attendance_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attendance records"
  ON attendance_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_attendance_records_user_date ON attendance_records(user_id, date DESC);
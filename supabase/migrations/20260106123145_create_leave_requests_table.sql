/*
  # İzin Talepleri Tablosu

  1. Yeni Tablolar
    - `leave_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key -> auth.users)
      - `leave_type` (text) - İzin türü
      - `start_date` (date) - Başlangıç tarihi
      - `end_date` (date) - Bitiş tarihi
      - `duration` (numeric) - Süre (gün)
      - `notes` (text) - Notlar
      - `status` (text) - Durum: pending, approved, rejected
      - `created_at` (timestamptz) - Oluşturulma tarihi
      - `updated_at` (timestamptz) - Güncellenme tarihi

  2. Güvenlik
    - RLS aktif
    - Kullanıcılar sadece kendi kayıtlarını görebilir
    - Kullanıcılar kendi izin taleplerini oluşturabilir
*/

CREATE TABLE IF NOT EXISTS leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  leave_type text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  duration numeric NOT NULL DEFAULT 1,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leave requests"
  ON leave_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own leave requests"
  ON leave_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leave requests"
  ON leave_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS leave_requests_user_id_idx ON leave_requests(user_id);
CREATE INDEX IF NOT EXISTS leave_requests_status_idx ON leave_requests(status);

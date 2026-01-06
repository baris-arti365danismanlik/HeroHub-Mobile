/*
  # Zimmet (Assets) Tablosu Oluşturma

  1. Yeni Tablo
    - `assets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key -> auth.users)
      - `category` (text) - Zimmet kategorisi (Bilgisayar, Telefon, vb.)
      - `serial_no` (text) - Seri numarası
      - `description` (text) - Zimmet açıklaması
      - `delivery_date` (date) - Teslim tarihi
      - `return_date` (date, nullable) - İade tarihi
      - `file_url` (text, nullable) - Eklenen dosya URL'si
      - `status` (text) - Durum (active, returned)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Güvenlik
    - RLS etkinleştirme
    - Kullanıcılar kendi zimmetlerini okuyabilir
    - Admin ve İK tüm zimmetleri okuyabilir/yazabilir
    - Admin tüm zimmetleri silebilir
*/

CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  serial_no text NOT NULL,
  description text,
  delivery_date date NOT NULL,
  return_date date,
  file_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'returned')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assets"
  ON assets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins and HR can view all assets"
  ON assets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN roles r ON r.id = up.role_id
      WHERE up.id = auth.uid()
      AND r.name IN ('Admin', 'İK')
    )
  );

CREATE POLICY "Admins and HR can insert assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN roles r ON r.id = up.role_id
      WHERE up.id = auth.uid()
      AND r.name IN ('Admin', 'İK')
    )
  );

CREATE POLICY "Admins and HR can update assets"
  ON assets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN roles r ON r.id = up.role_id
      WHERE up.id = auth.uid()
      AND r.name IN ('Admin', 'İK')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN roles r ON r.id = up.role_id
      WHERE up.id = auth.uid()
      AND r.name IN ('Admin', 'İK')
    )
  );

CREATE POLICY "Admins can delete assets"
  ON assets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      JOIN roles r ON r.id = up.role_id
      WHERE up.id = auth.uid()
      AND r.name = 'Admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);

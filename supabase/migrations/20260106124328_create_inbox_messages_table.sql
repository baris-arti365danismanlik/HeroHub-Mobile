/*
  # Gelen Kutusu Tablosu

  1. Yeni Tablolar
    - `inbox_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key -> auth.users) - Alıcı
      - `sender_name` (text) - Gönderen adı
      - `subject` (text) - Mesaj başlığı
      - `message` (text) - Mesaj içeriği
      - `is_read` (boolean) - Okundu mu?
      - `created_at` (timestamptz) - Gönderim tarihi
      - `updated_at` (timestamptz) - Güncellenme tarihi

  2. Güvenlik
    - RLS aktif
    - Kullanıcılar sadece kendilerine gönderilen mesajları görebilir
    - Kullanıcılar kendi mesajlarını güncelleyebilir (okundu işaretleme için)
*/

CREATE TABLE IF NOT EXISTS inbox_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_name text NOT NULL,
  subject text NOT NULL,
  message text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE inbox_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own inbox messages"
  ON inbox_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own inbox messages"
  ON inbox_messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS inbox_messages_user_id_idx ON inbox_messages(user_id);
CREATE INDEX IF NOT EXISTS inbox_messages_is_read_idx ON inbox_messages(is_read);
CREATE INDEX IF NOT EXISTS inbox_messages_created_at_idx ON inbox_messages(created_at DESC);

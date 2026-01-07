/*
  # Gelen Kutusu Mesaj Detaylarını Genişletme

  1. Değişiklikler
    - `inbox_messages` tablosuna yeni kolonlar eklendi:
      - `sender_photo` (text) - Gönderen profil fotoğrafı URL
      - `title` (text) - Mesaj ana başlığı (örn: HOLLANDA KONSOLOSLUĞU'NA)
      - `location` (text) - Konum bilgisi (örn: İstanbul, Türkiye)
      - `document_date` (text) - Belge tarihi (örn: 01.12.2024)

  2. Yeni Tablolar
    - `inbox_attachments`
      - `id` (uuid, primary key)
      - `message_id` (uuid, foreign key -> inbox_messages)
      - `name` (text) - Dosya adı
      - `url` (text) - Dosya URL
      - `type` (text) - Dosya tipi
      - `created_at` (timestamptz)

  3. Güvenlik
    - RLS aktif
    - Kullanıcılar sadece kendi mesajlarının eklerini görebilir
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inbox_messages' AND column_name = 'sender_photo'
  ) THEN
    ALTER TABLE inbox_messages ADD COLUMN sender_photo text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inbox_messages' AND column_name = 'title'
  ) THEN
    ALTER TABLE inbox_messages ADD COLUMN title text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inbox_messages' AND column_name = 'location'
  ) THEN
    ALTER TABLE inbox_messages ADD COLUMN location text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inbox_messages' AND column_name = 'document_date'
  ) THEN
    ALTER TABLE inbox_messages ADD COLUMN document_date text;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS inbox_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES inbox_messages(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inbox_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments of own messages"
  ON inbox_attachments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inbox_messages
      WHERE inbox_messages.id = inbox_attachments.message_id
      AND inbox_messages.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS inbox_attachments_message_id_idx ON inbox_attachments(message_id);

/*
  # Create user documents table

  1. New Tables
    - `user_documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text) - Document or folder name
      - `type` (text) - 'folder' or 'file'
      - `parent_id` (uuid, nullable) - For nested folders
      - `file_url` (text, nullable) - Storage URL for files
      - `file_size` (int8, nullable) - File size in bytes
      - `icon_type` (text) - Icon identifier (folder-blue, folder-yellow, doc, image, pdf, etc.)
      - `item_count` (text, nullable) - For folders: count display text
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, nullable) - User who created it
      - `is_shared` (boolean) - Whether document is shared
      
  2. Security
    - Enable RLS on `user_documents` table
    - Add policies for users to read their own documents
    - Add policies for users to manage their documents
*/

CREATE TABLE IF NOT EXISTS user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('folder', 'file')),
  parent_id uuid REFERENCES user_documents(id) ON DELETE CASCADE,
  file_url text,
  file_size int8,
  icon_type text NOT NULL DEFAULT 'folder-blue',
  item_count text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  is_shared boolean DEFAULT false
);

ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON user_documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON user_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON user_documents
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON user_documents
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_documents_user ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_parent ON user_documents(parent_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_type ON user_documents(type);
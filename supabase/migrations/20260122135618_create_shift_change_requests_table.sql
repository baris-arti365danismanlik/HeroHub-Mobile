/*
  # Create shift change requests table

  1. New Tables
    - `shift_change_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `current_shift_type` (text)
      - `requested_shift_type` (text)
      - `reason` (text, optional)
      - `effective_date` (date)
      - `status` (text: 'pending', 'approved', 'rejected')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `reviewed_by` (uuid, references auth.users, optional)
      - `reviewed_at` (timestamptz, optional)
      - `review_notes` (text, optional)
      
  2. Security
    - Enable RLS on `shift_change_requests` table
    - Add policy for authenticated users to read their own requests
    - Add policy for authenticated users to create their own requests
    - Add policy for HR/Admin users to read all requests
    - Add policy for HR/Admin users to update requests (approve/reject)
*/

CREATE TABLE IF NOT EXISTS shift_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_shift_type text NOT NULL,
  requested_shift_type text NOT NULL,
  reason text,
  effective_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  review_notes text,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

ALTER TABLE shift_change_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own shift change requests"
  ON shift_change_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own shift change requests"
  ON shift_change_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending shift change requests"
  ON shift_change_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE INDEX IF NOT EXISTS idx_shift_change_requests_user_id ON shift_change_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_shift_change_requests_status ON shift_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_shift_change_requests_effective_date ON shift_change_requests(effective_date);
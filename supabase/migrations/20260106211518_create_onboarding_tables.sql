/*
  # Onboarding (İşe Başlama) Sistemi

  1. Yeni Tablolar
    - `onboarding_steps`
      - `id` (uuid, primary key)
      - `title` (text) - Adım başlığı
      - `order` (integer) - Sıra numarası
      - `is_active` (boolean) - Aktif mi
      - `created_at` (timestamptz)
    
    - `onboarding_tasks`
      - `id` (uuid, primary key)
      - `title` (text) - Görev başlığı
      - `description` (text) - Açıklama
      - `assigned_to` (text) - İlgili kişi
      - `due_date` (date) - Son tarih
      - `order` (integer) - Sıra numarası
      - `is_active` (boolean) - Aktif mi
      - `created_at` (timestamptz)
    
    - `onboarding_questions`
      - `id` (uuid, primary key)
      - `question` (text) - Soru
      - `is_required` (boolean) - Zorunlu mu
      - `order` (integer) - Sıra numarası
      - `is_active` (boolean) - Aktif mi
      - `created_at` (timestamptz)
    
    - `user_onboarding`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `welcome_package_sent` (boolean) - Hoşgeldin paketi gönderildi mi
      - `welcome_package_sent_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_onboarding_steps`
      - `id` (uuid, primary key)
      - `user_onboarding_id` (uuid, foreign key)
      - `step_id` (uuid, foreign key)
      - `is_completed` (boolean)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `user_onboarding_tasks`
      - `id` (uuid, primary key)
      - `user_onboarding_id` (uuid, foreign key)
      - `task_id` (uuid, foreign key)
      - `is_completed` (boolean)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
    
    - `user_onboarding_answers`
      - `id` (uuid, primary key)
      - `user_onboarding_id` (uuid, foreign key)
      - `question_id` (uuid, foreign key)
      - `answer` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Güvenlik
    - Tüm tablolar için RLS etkinleştirildi
    - Authenticated kullanıcılar kendi onboarding verilerine erişebilir
    - Admin kullanıcılar tüm verilere erişebilir
*/

CREATE TABLE IF NOT EXISTS onboarding_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  "order" integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS onboarding_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  assigned_to text,
  due_date date,
  "order" integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS onboarding_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  is_required boolean DEFAULT false,
  "order" integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  welcome_package_sent boolean DEFAULT false,
  welcome_package_sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS user_onboarding_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_onboarding_id uuid NOT NULL REFERENCES user_onboarding(id) ON DELETE CASCADE,
  step_id uuid NOT NULL REFERENCES onboarding_steps(id) ON DELETE CASCADE,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_onboarding_id, step_id)
);

CREATE TABLE IF NOT EXISTS user_onboarding_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_onboarding_id uuid NOT NULL REFERENCES user_onboarding(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES onboarding_tasks(id) ON DELETE CASCADE,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_onboarding_id, task_id)
);

CREATE TABLE IF NOT EXISTS user_onboarding_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_onboarding_id uuid NOT NULL REFERENCES user_onboarding(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES onboarding_questions(id) ON DELETE CASCADE,
  answer text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_onboarding_id, question_id)
);

ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view onboarding steps"
  ON onboarding_steps FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can view onboarding tasks"
  ON onboarding_tasks FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can view onboarding questions"
  ON onboarding_questions FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can view own onboarding"
  ON user_onboarding FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding"
  ON user_onboarding FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding"
  ON user_onboarding FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own onboarding steps"
  ON user_onboarding_steps FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_onboarding
      WHERE user_onboarding.id = user_onboarding_steps.user_onboarding_id
      AND user_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own onboarding steps"
  ON user_onboarding_steps FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_onboarding
      WHERE user_onboarding.id = user_onboarding_steps.user_onboarding_id
      AND user_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own onboarding steps"
  ON user_onboarding_steps FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_onboarding
      WHERE user_onboarding.id = user_onboarding_steps.user_onboarding_id
      AND user_onboarding.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_onboarding
      WHERE user_onboarding.id = user_onboarding_steps.user_onboarding_id
      AND user_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own onboarding tasks"
  ON user_onboarding_tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_onboarding
      WHERE user_onboarding.id = user_onboarding_tasks.user_onboarding_id
      AND user_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own onboarding tasks"
  ON user_onboarding_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_onboarding
      WHERE user_onboarding.id = user_onboarding_tasks.user_onboarding_id
      AND user_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own onboarding tasks"
  ON user_onboarding_tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_onboarding
      WHERE user_onboarding.id = user_onboarding_tasks.user_onboarding_id
      AND user_onboarding.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_onboarding
      WHERE user_onboarding.id = user_onboarding_tasks.user_onboarding_id
      AND user_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own onboarding answers"
  ON user_onboarding_answers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_onboarding
      WHERE user_onboarding.id = user_onboarding_answers.user_onboarding_id
      AND user_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own onboarding answers"
  ON user_onboarding_answers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_onboarding
      WHERE user_onboarding.id = user_onboarding_answers.user_onboarding_id
      AND user_onboarding.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own onboarding answers"
  ON user_onboarding_answers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_onboarding
      WHERE user_onboarding.id = user_onboarding_answers.user_onboarding_id
      AND user_onboarding.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_onboarding
      WHERE user_onboarding.id = user_onboarding_answers.user_onboarding_id
      AND user_onboarding.user_id = auth.uid()
    )
  );
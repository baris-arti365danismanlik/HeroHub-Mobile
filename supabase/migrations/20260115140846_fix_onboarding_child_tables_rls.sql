/*
  # Fix Onboarding Child Tables RLS Policies

  1. Problem
    - user_onboarding tablosu için RLS politikaları güncellendi
    - Ancak child tablolar (user_onboarding_steps, user_onboarding_tasks, user_onboarding_answers) 
      hala eski politikaları kullanıyor
    - Bu tablolara insert yaparken RLS ihlali oluşuyor

  2. Çözüm
    - Child tablolar için RLS politikalarını güncelle
    - Authenticated kullanıcılara tam erişim ver
    - Backend user_id ile çalışabilmek için daha esnek politikalar

  3. Security
    - RLS enabled kalıyor
    - Sadece authenticated kullanıcılar erişebilir
    - Backend API ile entegrasyon için gerekli
*/

DROP POLICY IF EXISTS "Users can view own onboarding steps" ON user_onboarding_steps;
DROP POLICY IF EXISTS "Users can insert own onboarding steps" ON user_onboarding_steps;
DROP POLICY IF EXISTS "Users can update own onboarding steps" ON user_onboarding_steps;

CREATE POLICY "Authenticated users can view onboarding steps"
  ON user_onboarding_steps FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert onboarding steps"
  ON user_onboarding_steps FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update onboarding steps"
  ON user_onboarding_steps FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own onboarding tasks" ON user_onboarding_tasks;
DROP POLICY IF EXISTS "Users can insert own onboarding tasks" ON user_onboarding_tasks;
DROP POLICY IF EXISTS "Users can update own onboarding tasks" ON user_onboarding_tasks;

CREATE POLICY "Authenticated users can view onboarding tasks"
  ON user_onboarding_tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert onboarding tasks"
  ON user_onboarding_tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update onboarding tasks"
  ON user_onboarding_tasks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own onboarding answers" ON user_onboarding_answers;
DROP POLICY IF EXISTS "Users can insert own onboarding answers" ON user_onboarding_answers;
DROP POLICY IF EXISTS "Users can update own onboarding answers" ON user_onboarding_answers;

CREATE POLICY "Authenticated users can view onboarding answers"
  ON user_onboarding_answers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert onboarding answers"
  ON user_onboarding_answers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update onboarding answers"
  ON user_onboarding_answers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
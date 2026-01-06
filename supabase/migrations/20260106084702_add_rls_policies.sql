/*
  # RLS Politikaları

  1. Security
    - Tüm tablolarda RLS aktif
    - Authenticated kullanıcılar yetkilerine göre erişim sağlar
    - Admin rolü tüm yetkilere sahip
*/

-- Roles RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

-- Modules RLS
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read modules"
  ON modules FOR SELECT
  TO authenticated
  USING (true);

-- Role Authorization Modules RLS
ALTER TABLE role_authorization_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read authorizations"
  ON role_authorization_modules FOR SELECT
  TO authenticated
  USING (true);

-- User Profiles RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
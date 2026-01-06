/*
  # Rol ve Modül Bazlı Yetkilendirme Sistemi - Tablolar

  1. Yeni Tablolar
    - `roles` - Dinamik roller
    - `modules` - Uygulama modülleri
    - `role_authorization_modules` - Rol-Modül yetkilendirme ilişkisi
    - `user_profiles` - Kullanıcı profil bilgileri

  2. İlişkiler
    - user_profiles.role_id -> roles.id
    - role_authorization_modules.role_id -> roles.id
    - role_authorization_modules.module_id -> modules.id
*/

-- Roles tablosu
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Modules tablosu
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- User Profiles tablosu
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE SET NULL,
  full_name text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Role Authorization Modules tablosu
CREATE TABLE IF NOT EXISTS role_authorization_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  can_read boolean DEFAULT false,
  can_write boolean DEFAULT false,
  can_delete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, module_id)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_id ON user_profiles(role_id);
CREATE INDEX IF NOT EXISTS idx_role_auth_modules_role_id ON role_authorization_modules(role_id);
CREATE INDEX IF NOT EXISTS idx_role_auth_modules_module_id ON role_authorization_modules(module_id);
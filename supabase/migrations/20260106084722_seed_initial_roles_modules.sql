/*
  # Başlangıç Verileri

  1. Roller
    - Admin - Tam yetki
    - Yönetici - Yönetim yetkileri
    - İK - İnsan Kaynakları yetkileri
    - Çalışan - Temel kullanıcı yetkileri

  2. Modüller
    - Profil - Profil bilgileri
    - WorkInfo - Çalışma bilgileri
    - Leave - İzin bilgileri
    - Assignment - Zimmet bilgileri

  3. Yetkilendirmeler
    - Her rol için modül bazlı yetkiler
*/

-- Rolleri ekle
INSERT INTO roles (name, description) VALUES
  ('Admin', 'Sistem yöneticisi - tam yetki'),
  ('Yönetici', 'Departman yöneticisi'),
  ('İK', 'İnsan Kaynakları yetkilisi'),
  ('Çalışan', 'Standart çalışan')
ON CONFLICT (name) DO NOTHING;

-- Modülleri ekle
INSERT INTO modules (name, description) VALUES
  ('Profil', 'Profil bilgileri modülü'),
  ('WorkInfo', 'Çalışma bilgileri modülü'),
  ('Leave', 'İzin bilgileri modülü'),
  ('Assignment', 'Zimmet bilgileri modülü')
ON CONFLICT (name) DO NOTHING;

-- Admin yetkilerini ekle (her modülde tam yetki)
INSERT INTO role_authorization_modules (role_id, module_id, can_read, can_write, can_delete)
SELECT 
  r.id,
  m.id,
  true,
  true,
  true
FROM roles r
CROSS JOIN modules m
WHERE r.name = 'Admin'
ON CONFLICT (role_id, module_id) DO NOTHING;

-- Yönetici yetkilerini ekle
INSERT INTO role_authorization_modules (role_id, module_id, can_read, can_write, can_delete)
SELECT 
  r.id,
  m.id,
  true,
  CASE WHEN m.name IN ('WorkInfo', 'Leave') THEN true ELSE false END,
  false
FROM roles r
CROSS JOIN modules m
WHERE r.name = 'Yönetici'
ON CONFLICT (role_id, module_id) DO NOTHING;

-- İK yetkilerini ekle
INSERT INTO role_authorization_modules (role_id, module_id, can_read, can_write, can_delete)
SELECT 
  r.id,
  m.id,
  true,
  true,
  CASE WHEN m.name = 'Assignment' THEN true ELSE false END
FROM roles r
CROSS JOIN modules m
WHERE r.name = 'İK'
ON CONFLICT (role_id, module_id) DO NOTHING;

-- Çalışan yetkilerini ekle (sadece okuma)
INSERT INTO role_authorization_modules (role_id, module_id, can_read, can_write, can_delete)
SELECT 
  r.id,
  m.id,
  true,
  false,
  false
FROM roles r
CROSS JOIN modules m
WHERE r.name = 'Çalışan'
ON CONFLICT (role_id, module_id) DO NOTHING;
/*
  # Onboarding Örnek Verileri

  Varsayılan onboarding adımları, görevleri ve soruları eklenir.
*/

INSERT INTO onboarding_steps (title, "order", is_active) VALUES
  ('Hoşgeldin Paketi Gönderildi', 1, true),
  ('Hoşgeldin Paketi Görüntülendi', 2, true),
  ('Yeni Çalışan Bilgileri Dolduruldu', 3, true),
  ('Tanışma Soruları Cevaplandı', 4, true),
  ('İşe Başlama Görevleri Tamamlandı', 5, true),
  ('Hoşgeldin Görevleri Tamamlandı', 6, true)
ON CONFLICT DO NOTHING;

INSERT INTO onboarding_tasks (title, description, assigned_to, due_date, "order", is_active) VALUES
  ('Bilgi Teknolojileri', 'E-posta adresini oluştur', 'Phillip Stanton', '2025-11-13', 1, true),
  ('Çalışma ortamını ayarla', 'Çalışma ortamı hazırlanmalı', 'Tianna Rosser', '2025-11-12', 2, true),
  ('Telefon eklentisi kur', 'Telefon için gerekli uygulamalar kurulmalı', 'Maria Carder', '2025-11-12', 3, true),
  ('İnsan Kaynakları', 'Yeni işe giriş oryantasyonu', 'Phillip Stanton', '2025-11-13', 4, true)
ON CONFLICT DO NOTHING;

INSERT INTO onboarding_questions (question, is_required, "order", is_active) VALUES
  ('Nerede büyüdün?', false, 1, true),
  ('Nerede yaşıyorsun?', false, 2, true)
ON CONFLICT DO NOTHING;
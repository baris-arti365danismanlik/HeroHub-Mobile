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

INSERT INTO onboarding_tasks (title, description, category, assigned_to, due_date, "order", is_active) VALUES
  ('E-posta adresini oluştur', 'E-posta adresi oluşturulmalı', 'Bilgi Teknolojileri', 'Phillip Stanton', '2025-11-13', 1, true),
  ('Çalışma ortamını ayarla', 'Çalışma ortamı hazırlanmalı', 'Bilgi Teknolojileri', 'Tianna Rosser', '2025-12-11', 2, true),
  ('Telefon eklentisi kur', 'Telefon için gerekli uygulamalar kurulmalı', 'Bilgi Teknolojileri', 'Maria Carder', '2025-12-11', 3, true),
  ('Yeni işe giriş oryantasyonu', 'Yeni çalışan oryantasyonu yapılmalı', 'İnsan Kaynakları', 'Phillip Stanton', '2025-11-13', 4, true)
ON CONFLICT DO NOTHING;

INSERT INTO onboarding_questions (question, is_required, "order", is_active) VALUES
  ('Nerede büyüdün?', true, 1, true),
  ('Nerede yaşıyorsun?', true, 2, true)
ON CONFLICT DO NOTHING;
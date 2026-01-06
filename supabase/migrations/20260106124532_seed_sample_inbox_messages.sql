/*
  # Örnek Gelen Kutusu Mesajları

  Bu migration, kullanıcıların gelen kutusunda test amaçlı örnek mesajlar oluşturur.
*/

DO $$
DECLARE
  sample_user_id uuid;
BEGIN
  -- İlk kullanıcıyı al (test için)
  SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
  
  -- Eğer kullanıcı varsa, örnek mesajlar ekle
  IF sample_user_id IS NOT NULL THEN
    -- Mesaj 1 (Okunmamış)
    INSERT INTO inbox_messages (user_id, sender_name, subject, message, is_read, created_at)
    VALUES (
      sample_user_id,
      'Desmond Eagle',
      'Onboarding tamamlandı.',
      'Yeni çalışan onboarding süreci başarıyla tamamlandı.',
      false,
      NOW() - INTERVAL '2 hours'
    );

    -- Mesaj 2 (Okunmamış - Vize)
    INSERT INTO inbox_messages (user_id, sender_name, subject, message, is_read, created_at)
    VALUES (
      sample_user_id,
      'Selin Yeşilce',
      'Vize Evraki Talebi!',
      'Vize evrakları için talep oluşturuldu.',
      false,
      NOW() - INTERVAL '5 hours'
    );

    -- Mesaj 3
    INSERT INTO inbox_messages (user_id, sender_name, subject, message, is_read, created_at)
    VALUES (
      sample_user_id,
      'Alan Fresco',
      'Yeni pozisyon açıklandı.',
      'Yeni bir pozisyon için ilan yayınlandı.',
      true,
      NOW() - INTERVAL '1 day'
    );

    -- Mesaj 4
    INSERT INTO inbox_messages (user_id, sender_name, subject, message, is_read, created_at)
    VALUES (
      sample_user_id,
      'Phillip Anthrophy',
      'Yeni pozisyon açıklandı.',
      'Farklı bir departman için yeni pozisyon açıldı.',
      true,
      NOW() - INTERVAL '1 day'
    );

    -- Mesaj 5
    INSERT INTO inbox_messages (user_id, sender_name, subject, message, is_read, created_at)
    VALUES (
      sample_user_id,
      'Druid Wensleydale',
      'Yeni pozisyon açıklandı.',
      'Backend developer pozisyonu için başvurular alınıyor.',
      true,
      NOW() - INTERVAL '1 day'
    );

    -- Mesaj 6
    INSERT INTO inbox_messages (user_id, sender_name, subject, message, is_read, created_at)
    VALUES (
      sample_user_id,
      'Benjamin Evalent',
      'Yeni pozisyon açıklandı.',
      'Frontend developer pozisyonu için başvurular başladı.',
      true,
      NOW() - INTERVAL '1 day'
    );
  END IF;
END $$;

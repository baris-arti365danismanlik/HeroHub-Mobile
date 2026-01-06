/*
  # PDKS Örnek Verileri

  Örnek giriş/çıkış kayıtları eklenir.
*/

DO $$
DECLARE
  sample_user_id uuid;
BEGIN
  SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
  
  IF sample_user_id IS NOT NULL THEN
    INSERT INTO attendance_records (user_id, date, check_in_time, check_out_time, work_duration, status) VALUES
      (sample_user_id, CURRENT_DATE, CURRENT_DATE + TIME '08:30:00', CURRENT_DATE + TIME '17:45:00', 555, 'normal'),
      (sample_user_id, CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day' + TIME '08:15:00', CURRENT_DATE - INTERVAL '1 day' + TIME '17:30:00', 555, 'normal'),
      (sample_user_id, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days' + TIME '09:15:00', CURRENT_DATE - INTERVAL '2 days' + TIME '18:00:00', 525, 'late'),
      (sample_user_id, CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days' + TIME '08:00:00', CURRENT_DATE - INTERVAL '3 days' + TIME '17:00:00', 540, 'normal'),
      (sample_user_id, CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '4 days' + TIME '08:45:00', CURRENT_DATE - INTERVAL '4 days' + TIME '16:30:00', 465, 'early_leave')
    ON CONFLICT (user_id, date) DO NOTHING;
  END IF;
END $$;
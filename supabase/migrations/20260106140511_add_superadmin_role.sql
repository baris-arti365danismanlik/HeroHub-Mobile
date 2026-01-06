/*
  # Add SuperAdmin Role

  1. New Role
    - SuperAdmin: System super administrator with full access to everything

  2. Permissions
    - Full access to all modules including SuperAdmin module
*/

INSERT INTO roles (name, description) VALUES
  ('SuperAdmin', 'System super administrator with full access')
ON CONFLICT (name) DO NOTHING;

INSERT INTO role_authorization_modules (role_id, module_id, can_read, can_write, can_delete)
SELECT 
  r.id,
  m.id,
  true,
  true,
  true
FROM roles r
CROSS JOIN modules m
WHERE r.name = 'SuperAdmin'
ON CONFLICT (role_id, module_id) DO NOTHING;
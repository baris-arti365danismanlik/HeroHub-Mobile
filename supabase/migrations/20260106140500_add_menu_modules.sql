/*
  # Add Menu Modules

  1. New Modules
    - Adds modules for the drawer menu navigation
    - Each module represents a section of the application

  2. Modules Added
    - Home: Dashboard and home screen
    - Profile: User profile management
    - Requests: Leave and other requests
    - Employees: Employee management
    - Assets: Asset/equipment management
    - Leaves: Leave management
    - Inbox: Internal messaging
    - Admin: Admin panel
    - SuperAdmin: Super admin features
    - Roles: Role management
    - Organization: Organization settings

  3. Authorization Updates
    - Admin role gets full access to all new modules
    - Other roles will need manual permission assignment
*/

INSERT INTO modules (name, description) VALUES
  ('Home', 'Dashboard and home screen'),
  ('Profile', 'User profile management'),
  ('Requests', 'Leave and other requests'),
  ('Employees', 'Employee management'),
  ('Assets', 'Asset and equipment management'),
  ('Leaves', 'Leave management'),
  ('Inbox', 'Internal messaging'),
  ('Admin', 'Admin panel'),
  ('SuperAdmin', 'Super admin features'),
  ('Roles', 'Role management'),
  ('Organization', 'Organization settings')
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
WHERE r.name = 'Admin' 
  AND m.name IN ('Home', 'Profile', 'Requests', 'Employees', 'Assets', 'Leaves', 'Inbox', 'Admin', 'Roles', 'Organization')
ON CONFLICT (role_id, module_id) DO NOTHING;

INSERT INTO role_authorization_modules (role_id, module_id, can_read, can_write, can_delete)
SELECT 
  r.id,
  m.id,
  true,
  CASE WHEN m.name IN ('Requests', 'Leaves') THEN true ELSE false END,
  false
FROM roles r
CROSS JOIN modules m
WHERE r.name = 'Yönetici'
  AND m.name IN ('Home', 'Profile', 'Requests', 'Employees', 'Leaves')
ON CONFLICT (role_id, module_id) DO NOTHING;

INSERT INTO role_authorization_modules (role_id, module_id, can_read, can_write, can_delete)
SELECT 
  r.id,
  m.id,
  true,
  true,
  CASE WHEN m.name IN ('Assets', 'Employees') THEN true ELSE false END
FROM roles r
CROSS JOIN modules m
WHERE r.name = 'İK'
  AND m.name IN ('Home', 'Profile', 'Requests', 'Employees', 'Assets', 'Leaves', 'Inbox')
ON CONFLICT (role_id, module_id) DO NOTHING;

INSERT INTO role_authorization_modules (role_id, module_id, can_read, can_write, can_delete)
SELECT 
  r.id,
  m.id,
  true,
  CASE WHEN m.name IN ('Profile', 'Requests') THEN true ELSE false END,
  false
FROM roles r
CROSS JOIN modules m
WHERE r.name = 'Çalışan'
  AND m.name IN ('Home', 'Profile', 'Requests', 'Inbox')
ON CONFLICT (role_id, module_id) DO NOTHING;
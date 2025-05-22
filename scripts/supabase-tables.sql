-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_login TIMESTAMPTZ
);

-- Create employees table
CREATE TABLE IF NOT EXISTS public.employees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  certifications TEXT[] NOT NULL,
  shift TEXT NOT NULL,
  status TEXT NOT NULL,
  current_task TEXT,
  performance_score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  priority TEXT NOT NULL,
  duration INTEGER NOT NULL,
  required_skills TEXT[] NOT NULL,
  assigned_to INTEGER REFERENCES public.employees(id),
  status TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  time TEXT NOT NULL,
  source TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create shifts table
CREATE TABLE IF NOT EXISTS public.shifts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  employees_total INTEGER NOT NULL,
  employees_present INTEGER NOT NULL,
  task_coverage INTEGER NOT NULL,
  status TEXT NOT NULL
);

-- Create zones table
CREATE TABLE IF NOT EXISTS public.zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  task_count INTEGER NOT NULL,
  employee_count INTEGER NOT NULL,
  status TEXT NOT NULL
);

-- Insert default admin user
INSERT INTO public.users (email, password, name, role, created_at)
VALUES (
  'admin@amazon-warehouse.com',
  '$2a$10$8OwZ1wG9Y5.lQOJ2QrUoWO9RQzaby/Hg.jWQ.TD8KI0.fNrEPD7nS', -- admin123
  'System Administrator',
  'admin',
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Seed sample employees data
INSERT INTO public.employees (name, email, role, skills, certifications, shift, status, performance_score)
VALUES
  ('John Smith', 'john.smith@amazon.com', 'picker', ARRAY['picking', 'packing'], ARRAY['forklift', 'safety'], 'morning', 'active', 85),
  ('Jane Doe', 'jane.doe@amazon.com', 'packer', ARRAY['packing', 'sorting'], ARRAY['safety'], 'afternoon', 'active', 92),
  ('Michael Johnson', 'michael.j@amazon.com', 'supervisor', ARRAY['supervision', 'training'], ARRAY['leadership', 'safety'], 'night', 'active', 90)
ON CONFLICT (email) DO NOTHING;

-- Seed sample tasks
INSERT INTO public.tasks (id, type, priority, duration, required_skills, status, location)
VALUES
  ('TASK-001', 'picking', 'high', 30, ARRAY['picking'], 'pending', 'Zone A-12'),
  ('TASK-002', 'packing', 'medium', 45, ARRAY['packing'], 'pending', 'Zone B-05'),
  ('TASK-003', 'sorting', 'low', 20, ARRAY['sorting'], 'pending', 'Zone C-08')
ON CONFLICT (id) DO NOTHING;

-- Seed sample alerts
INSERT INTO public.alerts (type, title, description, time, source)
VALUES
  ('warning', 'Low Inventory', 'Inventory level below threshold in Zone A', '10:30 AM', 'inventory-system'),
  ('critical', 'Equipment Failure', 'Conveyor belt stopped in Zone B', '2:15 PM', 'equipment-monitor'),
  ('info', 'Shift Change', 'Afternoon shift starting in 15 minutes', '2:45 PM', 'scheduling')
ON CONFLICT DO NOTHING;

-- Seed sample shifts
INSERT INTO public.shifts (name, start_time, end_time, employees_total, employees_present, task_coverage, status)
VALUES
  ('Morning', '6:00 AM', '2:00 PM', 50, 48, 95, 'active'),
  ('Afternoon', '2:00 PM', '10:00 PM', 45, 42, 85, 'active'),
  ('Night', '10:00 PM', '6:00 AM', 30, 27, 90, 'active')
ON CONFLICT DO NOTHING;

-- Seed sample zones
INSERT INTO public.zones (id, name, task_count, employee_count, status)
VALUES
  ('A1', 'Receiving', 12, 8, 'active'),
  ('B2', 'Storage', 15, 10, 'active'),
  ('C3', 'Packaging', 20, 15, 'active'),
  ('D4', 'Shipping', 18, 12, 'active')
ON CONFLICT (id) DO NOTHING; 
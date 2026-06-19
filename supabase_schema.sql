-- Create the testimonials table
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  company text,
  feedback text NOT NULL,
  linkedin text,
  rating int DEFAULT 5,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- 1. Policy: Anyone can insert a testimonial (status will default to pending)
CREATE POLICY "Enable insert access for all users" ON testimonials
  FOR INSERT
  WITH CHECK (true);

-- 2. Policy: Anyone can read approved testimonials
CREATE POLICY "Enable read access for approved testimonials" ON testimonials
  FOR SELECT
  USING (status = 'approved');

-- 3. Policy: Admin/Full access for all operations (for simplicity as requested)
-- If you want to lock this down to an authenticated admin, you would change `true` to `auth.uid() = 'your_admin_user_id'`
CREATE POLICY "Enable full access for admins" ON testimonials
  FOR ALL
  USING (true)
  WITH CHECK (true);

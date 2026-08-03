-- ========================================================
-- CertiR Master Supabase Migration Script
-- Database: PostgreSQL (Supabase)
-- Project: zfgunzkqvjypliaocosp
-- ========================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  fee_amount NUMERIC NOT NULL,
  estimated_days INTEGER DEFAULT 3,
  documents_required JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT,
  service_selected TEXT NOT NULL,
  documents_required JSONB DEFAULT '[]'::jsonb,
  booking_status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BOOKING_DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.booking_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'Pending',
  payment_method TEXT DEFAULT 'UPI / Card',
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  certificate_type TEXT NOT NULL,
  address TEXT,
  pickup_address TEXT,
  preferred_pickup_date DATE,
  preferred_pickup_time TEXT,
  uploaded_documents JSONB DEFAULT '[]'::jsonb,
  additional_notes TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. DOCUMENTS VAULT TABLE
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  document_number TEXT,
  file_url TEXT,
  file_size TEXT,
  file_type TEXT,
  issue_date TEXT,
  expiry_date TEXT,
  status TEXT DEFAULT 'Active',
  is_verified BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS & POLICIES FOR AUTHENTICATED & ANONYMOUS USERS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookings Access" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Applications Access" ON public.applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Profiles Access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Services Access" ON public.services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Booking Documents Access" ON public.booking_documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Payments Access" ON public.payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Documents Vault Access" ON public.documents FOR ALL USING (true) WITH CHECK (true);

-- STORAGE BUCKET 'documents' SETUP
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true) 
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Storage Bucket Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Storage Bucket Public Select" ON storage.objects FOR SELECT USING (bucket_id = 'documents');

-- VERIFICATION SAMPLE RECORD INSERT
INSERT INTO public.bookings (
  customer_name, 
  mobile_number, 
  email, 
  address, 
  service_selected, 
  documents_required, 
  booking_status
) VALUES (
  'Rahul Sharma', 
  '+91 98765 43210', 
  'rahul.sharma@example.com', 
  'Flat 402, Sunshine Heights, Andheri West, Mumbai', 
  'Aadhaar New Enrollment & Update', 
  '["https://zfgunzkqvjypliaocosp.supabase.co/storage/v1/object/public/documents/sample_id.pdf"]'::jsonb, 
  'Pending'
);

-- VERIFICATION READ BACK
SELECT * FROM public.bookings ORDER BY created_at DESC LIMIT 5;

-- ============================================
-- SUPABASE DATABASE SETUP SCRIPT
-- Diário de Serviços MVP
-- ============================================

-- 1. Create ENUM type for service status
CREATE TYPE service_status AS ENUM ('pendente', 'em_andamento', 'concluido', 'cancelado');

-- 2. Create services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  service_type VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIME NOT NULL DEFAULT '08:00',
  end_time TIME NOT NULL DEFAULT '17:00',
  notes TEXT,
  status service_status DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create service_attachments table
CREATE TABLE service_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  file_url VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  company_name VARCHAR(255),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR BETTER QUERY PERFORMANCE
-- ============================================

CREATE INDEX idx_services_user_id ON services(user_id);
CREATE INDEX idx_services_date ON services(date);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_service_attachments_service_id ON service_attachments(service_id);
CREATE INDEX idx_profiles_id ON profiles(id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Services: Users can view/edit their own services
CREATE POLICY "Users can view their own services"
  ON services FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create services"
  ON services FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own services"
  ON services FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own services"
  ON services FOR DELETE
  USING (auth.uid() = user_id);

-- Service Attachments: Users can view/manage attachments for their services
CREATE POLICY "Users can view attachments for their services"
  ON service_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM services 
      WHERE services.id = service_attachments.service_id 
      AND auth.uid() = services.user_id
    )
  );

CREATE POLICY "Users can add attachments to their services"
  ON service_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM services 
      WHERE services.id = service_attachments.service_id 
      AND auth.uid() = services.user_id
    )
  );

CREATE POLICY "Users can delete attachments from their services"
  ON service_attachments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM services 
      WHERE services.id = service_attachments.service_id 
      AND auth.uid() = services.user_id
    )
  );

-- Profiles: Users can view/update their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- STORAGE SETUP
-- ============================================

-- Create a bucket for service attachments (execute from Supabase Dashboard)
-- Storage > Create a new bucket
-- Bucket name: service-attachments
-- Public: No
-- File size limit: 52428800 (50 MB)

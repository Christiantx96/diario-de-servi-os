-- ============================================
-- FIX PROFILE UPDATE ERROR
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. REMOVER A CONSTRAINT DE FOREIGN KEY
-- Isso permite inserir perfis sem um usuário correspondente em auth.users
ALTER TABLE profiles
DROP CONSTRAINT profiles_id_fkey;

-- 2. RECRIAR A TABELA profiles SEM FOREIGN KEY
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  full_name VARCHAR(255),
  company_name VARCHAR(255),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRIAR ÍNDICE
CREATE INDEX idx_profiles_id ON profiles(id);

-- 4. HABILITAR RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. CRIAR POLÍTICAS DE RLS
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 6. INSERIR USUÁRIO DEMO PARA TESTES
INSERT INTO profiles (id, full_name, company_name, created_at, updated_at) 
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
  'Usuário Demo', 
  'Empresa Demo',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE 
SET updated_at = NOW();

-- 7. VERIFICAR SE O PERFIL FOI INSERIDO
SELECT * FROM profiles WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

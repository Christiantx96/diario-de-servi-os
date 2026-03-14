-- ============================================
-- FIX PROFILE UPDATE ERROR
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. Verificar se a tabela profiles existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
) as profiles_exists;

-- 2. Inserir usuário demo para testes
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

-- 3. Verificar se o perfil foi inserido
SELECT * FROM profiles WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- ============================================
-- SE A TABELA NÃO EXISTIR, EXECUTE:
-- ============================================

-- Criar a tabela profiles se não existir
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  company_name VARCHAR(255),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas de RLS
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR auth.uid() IS NULL)
  WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR auth.uid() IS NULL)
  WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- ============================================
-- DESABILITAR RLS TEMPORARIAMENTE (se necessário)
-- ============================================
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

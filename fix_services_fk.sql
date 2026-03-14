-- ============================================
-- FIX FOREIGN KEY CONSTRAINT
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. VERIFICAR CONSTRAINTS ATUAIS
SELECT constraint_name, table_name, column_name 
FROM information_schema.key_column_usage 
WHERE table_name = 'services' AND constraint_type = 'FOREIGN KEY';

-- 2. REMOVER A CONSTRAINT DE FOREIGN KEY na tabela services
ALTER TABLE services
DROP CONSTRAINT IF EXISTS services_user_id_fkey;

-- 3. AGORA VOCÊ PODE INSERIR REGISTROS MESMO SEM USUÁRIO EM auth.users
-- Teste inserindo:
INSERT INTO services (user_id, date, client_name, service_type, location, description, start_time, end_time, status)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-03-14', 'João Silva', 'Limpeza', 'Rua Principal 123', 'Limpeza e organização', '08:00', '10:30', 'pendente'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-03-14', 'Maria Santos', 'Encanamento', 'Av. Brasil 456', 'Reparo de torneira', '11:00', '12:00', 'concluido');

-- 4. VERIFICAR SE FOI INSERIDO
SELECT id, user_id, date, client_name FROM services WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- ============================================
-- SE QUISER RECRIAR A TABELA SEM FOREIGN KEY
-- ============================================

-- Backup dos dados atuais (se houver)
-- CREATE TABLE services_backup AS SELECT * FROM services;

-- Dropped table:
-- DROP TABLE IF EXISTS services CASCADE;

-- Recriada sem FK:
-- CREATE TABLE services (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID NOT NULL,
--   date DATE NOT NULL,
--   client_name VARCHAR(255) NOT NULL,
--   service_type VARCHAR(255) NOT NULL,
--   location VARCHAR(255) NOT NULL,
--   description TEXT,
--   start_time TIME NOT NULL DEFAULT '08:00',
--   end_time TIME NOT NULL DEFAULT '17:00',
--   notes TEXT,
--   status service_status DEFAULT 'pendente',
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

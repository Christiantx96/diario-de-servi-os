-- ============================================
-- CRIAR STORAGE BUCKET PARA ANEXOS
-- Execute no Supabase SQL Editor
-- ============================================

-- Este bucket DEVE ser criado manualmente no Dashboard do Supabase.
-- SQL não pode criar buckets, apenas as políticas de acesso.

-- Depois de criar o bucket "service-attachments" no Dashboard, execute:

-- ============================================
-- POLÍTICAS DE ACESSO AO STORAGE
-- ============================================

-- Permitir upload de arquivos
CREATE POLICY "Users can upload files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'service-attachments' 
    AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NULL)
  );

-- Permitir visualizar/download de arquivos
CREATE POLICY "Users can view their files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'service-attachments' 
    AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NULL)
  );

-- Permitir deletar arquivos
CREATE POLICY "Users can delete their files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'service-attachments' 
    AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NULL)
  );

-- Se as políticas já existem e estão gerando conflito, use DROP first:
-- DROP POLICY IF EXISTS "Users can upload files" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can view their files" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can delete their files" ON storage.objects;

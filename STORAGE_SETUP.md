# 📸 Guia: Configurar Storage (Buckets) no Supabase

## 🚨 Erro Comum
```
Erro ao fazer upload. Certifique-se de que o bucket "service-attachments" existe e é público.
```

## ✅ Solução Passo-a-Passo

### 1️⃣ **Acessar Supabase Storage**

1. Vá para https://supabase.io → Seu Projeto
2. No menu lateral, clique em **Storage**
3. Você verá uma lista de buckets (provavelmente vazia)

---

### 2️⃣ **Criar o Bucket "service-attachments"**

1. Clique em **Create a new bucket**
2. Preencha os dados:
   - **Bucket name:** `service-attachments`
   - **Public bucket:** ✅ **SIM** (marque como público)
   - **File size limit:** `52428800` (50 MB)

3. Clique em **Create bucket**

---

### 3️⃣ **Verificar se o Bucket foi Criado**

Você deve ver na lista:
- ✅ `service-attachments` (status: Public)

---

### 4️⃣ **Configurar Políticas de Acesso (RLS)**

Se o bucket não permitir uploads, configure as políticas:

#### 4.1 Abrir SQL Editor

1. Menu lateral → **SQL Editor**
2. Clique em **New Query**

#### 4.2 Colar este SQL

```sql
-- Políticas de Upload, Download e Deleção de Arquivos

-- Permitir upload (INSERT)
CREATE POLICY "Permitir upload de arquivos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'service-attachments');

-- Permitir download (SELECT)
CREATE POLICY "Permitir download de arquivos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-attachments');

-- Permitir deleção (DELETE)
CREATE POLICY "Permitir deleção de arquivos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'service-attachments');

-- Permitir update (UPDATE)
CREATE POLICY "Permitir atualizar arquivos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'service-attachments');
```

#### 4.3 Executar

1. Clique em **▶️ Execute**
2. Se rodar com sucesso, ok! Se disser que já existe, ignore.

---

### 5️⃣ **Testar Upload**

Agora tente:

1. Vá para http://localhost:3000
2. Clique em **"Novo Serviço"**
3. Preencha os dados
4. Tente anexar uma imagem/documento

Deve funcionar! ✅

---

## 🔍 Verificação Rápida

**Bucket existe?**
```bash
Storage → Veja "service-attachments" na lista
```

**Bucket é público?**
```bash
Storage → service-attachments → Configurações
"Public bucket" deve estar ✅ marcado
```

---

## 🐛 Se Ainda Não Funcionar

1. **Recarregue a página** (F5)
2. **Reinicie o servidor** (`npm run dev`)
3. **Verifique o console** (F12) para ver logs de erro
4. **Copie a mensagem de erro** e mostre

---

## 📝 Dicas Extras

- **Limite de tamanho:** 50 MB por arquivo (configurável)
- **Tipos de arquivo:** Sem restrição (imagens, PDFs, etc.)
- **Privacidade:** O bucket é público, qualquer um acessa via URL pública

---

## ✨ URL de Download

Depois de fazer upload, a URL será:
```
https://aypdlxkhsbpaihvahveo.supabase.co/storage/v1/object/public/service-attachments/service-id/filename.jpg
```

Pronto! 🎉

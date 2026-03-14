# 📋 Guia de Setup - Supabase Database

## Tablestáticas Necessárias

Seu sistema utiliza **3 tabelas principais**:

### 1. **services** - Serviços Registrados
```
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key)
├── date (DATE)
├── client_name (VARCHAR)
├── service_type (VARCHAR)
├── location (VARCHAR)
├── description (TEXT)
├── start_time (TIME)
├── end_time (TIME)
├── notes (TEXT)
├── status (ENUM: pendente, em_andamento, concluido, cancelado)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### 2. **service_attachments** - Anexos dos Serviços
```
├── id (UUID, Primary Key)
├── service_id (UUID, Foreign Key → services)
├── file_url (VARCHAR)
├── file_type (VARCHAR)
├── file_name (VARCHAR)
└── created_at (TIMESTAMP)
```

### 3. **profiles** - Perfil do Usuário
```
├── id (UUID, Primary Key → auth.users)
├── full_name (VARCHAR)
├── company_name (VARCHAR, nullable)
├── avatar_url (VARCHAR, nullable)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

---

## 🚀 Passo a Passo para Criar as Tabelas

### Opção 1: SQL Editor do Supabase (RECOMENDADO)

1. Acesse [supabase.io](https://supabase.io) → Seu Projeto
2. Vá em **SQL Editor**
3. Clique em **New Query**
4. Cole o conteúdo do arquivo `supabase_setup.sql`
5. Clique em **▶️ Execute**

### Opção 2: Criar Manualmente no Dashboard

**Recomendaremos apenas se a Opção 1 falhar!**

---

## 🔧 Pós-Setup - Adicional

### Criar Storage Bucket para Anexos

1. Vá em **Storage** → **Create new bucket**
2. Nome: `service-attachments`
3. Marque como **Privado** (Not public)
4. File size limit: `52428800` (50 MB)
5. Clique em **Create bucket**

### Configurar Políticas de Acesso

No SQL Editor, execute:

```sql
-- Permitir upload de anexos
CREATE POLICY "Users can upload files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'service-attachments' AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NULL));

-- Permitir download de anexos
CREATE POLICY "Users can view their files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'service-attachments' AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NULL));

-- Permitir deletar anexos
CREATE POLICY "Users can delete their files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'service-attachments' AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() IS NULL));
```

---

## ✅ Verificar Criação das Tabelas

1. Vá em **Table Editor** no Supabase Dashboard
2. Você deve ver:
   - ✅ `services`
   - ✅ `service_attachments`
   - ✅ `profiles`

---

## 🔐 Notas de Segurança

- **RLS (Row Level Security)**: Já está configurado no script
- Sem autenticação ativa: As políticas permitem `auth.uid() IS NULL`
- Quando ativar autenticação, remova a condição `OR auth.uid() IS NULL` das policies

---

## 🐛 Troubleshooting

**Erro ao executar SQL?**
- Verifique se você está no projeto correto
- Teste executar comando por comando

**Tabelas não aparecem?**
- Recarregue a página do Supabase Dashboard
- Verifique o schema padrão (`public`)

---

## 📝 Próximos Passos

Após criar as tabelas:

1. Configure as variáveis de ambiente (`.env.local`):
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-aqui
   ```

2. Reinicie o dev server:
   ```bash
   npm run dev
   ```

3. Acesse `http://localhost:3000/` e comece a usar! 🎉

# 🚀 Guia de Deploy no Vercel

## ✅ Pré-requisitos

1. ✅ Conta no [Vercel](https://vercel.com)
2. ✅ GitHub conectado (já feito)
3. ✅ Variáveis de ambiente configuradas

---

## 📋 Passo 1: Configurar Variáveis de Ambiente

### 1.1 Localizar suas chaves

**Supabase:**
- Acesse: https://supabase.io → Seu Projeto → Settings → API
- Copie:
  - `VITE_SUPABASE_URL` (Project URL)
  - `VITE_SUPABASE_ANON_KEY` (anon public)

**Gemini API:**
- Acesse: https://aistudio.google.com/
- Copie sua chave: `GEMINI_API_KEY`

### 1.2 Atualizar arquivo `.env.production`

Edit ``.env.production`` com suas chaves reais:

```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
GEMINI_API_KEY=sua-chave-gemini-aqui
```

---

## 📦 Passo 2: Deploy no Vercel

### 2.1 Acessar Vercel Dashboard

1. Vá para https://vercel.com/dashboard
2. Clique em **Add new** → **Project**

### 2.2 Conectar Repositório

1. Clique em **Import Git Repository**
2. Selecione seu repositório GitHub: `diario-de-servi-os`
3. Clique em **Import**

### 2.3 Configurar Projeto

**Framework Preset:** Vite
**Root Directory:** `.` (deixe em branco, é a raiz)
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### 2.4 Adicionar Variáveis de Ambiente

1. Na seção **Environment Variables**, adicione:

```
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = sua-chave-anonima
GEMINI_API_KEY = sua-chave-gemini
```

2. Selecione todos os ambientes (Production, Preview, Development)

### 2.5 Fazer Deploy

1. Clique em **Deploy**
2. Aguarde o build completar (2-3 minutos)
3. Seu app estará em: `https://seu-projeto.vercel.app`

---

## 🔄 Deployment Automático

**Cada vez que você fazer push**:

```bash
git add .
git commit -m "sua mensagem"
git push origin main
```

Vercel **automaticamente**:
- ✅ Detecta as mudanças
- ✅ Faz o build
- ✅ Testa a aplicação
- ✅ Faz deploy em produção

---

## 🐛 Troubleshooting

### ❌ "Build failed"
- Verifique se as variáveis de ambiente estão corretas
- Veja o log de build no Vercel Dashboard

### ❌ "Cannot find module"
- Certifique-se de ter executado `npm install` localmente
- Verifique o `package.json` para dependências faltantes

### ❌ "Blank page"
- Verifique as variáveis do Supabase
- Abra o console (F12) e veja os erros

---

## 📝 Arquivos Criados

- ✅ `vercel.json` - Configuração do Vercel
- ✅ `.env.production` - Variáveis de produção
- ✅ `.vercelignore` - Arquivos a ignorar no deploy

---

## ✨ Próximos Passos

Após o deploy:

1. Teste a aplicação em produção
2. Configure domínio customizado (opcional)
3. Configure CI/CD avançado se necessário

**URL do seu projeto:** https://seu-projeto.vercel.app

🎉 Pronto! Seu projeto está no ar!

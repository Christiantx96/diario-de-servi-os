import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      alert('Verifique seu e-mail para confirmar o cadastro!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-brown-primary/5">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brown-primary text-ivory rounded-full mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-bold text-brown-primary">Bem-vindo</h1>
          <p className="text-brown-primary/60">Acesse sua conta para gerenciar seus serviços</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brown-primary mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brown-primary mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="text-sm text-brown-primary/60 hover:text-brown-primary transition-colors"
            >
              Não tem uma conta? <span className="font-bold text-green-action">Cadastre-se</span>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-brown-primary/5 text-center">
          <p className="text-xs text-brown-primary/40 italic">
            "Organização é a chave para a produtividade."
          </p>
        </div>
      </div>
    </div>
  );
}


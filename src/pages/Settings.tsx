import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Mail, Building, Save, Camera } from 'lucide-react';

export default function Settings() {
  // Note: Authentication has been removed from this app
  // Using a placeholder user ID for database operations
  const user = null;
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    company_name: '',
  });

  useEffect(() => {
    // Profile loading is disabled without authentication
    // fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          company_name: data.company_name || '',
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: profile.full_name,
          company_name: profile.company_name,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Erro ao atualizar perfil. Verifique se a tabela "profiles" existe.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-brown-primary">Configurações</h1>
        <p className="text-brown-primary/60">Gerencie suas informações pessoais e da empresa.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={updateProfile} className="card space-y-6">
            <h2 className="text-xl font-bold text-brown-primary border-b border-brown-primary/5 pb-2">Perfil do Prestador</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-brown-primary">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-primary/40" size={20} />
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="input-field pl-10"
                    placeholder="Seu nome"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-brown-primary">Nome da Empresa (Opcional)</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-primary/40" size={20} />
                  <input
                    type="text"
                    value={profile.company_name}
                    onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                    className="input-field pl-10"
                    placeholder="Nome da sua empresa"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-brown-primary">E-mail (Não alterável)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-primary/40" size={20} />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-field pl-10 bg-ivory/50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8">
                <Save size={20} />
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>

          <div className="card space-y-4 bg-red-50 border-red-100">
            <h2 className="text-xl font-bold text-red-700">Zona de Perigo</h2>
            <p className="text-sm text-red-600">Ações irreversíveis para sua conta.</p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
              Excluir Minha Conta
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-ivory rounded-full border-4 border-white shadow-md flex items-center justify-center text-brown-primary/20 overflow-hidden">
                <User size={64} />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-green-action text-white rounded-full shadow-lg hover:bg-green-hover transition-colors">
                <Camera size={20} />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-lg text-brown-primary">{profile.full_name || 'Seu Nome'}</h3>
              <p className="text-sm text-brown-primary/60">{user?.email}</p>
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="font-bold text-brown-primary">Sobre o App</h3>
            <div className="space-y-2 text-sm text-brown-primary/60">
              <div className="flex justify-between">
                <span>Versão</span>
                <span className="font-mono">1.0.0-mvp</span>
              </div>
              <div className="flex justify-between">
                <span>Status do Sistema</span>
                <span className="text-green-action font-bold">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

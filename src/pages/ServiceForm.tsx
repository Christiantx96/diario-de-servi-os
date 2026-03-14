import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Service, ServiceStatus } from '../types';
import { ArrowLeft, Save, Trash2, Upload, X, Image as ImageIcon, FileText } from 'lucide-react';

export default function ServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<Partial<Service>>({
    date: new Date().toISOString().split('T')[0],
    client_name: '',
    service_type: '',
    location: '',
    description: '',
    start_time: '08:00',
    end_time: '17:00',
    notes: '',
    status: 'pendente' as ServiceStatus,
  });

  useEffect(() => {
    if (isEditing) {
      fetchService();
    }
  }, [id]);

  async function fetchService() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*, service_attachments(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          date: data.date,
          client_name: data.client_name,
          service_type: data.service_type,
          location: data.location,
          description: data.description,
          start_time: data.start_time,
          end_time: data.end_time,
          notes: data.notes,
          status: data.status,
        });
        setAttachments(data.service_attachments || []);
      }
    } catch (err) {
      console.error('Error fetching service:', err);
      navigate('/services');
    } finally {
      setFetching(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const DEMO_USER_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
      const payload = {
        ...formData,
        user_id: DEMO_USER_ID, // Adiciona user_id ao serviço
      };

      let serviceId = id;

      if (isEditing) {
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('services')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        serviceId = data.id;
      }

      navigate(`/services/${serviceId}`);
    } catch (err: any) {
      console.error('Error saving service:', err);
      const errorMsg = err?.message || 'Erro desconhecido';
      alert(`Erro ao salvar serviço:\n${errorMsg}\n\nVerifique se as tabelas existem no Supabase.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
      navigate('/services');
    } catch (err) {
      console.error('Error deleting service:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !id) return;

    setUploading(true);
    try {
      for (const file of Array.from(files) as File[]) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('service-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('service-attachments')
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('service_attachments')
          .insert([{
            service_id: id,
            file_url: publicUrl,
            file_type: file.type.startsWith('image/') ? 'image' : 'document'
          }]);

        if (dbError) throw dbError;
      }
      fetchService(); // Refresh attachments
    } catch (err: any) {
      console.error('Error uploading file:', err);
      const errorMsg = err?.message || 'Erro desconhecido';
      alert(`Erro ao fazer upload:\n${errorMsg}\n\nCertifique-se de que:\n1. O bucket "service-attachments" foi criado no Supabase\n2. As políticas de RLS estão configuradas corretamente`);
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = async (attachmentId: string, fileUrl: string) => {
    try {
      // Extract path from URL
      const path = fileUrl.split('service-attachments/').pop();
      if (path) {
        await supabase.storage.from('service-attachments').remove([path]);
      }
      
      await supabase.from('service_attachments').delete().eq('id', attachmentId);
      setAttachments(prev => prev.filter(a => a.id !== attachmentId));
    } catch (err) {
      console.error('Error removing attachment:', err);
    }
  };

  if (fetching) return <div className="p-12 text-center">Carregando...</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-brown-primary/5 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-brown-primary">
              {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
            </h1>
            <p className="text-sm text-brown-primary/60">Preencha os detalhes do atendimento.</p>
          </div>
        </div>
        {isEditing && (
          <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={20} />
          </button>
        )}
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-bold text-brown-primary border-b border-brown-primary/5 pb-2">Informações Básicas</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Data</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="input-field" required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Cliente</label>
                <input type="text" name="client_name" value={formData.client_name} onChange={handleInputChange} className="input-field" placeholder="Nome do cliente" required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Local</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input-field" placeholder="Endereço ou local" required />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-bold text-brown-primary border-b border-brown-primary/5 pb-2">Detalhes do Serviço</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Serviço</label>
                <input type="text" name="service_type" value={formData.service_type} onChange={handleInputChange} className="input-field" placeholder="Ex: Manutenção Elétrica" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field min-h-[100px]" placeholder="O que foi realizado?" required />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-bold text-brown-primary border-b border-brown-primary/5 pb-2">Horários e Status</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Início</label>
                <input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Término</label>
                <input type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} className="input-field" required />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="input-field">
                  <option value="pendente">Pendente</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-bold text-brown-primary border-b border-brown-primary/5 pb-2">Observações Adicionais</h2>
            <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="input-field min-h-[100px]" placeholder="Notas internas ou observações extras..." />
          </div>

          {isEditing && (
            <div className="card space-y-4">
              <div className="flex items-center justify-between border-b border-brown-primary/5 pb-2">
                <h2 className="font-bold text-brown-primary">Anexos</h2>
                <label className="cursor-pointer text-green-action hover:text-green-hover transition-colors">
                  <Upload size={20} />
                  <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {attachments.map((att) => (
                  <div key={att.id} className="relative group aspect-square bg-ivory rounded-lg overflow-hidden border border-brown-primary/5">
                    {att.file_type === 'image' ? (
                      <img src={att.file_url} alt="Anexo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brown-primary/40">
                        <FileText size={24} />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id, att.file_url)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {uploading && (
                  <div className="aspect-square bg-ivory rounded-lg flex items-center justify-center animate-pulse">
                    <Upload size={20} className="text-brown-primary/20" />
                  </div>
                )}
                {attachments.length === 0 && !uploading && (
                  <div className="col-span-3 py-4 text-center text-xs text-brown-primary/40 italic">
                    Nenhum anexo. Salve o serviço primeiro para habilitar o upload.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 text-brown-primary/60 font-medium hover:bg-brown-primary/5 rounded-lg transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8">
            <Save size={20} />
            {loading ? 'Salvando...' : 'Salvar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
}


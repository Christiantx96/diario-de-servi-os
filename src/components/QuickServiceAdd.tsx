import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Plus, Save, Trash2 } from 'lucide-react';

interface QuickService {
  id: string;
  client_name: string;
  service_type: string;
  location: string;
  start_time: string;
  end_time: string;
  description: string;
  notes: string;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
}

interface QuickServiceAddProps {
  selectedDate: string;
  onServicesAdded?: () => void;
}

export function QuickServiceAdd({ selectedDate, onServicesAdded }: QuickServiceAddProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState<QuickService[]>([]);
  const [saving, setSaving] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<QuickService>>({
    client_name: '',
    service_type: '',
    location: '',
    start_time: '08:00',
    end_time: '17:00',
    description: '',
    notes: '',
    status: 'pendente',
  });

  const DEMO_USER_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  const addService = () => {
    if (!currentService.client_name || !currentService.service_type) {
      alert('Preencha pelo menos Cliente e Tipo de Serviço');
      return;
    }

    const newService: QuickService = {
      id: Date.now().toString(),
      client_name: currentService.client_name || '',
      service_type: currentService.service_type || '',
      location: currentService.location || '',
      start_time: currentService.start_time || '08:00',
      end_time: currentService.end_time || '17:00',
      description: currentService.description || '',
      notes: currentService.notes || '',
      status: currentService.status || 'pendente',
    };

    setServices([...services, newService]);
    setCurrentService({
      client_name: '',
      service_type: '',
      location: '',
      start_time: '08:00',
      end_time: '17:00',
      description: '',
      notes: '',
      status: 'pendente',
    });
  };

  const removeService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const saveAllServices = async () => {
    if (services.length === 0) {
      alert('Adicione pelo menos um serviço');
      return;
    }

    setSaving(true);
    try {
      const servicesToInsert = services.map(s => ({
        user_id: DEMO_USER_ID,
        date: selectedDate,
        client_name: s.client_name,
        service_type: s.service_type,
        location: s.location,
        start_time: s.start_time,
        end_time: s.end_time,
        description: s.description,
        notes: s.notes,
        status: s.status,
      }));

      const { error } = await supabase
        .from('services')
        .insert(servicesToInsert);

      if (error) throw error;

      alert(`${services.length} serviço(s) adicionado(s) com sucesso!`);
      setServices([]);
      setIsOpen(false);
      onServicesAdded?.();
    } catch (err: any) {
      console.error('Error saving services:', err);
      alert(`Erro ao salvar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-action text-white rounded-lg hover:bg-green-hover transition-colors"
      >
        <Plus size={18} />
        Adicionar Múltiplos Serviços
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-brown-primary text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Adicionar Múltiplos Serviços</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Form para novo serviço */}
          <div className="space-y-4 p-4 bg-ivory rounded-lg border border-brown-primary/10">
            <h3 className="font-bold text-brown-primary">Novo Serviço</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Cliente"
                value={currentService.client_name || ''}
                onChange={(e) => setCurrentService({ ...currentService, client_name: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Tipo de Serviço"
                value={currentService.service_type || ''}
                onChange={(e) => setCurrentService({ ...currentService, service_type: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Local"
                value={currentService.location || ''}
                onChange={(e) => setCurrentService({ ...currentService, location: e.target.value })}
                className="input-field"
              />
              <select
                value={currentService.status || 'pendente'}
                onChange={(e) => setCurrentService({ ...currentService, status: e.target.value as any })}
                className="input-field"
              >
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>

              <input
                type="time"
                placeholder="Início"
                value={currentService.start_time || '08:00'}
                onChange={(e) => setCurrentService({ ...currentService, start_time: e.target.value })}
                className="input-field"
              />
              <input
                type="time"
                placeholder="Fim"
                value={currentService.end_time || '17:00'}
                onChange={(e) => setCurrentService({ ...currentService, end_time: e.target.value })}
                className="input-field"
              />
            </div>

            <textarea
              placeholder="Descrição (opcional)"
              value={currentService.description || ''}
              onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
              className="input-field w-full h-20"
            />

            <textarea
              placeholder="Observações (opcional)"
              value={currentService.notes || ''}
              onChange={(e) => setCurrentService({ ...currentService, notes: e.target.value })}
              className="input-field w-full h-16"
            />

            <button
              onClick={addService}
              className="w-full flex items-center justify-center gap-2 btn-primary"
            >
              <Plus size={18} />
              Adicionar à Lista
            </button>
          </div>

          {/* Lista de serviços adicionados */}
          {services.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-brown-primary">
                Serviços Adicionados ({services.length})
              </h3>

              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-3 bg-ivory rounded-lg border border-green-action/20 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="font-bold text-brown-primary">{service.client_name}</p>
                    <p className="text-sm text-brown-primary/60 gap-2">
                      <span>{service.service_type}</span>
                      {' • '}
                      <span>{service.start_time} - {service.end_time}</span>
                    </p>
                    {service.location && (
                      <p className="text-xs text-brown-primary/50">📍 {service.location}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeService(service.id)}
                    className="p-2 hover:bg-red-100 rounded text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-3 pt-4 border-t border-brown-primary/10">
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 border border-brown-primary text-brown-primary rounded-lg hover:bg-brown-primary/5"
            >
              Cancelar
            </button>
            <button
              onClick={saveAllServices}
              disabled={saving || services.length === 0}
              className="flex-1 flex items-center justify-center gap-2 btn-primary disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Salvando...' : `Salvar ${services.length} Serviço(s)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

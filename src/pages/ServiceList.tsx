import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Service } from '../types';
import { Search, Filter, Plus, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('date', { ascending: false })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredServices = services.filter(s => 
    s.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group services by date
  const groupedServices: { [key: string]: Service[] } = {};
  filteredServices.forEach(service => {
    if (!groupedServices[service.date]) {
      groupedServices[service.date] = [];
    }
    groupedServices[service.date].push(service);
  });

  const sortedDates = Object.keys(groupedServices).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brown-primary">Serviços</h1>
          <p className="text-brown-primary/60">Gerencie todos os seus registros diários.</p>
        </div>
        <Link to="/services/new" className="btn-primary flex items-center gap-2 self-start">
          <Plus size={20} />
          Novo Registro
        </Link>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-primary/40" size={20} />
          <input
            type="text"
            placeholder="Buscar por cliente, tipo ou local..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-brown-primary/10 rounded-lg text-brown-primary/60 hover:bg-ivory transition-colors">
          <Filter size={20} />
          Filtros
        </button>
      </div>

      {/* Grouped List */}
      <div className="space-y-8">
        {loading ? (
          <div className="p-12 text-center text-brown-primary/40">Carregando serviços...</div>
        ) : sortedDates.length === 0 ? (
          <div className="card p-12 text-center text-brown-primary/40">
            Nenhum serviço encontrado.
          </div>
        ) : (
          sortedDates.map(date => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-2 text-brown-primary/40 px-2">
                <CalendarIcon size={16} />
                <h2 className="text-sm font-bold uppercase tracking-widest">
                  {format(parseISO(date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </h2>
              </div>
              
              <div className="grid gap-3">
                {groupedServices[date].map(service => (
                  <Link
                    key={service.id}
                    to={`/services/${service.id}`}
                    className="card p-4 flex items-center justify-between hover:border-green-action/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px] border-r border-brown-primary/5 pr-4">
                        <p className="text-xs text-brown-primary/40 font-bold uppercase">Início</p>
                        <p className="font-bold text-brown-primary">{service.start_time}</p>
                      </div>
                      <div>
                        <h3 className="font-bold text-brown-primary group-hover:text-green-action transition-colors">
                          {service.client_name}
                        </h3>
                        <p className="text-sm text-brown-primary/60">{service.service_type}</p>
                        <p className="text-xs text-brown-primary/40 mt-1">{service.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "hidden md:inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        service.status === 'concluido' ? "bg-green-action/10 text-green-action" :
                        service.status === 'em_andamento' ? "bg-blue-500/10 text-blue-500" :
                        "bg-yellow-500/10 text-yellow-500"
                      )}>
                        {service.status.replace('_', ' ')}
                      </span>
                      <ChevronRight className="text-brown-primary/20 group-hover:text-green-action transition-colors" size={20} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

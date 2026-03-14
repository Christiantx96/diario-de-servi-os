import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Service } from '../types';
import { ClipboardList, Calendar, Clock, TrendingUp, Plus } from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch all services without user filtering
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');

  const servicesToday = services.filter(s => s.date === today).length;
  const servicesThisWeek = services.filter(s => s.date >= weekStart && s.date <= weekEnd).length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brown-primary">Dashboard</h1>
          <p className="text-brown-primary/60">Bem-vindo de volta! Veja o resumo dos seus serviços.</p>
        </div>
        <Link to="/services" className="btn-primary flex items-center gap-2 self-start">
          <Plus size={20} />
          Ver Serviços
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-action/10 text-green-action rounded-xl">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-brown-primary/60">Serviços Hoje</p>
            <p className="text-2xl font-bold">{servicesToday}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-brown-primary/10 text-brown-primary rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-brown-primary/60">Serviços na Semana</p>
            <p className="text-2xl font-bold">{servicesThisWeek}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-sm text-brown-primary/60">Total de Registros</p>
            <p className="text-2xl font-bold">{services.length}</p>
          </div>
        </div>
      </div>

      {/* Recent Services */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-brown-primary">Últimos Registros</h2>
          <Link to="/services" className="text-sm text-green-action font-medium hover:underline">
            Ver todos
          </Link>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="p-8 text-center text-brown-primary/40">Carregando...</div>
          ) : services.length === 0 ? (
            <div className="card p-12 text-center text-brown-primary/40">
              Nenhum serviço registrado ainda.
            </div>
          ) : (
            services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-green-action/30 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-ivory rounded-lg flex items-center justify-center text-brown-primary/40 group-hover:bg-green-action/10 group-hover:text-green-action transition-colors">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-brown-primary">{service.client_name}</h3>
                    <p className="text-sm text-brown-primary/60">{service.service_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-medium text-brown-primary">
                      {format(new Date(service.date), "dd 'de' MMMM", { locale: ptBR })}
                    </p>
                    <p className="text-brown-primary/40">{service.start_time} - {service.end_time}</p>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    service.status === 'concluido' ? "bg-green-action/10 text-green-action" :
                    service.status === 'em_andamento' ? "bg-blue-500/10 text-blue-500" :
                    "bg-yellow-500/10 text-yellow-500"
                  )}>
                    {service.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

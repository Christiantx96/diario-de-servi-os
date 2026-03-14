import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Download, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReportPDF } from '../components/ReportPDF';
import { useAuth } from '../contexts/AuthContext';

export default function Reports() {
  const { user, loading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providerName, setProviderName] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    async function loadProfile(currentUserId: string) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', currentUserId)
          .single();
        
        if (isMounted && data?.full_name) {
          setProviderName(data.full_name);
        } else if (isMounted) {
          setProviderName('Prestador de Serviços');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (isMounted) setProviderName('Prestador de Serviços');
      }
    }
    
    if (user) {
      loadProfile(user.id);
    }
    return () => { isMounted = false; };
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    
    async function load(currentUserId: string) {
      setLoading(true);
      setError(null);
      setSelectedServices(new Set());
      try {
        const { data, error: dbError } = await supabase
          .from('services')
          .select('*, service_attachments(*)')
          .eq('user_id', currentUserId)
          .eq('date', selectedDate)
          .order('start_time', { ascending: true });

        if (dbError) {
          throw new Error(`Database error: ${dbError.message}`);
        }
        
        if (isMounted) {
          setServices(data || []);
          if (data && data.length > 0) {
            setSelectedServices(new Set(data.map(s => s.id)));
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          const errorMsg = err?.message || 'Erro ao buscar serviços';
          console.error('Error fetching services for report:', err);
          setError(errorMsg);
          setServices([]);
          setLoading(false);
        }
      }
    }

    if (user) {
      load(user.id);
    }
    
    return () => {
      isMounted = false;
    };
  }, [selectedDate, user]);

  const selectedServicesList = services.filter(s => selectedServices.has(s.id));

  if (authLoading) {
    return <div className="p-8 text-center text-brown-primary/60">Carregando sessão...</div>;
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-brown-primary">Relatórios</h1>
        <p className="text-brown-primary/60">Gere relatórios profissionais em PDF com layout elegante para apresentar às empresas contratantes.</p>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700"><strong>Erro:</strong> {error}</p>
          <p className="text-xs text-red-600 mt-2">Verifique se a tabela "services" existe no Supabase e se o user_id está preenchido.</p>
        </div>
      )}

      <div className="card max-w-md space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-brown-primary">Selecione a Diária</label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-primary/40" size={20} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="p-4 bg-ivory rounded-lg border border-brown-primary/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-brown-primary/60">Serviços encontrados:</span>
            <span className="font-bold text-brown-primary">{services.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-brown-primary/60">Data:</span>
            <span className="font-bold text-brown-primary">
              {format(parseISO(selectedDate), 'dd/MM/yyyy')}
            </span>
          </div>
        </div>

        {loading ? (
          <button disabled className="btn-primary w-full flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            Buscando dados...
          </button>
        ) : services.length > 0 ? (
          <PDFDownloadLink
            document={
              <ReportPDF
                services={selectedServicesList}
                date={selectedDate}
                providerName={providerName || user.email || 'Prestador de Serviços'}
                companyName="ServiceLog"
              />
            }
            fileName={`Relatorio-Servicos-${selectedDate}.pdf`}
            className="btn-primary w-full flex items-center justify-center gap-2 no-underline"
          >
            {({ loading: pdfLoading }) => (
              <>
                {pdfLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    Baixar Relatório em PDF
                  </>
                )}
              </>
            )}
          </PDFDownloadLink>
        ) : (
          <div className="p-4 text-center text-sm text-brown-primary/40 border border-dashed border-brown-primary/20 rounded-lg">
            Nenhum serviço registrado nesta data para gerar relatório.
          </div>
        )}
      </div>

      {services.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-brown-primary flex items-center gap-2">
            <FileText size={20} />
            Prévia dos Serviços
          </h2>
          <div className="grid gap-3">
            {services.map((s) => (
              <div key={s.id} className="card p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-brown-primary">{s.client_name}</p>
                  <p className="text-sm text-brown-primary/60">{s.service_type}</p>
                </div>
                <p className="text-sm font-medium text-brown-primary/40">{s.start_time} - {s.end_time}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

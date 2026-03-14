import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';
import { FileText, Download, Calendar as CalendarIcon, Loader2, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReportPDF } from '../components/ReportPDF';

// Não precisa mais de generateCSV - vamos usar PDF!

const styles = {
  page: { padding: 40, fontSize: 10 },
  header: { marginBottom: 20, paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 12, marginBottom: 10 },
  meta: { marginTop: 10, marginBottom: 20 }
};

export default function Reports() {
  // Using demo user ID for testing without authentication
  const DEMO_USER_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const user = { id: DEMO_USER_ID, email: 'demo@example.com' } as any;
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providerName, setProviderName] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    async function loadProfile() {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user?.id)
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
    
    loadProfile();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    async function load() {
      setLoading(true);
      setError(null);
      setSelectedServices(new Set());
      try {
        const { data, error: dbError } = await supabase
          .from('services')
          .select('*, service_attachments(*)')
          .eq('user_id', user?.id)
          .eq('date', selectedDate)
          .order('start_time', { ascending: true });

        if (dbError) {
          throw new Error(`Database error: ${dbError.message}`);
        }
        
        if (isMounted) {
          setServices(data || []);
          // Auto-select all services when loading
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

    load();
    
    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const toggleServiceSelection = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  const toggleAllServices = () => {
    if (selectedServices.size === services.length) {
      setSelectedServices(new Set());
    } else {
      setSelectedServices(new Set(services.map(s => s.id)));
    }
  };

  const selectedServicesList = services.filter(s => selectedServices.has(s.id));

  function handleExportPDF() {
    // O PDF será exportado via PDFDownloadLink no JSX
    // Esta função é apenas para qualquer lógica adicional
    console.log('Exportando PDF...');
  }

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
                services={services}
                date={selectedDate}
                providerName={providerName}
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

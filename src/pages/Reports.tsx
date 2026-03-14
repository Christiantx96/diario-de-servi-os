import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Service } from '../types';
import { FileText, Download, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts for PDF
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#4B3621' },
  header: { marginBottom: 20, borderBottom: 1, borderBottomColor: '#4B3621', paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2E7D32', marginBottom: 5 },
  subtitle: { fontSize: 12, color: '#8B4513' },
  meta: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 20, marginBottom: 10, backgroundColor: '#FFFFF0', padding: 5 },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#4B3621', borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableColHeader: { width: '16.6%', borderStyle: 'solid', borderWidth: 1, borderColor: '#4B3621', borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#4B3621', color: '#FFFFFF', padding: 5, fontWeight: 'bold' },
  tableCol: { width: '16.6%', borderStyle: 'solid', borderWidth: 1, borderColor: '#4B3621', borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
  attachmentSection: { marginTop: 30 },
  attachmentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  attachmentImage: { width: 150, height: 150, objectFit: 'cover', borderRadius: 5, border: 1, borderColor: '#4B3621' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#8B4513', borderTop: 1, borderTopColor: '#4B3621', paddingTop: 10 }
});

const ReportPDF = ({ services, date, providerName }: { services: any[], date: string, providerName: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatório Diário de Serviços</Text>
        <Text style={styles.subtitle}>Prestador: {providerName}</Text>
        <View style={styles.meta}>
          <Text>Data: {format(parseISO(date), 'dd/MM/yyyy')}</Text>
          <Text>Total de Serviços: {services.length}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>Horário</Text>
          <Text style={styles.tableColHeader}>Cliente</Text>
          <Text style={styles.tableColHeader}>Local</Text>
          <Text style={styles.tableColHeader}>Tipo</Text>
          <Text style={styles.tableColHeader}>Descrição</Text>
          <Text style={styles.tableColHeader}>Obs</Text>
        </View>
        {services.map((s, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableCol}>{s.start_time} - {s.end_time}</Text>
            <Text style={styles.tableCol}>{s.client_name}</Text>
            <Text style={styles.tableCol}>{s.location}</Text>
            <Text style={styles.tableCol}>{s.service_type}</Text>
            <Text style={styles.tableCol}>{s.description}</Text>
            <Text style={styles.tableCol}>{s.notes || '-'}</Text>
          </View>
        ))}
      </View>

      <View style={styles.attachmentSection}>
        <Text style={styles.sectionTitle}>Anexos da Diária</Text>
        <View style={styles.attachmentGrid}>
          {services.flatMap(s => s.service_attachments || []).filter(a => a.file_type === 'image').map((att, i) => (
            <Image key={i} src={att.file_url} style={styles.attachmentImage} />
          ))}
        </View>
      </View>

      <Text style={styles.footer}>
        Gerado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")} - ServiceLog MVP
      </Text>
    </Page>
  </Document>
);

export default function Reports() {
  // Using demo user ID for testing without authentication
  const DEMO_USER_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const user = { id: DEMO_USER_ID, email: 'demo@example.com' } as any;
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [providerName, setProviderName] = useState('Demo User');

  useEffect(() => {
    if (user) {
      fetchServices();
      setProviderName(user.email || 'Prestador');
    }
  }, [selectedDate, user]);

  async function fetchServices() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*, service_attachments(*)')
        .eq('user_id', user?.id)
        .eq('date', selectedDate)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services for report:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-brown-primary">Relatórios</h1>
        <p className="text-brown-primary/60">Gere relatórios PDF detalhados das suas diárias.</p>
      </header>

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
            document={<ReportPDF services={services} date={selectedDate} providerName={providerName} />}
            fileName={`relatorio-${selectedDate}.pdf`}
            className="btn-primary w-full flex items-center justify-center gap-2 no-underline"
          >
            {({ loading: pdfLoading }) => (
              <>
                {pdfLoading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                {pdfLoading ? 'Gerando PDF...' : 'Baixar Relatório PDF'}
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

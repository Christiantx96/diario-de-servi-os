import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Define styles that match your system design
const styles = StyleSheet.create({
  page: {
    padding: 30,
    color: '#2C1810',
    lineHeight: 1.5,
    fontSize: 9,
  },
  // Header with logo area
  header: {
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#8B4513',
    paddingBottom: 10,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B3621',
    marginBottom: 2,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 9,
    color: '#6B4423',
  },
  // Meta information - compact
  metaSection: {
    marginBottom: 12,
    backgroundColor: '#FFFFF0',
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#8B4513',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  metaLabel: {
    fontSize: 8,
    color: '#6B4423',
    fontWeight: 'bold',
    width: '40%',
  },
  metaValue: {
    fontSize: 8,
    color: '#2C1810',
    fontWeight: 'bold',
    width: '60%',
  },
  // Table styling - compact
  tableContainer: {
    marginVertical: 10,
  },
  tableHeader: {
    backgroundColor: '#4B3621',
    color: '#FFFFF0',
    flexDirection: 'row',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 4,
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#2C1810',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E8D5C4',
    minHeight: 20,
  },
  tableCell: {
    flex: 1,
    padding: 4,
    fontSize: 7.5,
    color: '#2C1810',
    textAlign: 'left',
  },
  tableCell_centered: {
    textAlign: 'center',
  },
  // Section title - compact
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFF0',
    backgroundColor: '#8B4513',
    padding: 5,
    marginTop: 10,
    marginBottom: 6,
  },
  // Service detail - compact inline
  serviceDetail: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0D5C8',
  },
  serviceTitle: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 2,
  },
  serviceText: {
    fontSize: 7.5,
    color: '#2C1810',
    marginBottom: 2,
  },
  // Attachments
  attachmentContainer: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  attachmentImage: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  // Summary - compact
  summarySection: {
    marginTop: 10,
    backgroundColor: '#F5F5F0',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    textAlign: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 7,
    color: '#6B4423',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 8,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  // Footer
  footer: {
    marginTop: 15,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#8B4513',
    fontSize: 7,
    color: '#8B4513',
    textAlign: 'center',
  },
  footerText: {
    marginBottom: 3,
  },
});

interface Service {
  id: string;
  date: string;
  client_name: string;
  service_type: string;
  location: string;
  description: string;
  start_time: string;
  end_time: string;
  notes: string;
  status: string;
  service_attachments?: Array<{
    id: string;
    file_url: string;
    file_type: string;
    file_name?: string;
  }>;
}

interface ReportPDFProps {
  services: Service[];
  date: string;
  providerName: string;
  companyName?: string;
}

export const ReportPDF: React.FC<ReportPDFProps> = ({
  services,
  date,
  providerName,
  companyName = 'ServiceLog',
}) => {
  const totalHours = services.reduce((acc, service) => {
    const [startH, startM] = service.start_time.split(':').map(Number);
    const [endH, endM] = service.end_time.split(':').map(Number);
    const start = startH + startM / 60;
    const end = endH + endM / 60;
    return acc + (end - start);
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>{companyName}</Text>
          <Text style={styles.reportTitle}>RELATÓRIO DE SERVIÇOS</Text>
          <Text style={styles.subtitle}>Data: {format(parseISO(date), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}</Text>
        </View>

        {/* Meta Information */}
        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Prestador:</Text>
            <Text style={styles.metaValue}>{providerName}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Serviços:</Text>
            <Text style={styles.metaValue}>{services.length}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Total Horas:</Text>
            <Text style={styles.metaValue}>{totalHours.toFixed(1)}h</Text>
          </View>
        </View>

        {/* Services Table - Compact */}
        <Text style={styles.sectionTitle}>SERVIÇOS REALIZADOS</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 0.7 }]}>Horário</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Cliente</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Tipo</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Status</Text>
          </View>

          {services.map((service, idx) => (
            <View key={idx}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCell_centered, { flex: 0.7 }]}>
                  {service.start_time}-{service.end_time}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.2, fontSize: 7 }]}>
                  {service.client_name}
                </Text>
                <Text style={[styles.tableCell, { flex: 1, fontSize: 7 }]}>
                  {service.service_type}
                </Text>
                <Text style={[styles.tableCell, styles.tableCell_centered, { flex: 0.8, fontSize: 7 }]}>
                  {service.status === 'concluido' ? '✓' : '○'}
                </Text>
              </View>

              {/* Service Details - Inline */}
              <View style={{ ...styles.serviceDetail, paddingLeft: 8 }}>
                {service.location && (
                  <Text style={styles.serviceText}>
                    <Text style={{ fontWeight: 'bold' }}>Local:</Text> {service.location}
                  </Text>
                )}
                {service.description && (
                  <Text style={styles.serviceText}>
                    <Text style={{ fontWeight: 'bold' }}>Descrição:</Text> {service.description}
                  </Text>
                )}
                {service.notes && (
                  <Text style={styles.serviceText}>
                    <Text style={{ fontWeight: 'bold' }}>Obs:</Text> {service.notes}
                  </Text>
                )}

                {/* Show Attachments */}
                {service.service_attachments && service.service_attachments.length > 0 && (
                  <View style={styles.attachmentContainer}>
                    {service.service_attachments.map((att, attIdx) => {
                      // Check if it's an image
                      if (att.file_type === 'image' || att.file_url?.includes('image')) {
                        return (
                          <View key={attIdx}>
                            <Image
                              src={att.file_url}
                              style={styles.attachmentImage}
                              onError={() => console.log('Could not load image')}
                            />
                            <Text style={{ fontSize: 6, textAlign: 'center', marginTop: 2 }}>
                              {att.file_name?.split('/').pop() || 'Anexo'}
                            </Text>
                          </View>
                        );
                      }
                      return null;
                    })}
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Summary - Compact */}
        <View style={styles.summarySection}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Serviços</Text>
            <Text style={styles.summaryValue}>{services.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Horas</Text>
            <Text style={styles.summaryValue}>{totalHours.toFixed(1)}h</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Concluídos</Text>
            <Text style={styles.summaryValue}>
              {services.filter(s => s.status === 'concluido').length}/{services.length}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Gerado em: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
          </Text>
          <Text style={styles.footerText}>
            ________________________
          </Text>
          <Text style={styles.footerText}>
            Assinatura
          </Text>
        </View>
      </Page>
    </Document>
  );
};


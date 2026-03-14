import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Define styles that match your system design
const styles = StyleSheet.create({
  page: {
    padding: 40,
    color: '#2C1810',
    lineHeight: 1.6,
  },
  // Header with logo area
  header: {
    marginBottom: 30,
    borderBottomWidth: 3,
    borderBottomColor: '#8B4513',
    paddingBottom: 15,
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B3621',
    marginBottom: 3,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 11,
    color: '#6B4423',
    marginBottom: 10,
  },
  // Meta information
  metaSection: {
    marginBottom: 20,
    backgroundColor: '#FFFFF0',
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B4513',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metaLabel: {
    fontSize: 10,
    color: '#6B4423',
    fontWeight: 'bold',
    width: '40%',
  },
  metaValue: {
    fontSize: 10,
    color: '#2C1810',
    fontWeight: 'bold',
    width: '60%',
  },
  // Table styling
  tableContainer: {
    marginVertical: 20,
  },
  tableHeader: {
    backgroundColor: '#4B3621',
    color: '#FFFFF0',
    flexDirection: 'row',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#2C1810',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C4',
    minHeight: 30,
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 9,
    color: '#2C1810',
    textAlign: 'left',
  },
  tableCell_centered: {
    textAlign: 'center',
  },
  // Section title
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFF0',
    backgroundColor: '#8B4513',
    padding: 8,
    marginTop: 15,
    marginBottom: 10,
  },
  // Summary section
  summarySection: {
    marginTop: 20,
    backgroundColor: '#F5F5F0',
    padding: 15,
    borderRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0D5C8',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6B4423',
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  // Footer
  footer: {
    marginTop: 40,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#8B4513',
    fontSize: 8,
    color: '#8B4513',
    textAlign: 'center',
  },
  footerText: {
    marginBottom: 5,
  },
  // Notes section
  notesSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFFFF0',
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D32',
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  notesContent: {
    fontSize: 9,
    color: '#2C1810',
    lineHeight: 1.5,
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
          <Text style={styles.reportTitle}>RELATÓRIO DE SERVIÇOS PRESTADOS</Text>
          <Text style={styles.subtitle}>Documento de Vistoria e Comprovação</Text>
        </View>

        {/* Meta Information */}
        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Prestador de Serviço:</Text>
            <Text style={styles.metaValue}>{providerName}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Data da Diária:</Text>
            <Text style={styles.metaValue}>{format(parseISO(date), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Serviços Realizados:</Text>
            <Text style={styles.metaValue}>{services.length}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Total de Horas:</Text>
            <Text style={styles.metaValue}>{totalHours.toFixed(1)} horas</Text>
          </View>
        </View>

        {/* Services Table */}
        <Text style={styles.sectionTitle}>DETALHAMENTO DOS SERVIÇOS</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Horário</Text>
            <Text style={styles.tableHeaderCell}>Cliente</Text>
            <Text style={styles.tableHeaderCell}>Localização</Text>
            <Text style={styles.tableHeaderCell}>Tipo de Serviço</Text>
            <Text style={styles.tableHeaderCell}>Status</Text>
          </View>

          {services.map((service, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCell_centered]}>
                {service.start_time} - {service.end_time}
              </Text>
              <Text style={styles.tableCell}>{service.client_name}</Text>
              <Text style={styles.tableCell}>{service.location}</Text>
              <Text style={styles.tableCell}>{service.service_type}</Text>
              <Text style={[styles.tableCell, styles.tableCell_centered]}>
                {service.status === 'concluido' ? '✓ Concluído' : '◯ ' + service.status}
              </Text>
            </View>
          ))}
        </View>

        {/* Detailed Description */}
        {services.filter(s => s.description).length > 0 && (
          <>
            <Text style={styles.sectionTitle}>DESCRIÇÃO DOS SERVIÇOS</Text>
            {services.map((service, idx) => (
              <View key={idx} style={styles.notesSection}>
                <Text style={styles.notesTitle}>
                  {service.client_name} - {service.service_type}
                </Text>
                <Text style={styles.notesContent}>{service.description}</Text>
              </View>
            ))}
          </>
        )}

        {/* Notes */}
        {services.filter(s => s.notes).length > 0 && (
          <>
            <Text style={styles.sectionTitle}>OBSERVAÇÕES</Text>
            {services.map((service, idx) => (
              service.notes && (
                <View key={idx} style={styles.notesSection}>
                  <Text style={styles.notesTitle}>{service.client_name}</Text>
                  <Text style={styles.notesContent}>{service.notes}</Text>
                </View>
              )
            ))}
          </>
        )}

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total de Serviços:</Text>
            <Text style={styles.summaryValue}>{services.length} serviços</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Horas Trabalhadas:</Text>
            <Text style={styles.summaryValue}>{totalHours.toFixed(1)} horas</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Serviços Concluídos:</Text>
            <Text style={styles.summaryValue}>
              {services.filter(s => s.status === 'concluido').length} / {services.length}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Documentoapreentado em: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
          </Text>
          <Text style={styles.footerText}>
            Este documento é valido para comprovação de serviços prestados.
          </Text>
          <Text style={styles.footerText}>
            ___________________________
          </Text>
          <Text style={styles.footerText}>
            Assinatura do Prestador
          </Text>
        </View>
      </Page>
    </Document>
  );
};

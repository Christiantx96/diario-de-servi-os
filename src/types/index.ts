export type ServiceStatus = 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';

export interface Service {
  id: string;
  user_id: string;
  date: string;
  client_name: string;
  service_type: string;
  location: string;
  description: string;
  start_time: string;
  end_time: string;
  notes: string;
  status: ServiceStatus;
  created_at: string;
}

export interface ServiceAttachment {
  id: string;
  service_id: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  company_name?: string;
  avatar_url?: string;
}

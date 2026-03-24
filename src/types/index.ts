export type PatientSex = 'Masculino' | 'Feminino' | 'Outro' | 'Prefiro não informar';
export type PatientOrigin =
  | 'Instagram'
  | 'TikTok'
  | 'Google Ads'
  | 'Indicação de amigo'
  | 'Indicação de outro profissional';

export interface Patient {
  id: string;
  name: string;
  phone: string;
  last_consultation: string;
  sexo?: PatientSex | null;
  idade?: number | null;
  origem_paciente?: PatientOrigin | null;
  last_contacted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientMedico {
  id: string;
  nome: string;
  telefone: string;
  data_consulta: string;
  sexo?: PatientSex | null;
  idade?: number | null;
  origem_paciente?: PatientOrigin | null;
  last_contacted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientMariane {
  id: string;
  nome: string;
  telefone: string;
  data_consulta: string;
  sexo?: PatientSex | null;
  idade?: number | null;
  origem_paciente?: PatientOrigin | null;
  last_contacted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  patient_id: string;
  patient: Patient;
  days_since_consultation: number;
  reminder_date: string;
  contacted: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppMessage {
  phone: string;
  message: string;
}

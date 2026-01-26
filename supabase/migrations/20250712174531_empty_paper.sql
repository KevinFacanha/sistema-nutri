/*
  # Sistema de Gestão Nutricional - Pacientes e Lembretes

  1. Novas Tabelas
    - `patients`
      - `id` (uuid, primary key)
      - `name` (text, nome do paciente)
      - `phone` (text, telefone)
      - `last_consultation` (date, data da última consulta)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `reminders` 
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key para patients)
      - `days_since_consultation` (integer, 15/30/45/60 dias)
      - `reminder_date` (date, data do lembrete)
      - `contacted` (boolean, se já foi contatado)
      - `notes` (text, anotações opcionais)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS em ambas as tabelas
    - Políticas para usuários autenticados lerem/modificarem seus próprios dados
*/

-- Criar tabela de pacientes
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  last_consultation date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de lembretes
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  days_since_consultation integer NOT NULL CHECK (days_since_consultation IN (15, 30, 45, 60)),
  reminder_date date NOT NULL,
  contacted boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Políticas para patients
CREATE POLICY "Usuários autenticados podem ler pacientes"
  ON patients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir pacientes"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar pacientes"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar pacientes"
  ON patients
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para reminders
CREATE POLICY "Usuários autenticados podem ler lembretes"
  ON reminders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir lembretes"
  ON reminders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar lembretes"
  ON reminders
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar lembretes"
  ON reminders
  FOR DELETE
  TO authenticated
  USING (true);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_patients_last_consultation ON patients(last_consultation);
CREATE INDEX IF NOT EXISTS idx_reminders_patient_id ON reminders(patient_id);
CREATE INDEX IF NOT EXISTS idx_reminders_reminder_date ON reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_reminders_contacted ON reminders(contacted);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reminders_updated_at ON reminders;
CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
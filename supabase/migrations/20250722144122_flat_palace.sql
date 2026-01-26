/*
  # Criar tabelas para Médico e Mariane

  1. Novas Tabelas
    - `pacientes_medico`
      - `id` (uuid, primary key)
      - `nome` (text)
      - `telefone` (text)
      - `data_consulta` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_contacted_at` (timestamp, nullable)
    
    - `pacientes_mariane`
      - `id` (uuid, primary key)
      - `nome` (text)
      - `telefone` (text)
      - `data_consulta` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_contacted_at` (timestamp, nullable)

  2. Segurança
    - Habilitar RLS em ambas as tabelas
    - Adicionar políticas para operações CRUD para usuários anônimos

  3. Índices
    - Índices para otimizar consultas por data_consulta
*/

-- Criar tabela pacientes_medico
CREATE TABLE IF NOT EXISTS pacientes_medico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  data_consulta date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_contacted_at timestamptz
);

-- Criar tabela pacientes_mariane
CREATE TABLE IF NOT EXISTS pacientes_mariane (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  data_consulta date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_contacted_at timestamptz
);

-- Habilitar RLS
ALTER TABLE pacientes_medico ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes_mariane ENABLE ROW LEVEL SECURITY;

-- Políticas para pacientes_medico
CREATE POLICY "Allow anon to read pacientes_medico"
  ON pacientes_medico
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to insert pacientes_medico"
  ON pacientes_medico
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to update pacientes_medico"
  ON pacientes_medico
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to delete pacientes_medico"
  ON pacientes_medico
  FOR DELETE
  TO anon
  USING (true);

-- Políticas para pacientes_mariane
CREATE POLICY "Allow anon to read pacientes_mariane"
  ON pacientes_mariane
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to insert pacientes_mariane"
  ON pacientes_mariane
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to update pacientes_mariane"
  ON pacientes_mariane
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to delete pacientes_mariane"
  ON pacientes_mariane
  FOR DELETE
  TO anon
  USING (true);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_pacientes_medico_data_consulta 
  ON pacientes_medico USING btree (data_consulta);

CREATE INDEX IF NOT EXISTS idx_pacientes_mariane_data_consulta 
  ON pacientes_mariane USING btree (data_consulta);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pacientes_medico_updated_at
  BEFORE UPDATE ON pacientes_medico
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pacientes_mariane_updated_at
  BEFORE UPDATE ON pacientes_mariane
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
/*
  # Fix RLS policies for anonymous access

  1. Security Changes
    - Update RLS policies to allow anonymous users (anon role) to perform CRUD operations
    - This is appropriate for a single-user nutrition practice system
    - Remove authenticated-only restrictions

  2. Policy Updates
    - Allow anon role to SELECT, INSERT, UPDATE, DELETE on patients table
    - Allow anon role to SELECT, INSERT, UPDATE, DELETE on reminders table
*/

-- Drop existing policies for patients table
DROP POLICY IF EXISTS "Usuários autenticados podem ler pacientes" ON patients;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir pacientes" ON patients;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar pacientes" ON patients;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar pacientes" ON patients;

-- Create new policies for patients table allowing anon access
CREATE POLICY "Allow anon to read patients"
  ON patients
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to insert patients"
  ON patients
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to update patients"
  ON patients
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to delete patients"
  ON patients
  FOR DELETE
  TO anon
  USING (true);

-- Drop existing policies for reminders table
DROP POLICY IF EXISTS "Usuários autenticados podem ler lembretes" ON reminders;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir lembretes" ON reminders;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar lembretes" ON reminders;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar lembretes" ON reminders;

-- Create new policies for reminders table allowing anon access
CREATE POLICY "Allow anon to read reminders"
  ON reminders
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to insert reminders"
  ON reminders
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to update reminders"
  ON reminders
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon to delete reminders"
  ON reminders
  FOR DELETE
  TO anon
  USING (true);
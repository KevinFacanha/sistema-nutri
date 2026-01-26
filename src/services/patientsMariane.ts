import { supabase } from '../lib/supabase';
import { PatientMariane } from '../types';

export const getPatientsMariane = async (): Promise<PatientMariane[]> => {
  const { data, error } = await supabase
    .from('pacientes_mariane')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createPatientMariane = async (patient: Omit<PatientMariane, 'id' | 'created_at' | 'updated_at'>): Promise<PatientMariane> => {
  const { data, error } = await supabase
    .from('pacientes_mariane')
    .insert([patient])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePatientMariane = async (id: string, updates: Partial<PatientMariane>): Promise<PatientMariane> => {
  const { data, error } = await supabase
    .from('pacientes_mariane')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePatientMariane = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('pacientes_mariane')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const markPatientMarianeAsContacted = async (id: string, milestone: number): Promise<PatientMariane> => {
  const { data, error } = await supabase
    .from('pacientes_mariane')
    .update({ 
      last_contacted_at: new Date().toISOString(),
      last_contacted_milestone: milestone,
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
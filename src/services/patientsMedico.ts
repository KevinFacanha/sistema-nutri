import { supabase } from '../lib/supabase';
import { PatientMedico } from '../types';

export const getPatientsMedico = async (): Promise<PatientMedico[]> => {
  const { data, error } = await supabase
    .from('pacientes_medico')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createPatientMedico = async (patient: Omit<PatientMedico, 'id' | 'created_at' | 'updated_at'>): Promise<PatientMedico> => {
  const { data, error } = await supabase
    .from('pacientes_medico')
    .insert([patient])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePatientMedico = async (id: string, updates: Partial<PatientMedico>): Promise<PatientMedico> => {
  const { data, error } = await supabase
    .from('pacientes_medico')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePatientMedico = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('pacientes_medico')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const markPatientMedicoAsContacted = async (id: string, milestone: number): Promise<PatientMedico> => {
  const { data, error } = await supabase
    .from('pacientes_medico')
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
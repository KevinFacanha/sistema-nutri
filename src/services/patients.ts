import { supabase } from '../lib/supabase';
import { Patient } from '../types';

export const getPatients = async (): Promise<Patient[]> => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createPatient = async (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient> => {
  const { data, error } = await supabase
    .from('patients')
    .insert([patient])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePatient = async (id: string, updates: Partial<Patient>): Promise<Patient> => {
  const { data, error } = await supabase
    .from('patients')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePatient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const markPatientAsContacted = async (id: string, milestone: number): Promise<Patient> => {
  const { data, error } = await supabase
    .from('patients')
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
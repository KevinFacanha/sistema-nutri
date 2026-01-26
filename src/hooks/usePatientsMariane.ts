import { useState, useEffect } from 'react';
import { PatientMariane } from '../types';
import { 
  getPatientsMariane, 
  createPatientMariane, 
  updatePatientMariane, 
  deletePatientMariane, 
  markPatientMarianeAsContacted 
} from '../services/patientsMariane';

export const usePatientsMariane = () => {
  const [patients, setPatients] = useState<PatientMariane[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatientsMariane();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pacientes');
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (patientData: Omit<PatientMariane, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newPatient = await createPatientMariane(patientData);
      setPatients(prev => [newPatient, ...prev]);
      return newPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar paciente');
      throw err;
    }
  };

  const editPatient = async (id: string, updates: Partial<PatientMariane>) => {
    try {
      const updatedPatient = await updatePatientMariane(id, updates);
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
      return updatedPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar paciente');
      throw err;
    }
  };

  const removePatient = async (id: string) => {
    try {
      await deletePatientMariane(id);
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir paciente');
      throw err;
    }
  };

  const markAsContacted = async (id: string, milestone: number) => {
    try {
      const updatedPatient = await markPatientMarianeAsContacted(id, milestone);
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
      return updatedPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao marcar como contatado');
      throw err;
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    addPatient,
    editPatient,
    removePatient,
    markAsContacted,
    refreshPatients: fetchPatients
  };
};
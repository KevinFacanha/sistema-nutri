import { useState, useEffect } from 'react';
import { Patient } from '../types';
import { getPatients, createPatient, updatePatient, deletePatient, markPatientAsContacted } from '../services/patients';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pacientes');
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newPatient = await createPatient(patientData);
      setPatients(prev => [newPatient, ...prev]);
      return newPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar paciente');
      throw err;
    }
  };

  const editPatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const updatedPatient = await updatePatient(id, updates);
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
      return updatedPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar paciente');
      throw err;
    }
  };

  const removePatient = async (id: string) => {
    try {
      await deletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir paciente');
      throw err;
    }
  };

  const markAsContacted = async (id: string, milestone: number) => {
    try {
      const updatedPatient = await markPatientAsContacted(id, milestone);
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
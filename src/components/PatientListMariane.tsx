import React, { useState, useMemo } from 'react';
import { Plus, Users } from 'lucide-react';
import { PatientListFilters, FilterCategory, getPatientCategoryByDays, patientFilterOptions } from './PatientListFilters';
import { PatientListItemMariane } from './PatientListItemMariane';
import { calculateDaysSinceConsultation } from '../lib/patientAlerts';
import { PatientMariane } from '../types';

interface PatientListMarianeProps {
  patients: PatientMariane[];
  loading: boolean;
  onEdit: (patient: PatientMariane) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export const PatientListMariane: React.FC<PatientListMarianeProps> = ({
  patients,
  loading,
  onEdit,
  onDelete,
  onAddNew
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(10);

  const filteredAndSearchedPatients = useMemo(() => {
    let filtered = patients;

    // Filtrar por categoria
    if (activeFilter !== 'all') {
      filtered = patients.filter(patient => {
        const days = calculateDaysSinceConsultation(patient.data_consulta);
        return getPatientCategoryByDays(days) === activeFilter;
      });
    }

    // Filtrar por busca
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(patient =>
        patient.nome.toLowerCase().includes(searchLower) ||
        patient.telefone.includes(searchTerm)
      );
    }

    // Ordenar por dias desde consulta (mais recente primeiro)
    return filtered.sort((a, b) => {
      const daysA = calculateDaysSinceConsultation(a.data_consulta);
      const daysB = calculateDaysSinceConsultation(b.data_consulta);
      return daysA - daysB;
    });
  }, [patients, activeFilter, searchTerm]);

  const patientCounts = useMemo(() => {
    const counts = patientFilterOptions.reduce((acc, filter) => {
      acc[filter.key] = 0;
      return acc;
    }, {} as Record<FilterCategory, number>);

    counts.all = patients.length;

    patients.forEach(patient => {
      const days = calculateDaysSinceConsultation(patient.data_consulta);
      const category = getPatientCategoryByDays(days);
      counts[category]++;
    });

    return counts;
  }, [patients]);

  const displayedPatients = filteredAndSearchedPatients.slice(0, displayCount);
  const hasMore = displayCount < filteredAndSearchedPatients.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Carregando pacientes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com título e botão */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Pacientes da Mariane</h2>
          <p className="text-gray-600">
            {filteredAndSearchedPatients.length} {filteredAndSearchedPatients.length === 1 ? 'paciente encontrado' : 'pacientes encontrados'}
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Paciente
        </button>
      </div>

      {/* Filtros e busca */}
      <PatientListFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        patientCounts={patientCounts}
      />

      {/* Lista de pacientes */}
      {displayedPatients.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
            {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente nesta categoria'}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
            {searchTerm 
              ? 'Tente ajustar os termos de busca ou filtros'
              : 'Comece adicionando seu primeiro paciente'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={onAddNew}
              className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Adicionar Paciente
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayedPatients.map((patient) => (
            <PatientListItemMariane
              key={patient.id}
              patient={patient}
              onEdit={() => onEdit(patient)}
              onDelete={() => onDelete(patient.id)}
            />
          ))}
          
          {/* Botão carregar mais */}
          {hasMore && (
            <div className="text-center pt-4 px-4">
              <button
                onClick={handleLoadMore}
                className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                🔽 Carregar mais pacientes... ({filteredAndSearchedPatients.length - displayCount} restantes)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

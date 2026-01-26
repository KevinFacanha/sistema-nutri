import React from 'react';
import { Search, Users } from 'lucide-react';

export type FilterCategory = 'all' | '0-14' | '15-29' | '30-44' | '45-59' | '60-89' | '90+';

interface PatientListFiltersProps {
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  patientCounts: Record<FilterCategory, number>;
}

export const PatientListFilters: React.FC<PatientListFiltersProps> = ({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  patientCounts
}) => {
  const filters: Array<{
    key: FilterCategory;
    label: string;
    icon: string;
    color: string;
  }> = [
    { key: 'all', label: 'Todos', icon: '🔄', color: 'bg-gray-100 text-gray-800' },
    { key: '0-14', label: '0-14 dias', icon: '🟢', color: 'bg-green-100 text-green-800' },
    { key: '15-29', label: '15-29 dias', icon: '🟡', color: 'bg-yellow-100 text-yellow-800' },
    { key: '30-44', label: '30-44 dias', icon: '🟠', color: 'bg-orange-100 text-orange-800' },
    { key: '45-59', label: '45-59 dias', icon: '🟤', color: 'bg-amber-100 text-amber-800' },
    { key: '60-89', label: '60-89 dias', icon: '🔴', color: 'bg-red-100 text-red-800' },
    { key: '90+', label: '90+ dias', icon: '⚫', color: 'bg-gray-100 text-gray-800' }
  ];

  return (
    <div className="space-y-4">
      {/* Filtros por abas */}
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 ${
              activeFilter === filter.key
                ? `${filter.color} ring-2 ring-offset-1 ring-current`
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span>{filter.icon}</span>
            <span className="hidden sm:inline">{filter.label}</span>
            <span className="sm:hidden">{filter.key === 'all' ? 'Todos' : filter.key}</span>
            <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeFilter === filter.key ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              {patientCounts[filter.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Campo de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="🔍 Buscar paciente por nome ou telefone..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm sm:text-base"
        />
      </div>
    </div>
  );
};
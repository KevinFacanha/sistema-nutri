import React from 'react';
import { Edit, Trash2, User, Phone, Calendar } from 'lucide-react';
import { PatientMedico } from '../types';
import { getPatientRangeByDays } from './PatientListFilters';

interface PatientListItemMedicoProps {
  patient: PatientMedico;
  onEdit: () => void;
  onDelete: () => void;
}

export const PatientListItemMedico: React.FC<PatientListItemMedicoProps> = ({ patient, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const getDaysSinceConsultation = (dataConsulta: string) => {
    const today = new Date();
    const consultationDate = new Date(dataConsulta);
    
    // Normalizar as datas para meia-noite para cálculo preciso
    today.setHours(0, 0, 0, 0);
    consultationDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - consultationDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysBadge = (days: number) => {
    const range = getPatientRangeByDays(days);
    return { icon: range.icon, color: range.color, label: `${days} dias` };
  };

  const days = getDaysSinceConsultation(patient.data_consulta);
  const badge = getDaysBadge(days);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          
          {/* Informações do paciente */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base">👤 {patient.nome}</h3>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 self-start ${badge.color}`}>
                <span>{badge.icon}</span>
                {badge.label}
              </span>
            </div>
            
            <div className="space-y-1 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="truncate">📞 {patient.telefone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="truncate">📅 Última consulta: {formatDate(patient.data_consulta)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-2 sm:ml-4 self-end sm:self-center">
          <button
            onClick={onEdit}
            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar paciente"
          >
            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir paciente"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

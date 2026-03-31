import React from 'react';
import { Edit, Trash2, User, Phone, Calendar } from 'lucide-react';
import { Patient } from '../types';
import { calculateDaysSinceConsultation } from '../lib/patientAlerts';

interface PatientCardProps {
  patient: Patient;
  onEdit: () => void;
  onDelete: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  const days = calculateDaysSinceConsultation(patient.last_consultation);
  const isOverdue = days >= 15;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 ${
      isOverdue ? 'border-orange-500' : 'border-green-500'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{patient.name}</h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {patient.phone}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar paciente"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir paciente"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Última consulta: {formatDate(patient.last_consultation)}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isOverdue 
            ? 'bg-orange-100 text-orange-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {days} {days === 1 ? 'dia' : 'dias'}
        </div>
      </div>
    </div>
  );
};

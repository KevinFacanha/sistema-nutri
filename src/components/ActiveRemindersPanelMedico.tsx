import React, { useState } from 'react';
import { Calendar, Users, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { PatientMedico } from '../types';

interface ActiveRemindersPanelMedicoProps {
  patients: PatientMedico[];
}

const reminderCategories = [15, 30, 45, 60, 90, 120, 180, 360] as const;
type ReminderCategory = typeof reminderCategories[number];

interface ActiveReminder {
  patient: PatientMedico;
  daysSinceConsultation: number;
  daysSinceContact: number;
  category: ReminderCategory;
}

export const ActiveRemindersPanelMedico = ({ patients }: ActiveRemindersPanelMedicoProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<ReminderCategory>>(new Set(reminderCategories));

  const calculateDaysSince = (dateString: string): number => {
    const today = new Date();
    const date = new Date(dateString + 'T00:00:00');
    
    // Normalizar as datas para meia-noite para cálculo preciso
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const getActiveReminders = (): ActiveReminder[] => {
    return patients
      .filter(patient => patient.last_contacted_at) // Apenas pacientes já contatados
      .map(patient => {
        const daysSinceConsultation = calculateDaysSince(patient.data_consulta);
        const daysSinceContact = calculateDaysSince(patient.last_contacted_at!);
        
        // Determinar categoria baseada no tempo desde a consulta
        let category: ReminderCategory = 15;
        if (daysSinceConsultation >= 360) category = 360;
        else if (daysSinceConsultation >= 180) category = 180;
        else if (daysSinceConsultation >= 120) category = 120;
        else if (daysSinceConsultation >= 90) category = 90;
        else if (daysSinceConsultation >= 60) category = 60;
        else if (daysSinceConsultation >= 45) category = 45;
        else if (daysSinceConsultation >= 30) category = 30;
        else category = 15;

        return {
          patient,
          daysSinceConsultation,
          daysSinceContact,
          category
        };
      })
      .sort((a, b) => b.daysSinceConsultation - a.daysSinceConsultation);
  };

  const groupRemindersByCategory = (reminders: ActiveReminder[]) => {
    return reminderCategories.reduce((groups, category) => {
      groups[category] = reminders.filter(r => r.category === category);
      return groups;
    }, {} as Record<ReminderCategory, ActiveReminder[]>);
  };

  const getCategoryInfo = (category: ReminderCategory) => {
    switch (category) {
      case 15:
        return {
          icon: '🟡',
          title: 'Acompanhamento de 15 dias',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          headerBg: 'bg-yellow-100'
        };
      case 30:
        return {
          icon: '🟠',
          title: 'Acompanhamento de 30 dias',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          headerBg: 'bg-orange-100'
        };
      case 45:
        return {
          icon: '🟤',
          title: 'Acompanhamento de 45 dias',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-800',
          headerBg: 'bg-amber-100'
        };
      case 60:
        return {
          icon: '🔴',
          title: 'Acompanhamento de 60 dias',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          headerBg: 'bg-red-100'
        };
      case 90:
        return {
          icon: '⚫',
          title: 'Acompanhamento de 90-119 dias',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-800',
          headerBg: 'bg-gray-100'
        };
      case 120:
        return {
          icon: '⚫',
          title: 'Acompanhamento de 120-179 dias',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-800',
          headerBg: 'bg-gray-100'
        };
      case 180:
        return {
          icon: '⚫',
          title: 'Acompanhamento de 180-359 dias',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-800',
          headerBg: 'bg-gray-100'
        };
      case 360:
        return {
          icon: '⚫',
          title: 'Acompanhamento de 360+ dias',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-800',
          headerBg: 'bg-gray-100'
        };
    }
  };

  const toggleCategory = (category: ReminderCategory) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const activeReminders = getActiveReminders();
  const groupedReminders = groupRemindersByCategory(activeReminders);

  if (activeReminders.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Nenhum lembrete ativo
        </h3>
        <p className="text-gray-600">
          Os lembretes aparecerão aqui após você marcar pacientes como "Já contatei"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Lembretes Ativos ({activeReminders.length})
        </h2>
        <p className="text-gray-600">
          Pacientes já contatados, organizados por período de acompanhamento
        </p>
      </div>

      {reminderCategories.map(category => {
        const categoryReminders = groupedReminders[category];
        if (categoryReminders.length === 0) return null;

        const categoryInfo = getCategoryInfo(category);
        const isExpanded = expandedCategories.has(category);

        return (
          <div key={category} className={`${categoryInfo.bgColor} ${categoryInfo.borderColor} border rounded-lg overflow-hidden`}>
            <button
              onClick={() => toggleCategory(category)}
              className={`w-full ${categoryInfo.headerBg} px-4 py-3 flex items-center justify-between hover:opacity-80 transition-opacity`}
            >
              <div className={`font-medium ${categoryInfo.textColor} flex items-center gap-2`}>
                <span className="text-lg">{categoryInfo.icon}</span>
                {categoryInfo.title} ({categoryReminders.length} {categoryReminders.length === 1 ? 'paciente' : 'pacientes'})
              </div>
              {isExpanded ? (
                <ChevronUp className={`w-5 h-5 ${categoryInfo.textColor}`} />
              ) : (
                <ChevronDown className={`w-5 h-5 ${categoryInfo.textColor}`} />
              )}
            </button>
            
            {isExpanded && (
              <div className="p-4 space-y-3">
                {categoryReminders.map(reminder => (
                  <div 
                    key={reminder.patient.id}
                    className="flex items-center justify-between bg-white rounded-md p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{reminder.patient.nome}</p>
                        <p className="text-sm text-gray-600">{reminder.patient.telefone}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>
                          📅 {reminder.daysSinceConsultation} {reminder.daysSinceConsultation === 1 ? 'dia' : 'dias'} desde consulta
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Clock className="w-3 h-3" />
                        <span>
                          ✅ {reminder.daysSinceContact} {reminder.daysSinceContact === 1 ? 'dia' : 'dias'} desde contato
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

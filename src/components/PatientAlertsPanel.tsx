import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Bell, Calendar, Users, Check, Info } from 'lucide-react';
import { Patient } from '../types';
import { buildWhatsAppMessage, copyTextToClipboard } from '../lib/whatsappMessage';

interface PatientAlert {
  patient: Patient;
  daysSinceConsultation: number;
  category: 7 | 15 | 30 | 45 | 60 | 90 | 120 | 180 | 360;
}

interface PatientAlertsPanelProps {
  patients: Patient[];
  onViewAllOverdue: () => void;
  onMarkAsContacted: (patientId: string, milestone: number) => Promise<void>;
}

export const PatientAlertsPanel: React.FC<PatientAlertsPanelProps> = ({ 
  patients, 
  onViewAllOverdue,
  onMarkAsContacted
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contactingPatients, setContactingPatients] = useState<Set<string>>(new Set());
  const [copiedPatients, setCopiedPatients] = useState<Set<string>>(new Set());

  const calculateDaysSince = (dateString: string): number => {
    const today = new Date();
    const date = new Date(dateString + 'T00:00:00');
    
    // Normalizar as datas para meia-noite para cálculo preciso
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const shouldShowInAlerts = (patient: Patient): boolean => {
    const milestones = [7, 15, 30, 45, 60, 90, 120, 180, 360] as const;
    const days = calculateDaysSince(patient.last_consultation);
    
    // Só alertar em marcos exatos
    if (!milestones.includes(days as any)) return false;
    
    // Verificar se já foi contatado no mesmo marco
    const contactedSameMilestone =
      patient.last_contacted_at &&
      patient.last_contacted_milestone === days &&
      new Date(patient.last_contacted_at) > new Date(patient.last_consultation);
    
    return !contactedSameMilestone;
  };

  const categorizePatient = (days: number): 7 | 15 | 30 | 45 | 60 | 90 | 120 | 180 | 360 => {
    if (days >= 360) return 360;
    if (days >= 180) return 180;
    if (days >= 120) return 120;
    if (days >= 90) return 90;
    if (days >= 60) return 60;
    if (days >= 45) return 45;
    if (days >= 30) return 30;
    if (days >= 15) return 15;
    return 7;
  };

  const getPatientAlerts = (): PatientAlert[] => {
    return patients
      .filter(shouldShowInAlerts)
      .map(patient => ({
        patient,
        daysSinceConsultation: calculateDaysSince(patient.last_consultation),
        category: categorizePatient(calculateDaysSince(patient.last_consultation))
      }))
      .sort((a, b) => b.daysSinceConsultation - a.daysSinceConsultation);
  };

  const groupAlertsByCategory = (alerts: PatientAlert[]) => {
    const groups = {
      7: alerts.filter(a => a.category === 7),
      15: alerts.filter(a => a.category === 15),
      30: alerts.filter(a => a.category === 30),
      45: alerts.filter(a => a.category === 45),
      60: alerts.filter(a => a.category === 60),
      90: alerts.filter(a => a.category === 90),
      120: alerts.filter(a => a.category === 120),
      180: alerts.filter(a => a.category === 180),
      360: alerts.filter(a => a.category === 360)
    };

    return groups;
  };

  const alerts = getPatientAlerts();
  const groupedAlerts = groupAlertsByCategory(alerts);
  const totalAlerts = alerts.length;
  
  // Auto-minimize se houver mais de 3 alertas
  React.useEffect(() => {
    setIsExpanded(totalAlerts <= 3);
  }, [totalAlerts]);

  const handleMarkAsContacted = async (patientId: string, milestone: number) => {
    setContactingPatients(prev => new Set(prev).add(patientId));
    try {
      await onMarkAsContacted(patientId, milestone);
    } catch (error) {
      console.error('Erro ao marcar como contatado:', error);
    } finally {
      setContactingPatients(prev => {
        const newSet = new Set(prev);
        newSet.delete(patientId);
        return newSet;
      });
    }
  };

  const handleCopyMessage = async (patientId: string, patientName: string, category: number) => {
    const message = buildWhatsAppMessage(patientName, category);
    const copied = await copyTextToClipboard(message);

    if (!copied) return;

    setCopiedPatients(prev => new Set(prev).add(patientId));
    window.setTimeout(() => {
      setCopiedPatients(prev => {
        const next = new Set(prev);
        next.delete(patientId);
        return next;
      });
    }, 1500);
  };

  const getCategoryInfo = (category: 7 | 15 | 30 | 45 | 60 | 90 | 120 | 180 | 360) => {
    switch (category) {
      case 7:
        return {
          icon: '🟢',
          title: '7 dias',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 15:
        return {
          icon: '🟡',
          title: '15 dias',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          badgeColor: 'bg-yellow-100 text-yellow-800'
        };
      case 30:
        return {
          icon: '🟠',
          title: '30 dias',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          badgeColor: 'bg-orange-100 text-orange-800'
        };
      case 45:
        return {
          icon: '🟤',
          title: '45 dias',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-800',
          badgeColor: 'bg-amber-100 text-amber-800'
        };
      case 60:
        return {
          icon: '🔴',
          title: '60 dias',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          badgeColor: 'bg-red-100 text-red-800'
        };
      case 90:
        return {
          icon: '⚫',
          title: '90+ dias',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-800',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
      case 120:
        return {
          icon: '⚫',
          title: '120 dias',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-800',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
      case 180:
        return {
          icon: '⚫',
          title: '180 dias',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-800',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
      case 360:
        return {
          icon: '⚫',
          title: '360 dias',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-800',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
    }
  };

  if (totalAlerts === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Bell className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-green-800">✅ Todos os pacientes em dia</h3>
            <p className="text-sm text-green-600">Nenhum paciente precisa de acompanhamento no momento</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <Bell className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              🔔 Alertas de Retorno de Pacientes ({totalAlerts})
            </h3>
            <p className="text-sm text-gray-600">
              {totalAlerts} {totalAlerts === 1 ? 'paciente precisa' : 'pacientes precisam'} de acompanhamento
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewAllOverdue();
            }}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver todos os pacientes em atraso
          </button>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Ícone informativo */}
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Esses pacientes estão há mais tempo sem retornar. Acompanhe-os de perto para manter o plano alimentar eficiente.
            </p>
          </div>

          {([7, 15, 30, 45, 60, 90, 120, 180, 360] as const).map(category => {
            const categoryAlerts = groupedAlerts[category];
            if (categoryAlerts.length === 0) return null;

            const categoryInfo = getCategoryInfo(category);

            return (
              <div key={category} className={`${categoryInfo.bgColor} ${categoryInfo.borderColor} border rounded-lg p-4`}>
                <h4 className={`font-medium ${categoryInfo.textColor} mb-3 flex items-center gap-2`}>
                  <span className="text-lg">{categoryInfo.icon}</span>
                  {categoryInfo.title} ({categoryAlerts.length} {categoryAlerts.length === 1 ? 'paciente' : 'pacientes'})
                </h4>
                <div className="space-y-3">
                  {categoryAlerts.map(alert => (
                    <div 
                      key={alert.patient.id}
                      className="flex items-center justify-between bg-white rounded-md p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{alert.patient.name}</p>
                          <p className="text-sm text-gray-600">{alert.patient.phone}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              📅 {alert.daysSinceConsultation} {alert.daysSinceConsultation === 1 ? 'dia' : 'dias'} desde consulta
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryInfo.badgeColor}`}>
                          {alert.daysSinceConsultation} {alert.daysSinceConsultation === 1 ? 'dia' : 'dias'}
                        </span>
                        <button
                          onClick={() => handleCopyMessage(alert.patient.id, alert.patient.name, alert.category)}
                          disabled={copiedPatients.has(alert.patient.id)}
                          className={`px-4 py-2 text-sm rounded-md transition-colors flex items-center gap-2 ${
                            copiedPatients.has(alert.patient.id)
                              ? 'bg-green-600 text-white'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {copiedPatients.has(alert.patient.id) ? 'Copiado!' : 'Copiar mensagem (WhatsApp)'}
                        </button>
                        <button
                          onClick={() => handleMarkAsContacted(alert.patient.id, alert.daysSinceConsultation)}
                          disabled={contactingPatients.has(alert.patient.id)}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          {contactingPatients.has(alert.patient.id) ? 'Marcando...' : '✔ Já contatei'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

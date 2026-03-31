import React, { useState } from 'react';
import { Plus, Users, Bell, Calendar, Clock, LogOut, Stethoscope, Heart } from 'lucide-react';
import { PatientForm } from './PatientForm';
import { PatientFormMedico } from './PatientFormMedico';
import { PatientFormMariane } from './PatientFormMariane';
import { PatientAlertsPanel } from './PatientAlertsPanel';
import { PatientAlertsPanelMedico } from './PatientAlertsPanelMedico';
import { PatientAlertsPanelMariane } from './PatientAlertsPanelMariane';
import { ActiveRemindersPanel } from './ActiveRemindersPanel';
import { ActiveRemindersPanelMedico } from './ActiveRemindersPanelMedico';
import { ActiveRemindersPanelMariane } from './ActiveRemindersPanelMariane';
import { PatientList } from './PatientList';
import { PatientListMedico } from './PatientListMedico';
import { PatientListMariane } from './PatientListMariane';
import { usePatients } from '../hooks/usePatients';
import { usePatientsMedico } from '../hooks/usePatientsMedico';
import { usePatientsMariane } from '../hooks/usePatientsMariane';
import { shouldShowPatientInAlerts } from '../lib/patientAlerts';
import { Patient, PatientMedico, PatientMariane } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

type MainTab = 'rogerio' | 'medico' | 'mariane';
type SubTab = 'patients' | 'reminders';

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('rogerio');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('patients');
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [editingPatientMedico, setEditingPatientMedico] = useState<PatientMedico | null>(null);
  const [editingPatientMariane, setEditingPatientMariane] = useState<PatientMariane | null>(null);

  // Hooks para cada tipo de paciente
  const { 
    patients, 
    loading: patientsLoading, 
    addPatient, 
    editPatient, 
    removePatient,
    markAsContacted
  } = usePatients();

  const { 
    patients: patientsMedico, 
    loading: patientsMedicoLoading, 
    addPatient: addPatientMedico, 
    editPatient: editPatientMedico, 
    removePatient: removePatientMedico,
    markAsContacted: markAsContactedMedico
  } = usePatientsMedico();

  const { 
    patients: patientsMariane, 
    loading: patientsMarianeLoading, 
    addPatient: addPatientMariane, 
    editPatient: editPatientMariane, 
    removePatient: removePatientMariane,
    markAsContacted: markAsContactedMariane
  } = usePatientsMariane();

  const handleSavePatient = async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingPatient) {
      await editPatient(editingPatient.id, patientData);
      setEditingPatient(null);
    } else {
      await addPatient(patientData);
    }
  };

  const handleSavePatientMedico = async (patientData: Omit<PatientMedico, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingPatientMedico) {
      await editPatientMedico(editingPatientMedico.id, patientData);
      setEditingPatientMedico(null);
    } else {
      await addPatientMedico(patientData);
    }
  };

  const handleSavePatientMariane = async (patientData: Omit<PatientMariane, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingPatientMariane) {
      await editPatientMariane(editingPatientMariane.id, patientData);
      setEditingPatientMariane(null);
    } else {
      await addPatientMariane(patientData);
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      await removePatient(id);
    }
  };

  const handleDeletePatientMedico = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      await removePatientMedico(id);
    }
  };

  const handleDeletePatientMariane = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      await removePatientMariane(id);
    }
  };

  const handleViewAllOverdue = () => {
    setActiveMainTab('rogerio');
    setActiveSubTab('patients');
  };

  // Calcular lembretes ativos baseado na aba ativa
  const getActiveRemindersCount = () => {
    switch (activeMainTab) {
      case 'rogerio':
        return patients.filter(p => 
          shouldShowPatientInAlerts({
            consultationDate: p.last_consultation,
            lastContactedAt: p.last_contacted_at,
            lastContactedMilestone: p.last_contacted_milestone
          })
        ).length;
      case 'medico':
        return patientsMedico.filter(p => 
          shouldShowPatientInAlerts({
            consultationDate: p.data_consulta,
            lastContactedAt: p.last_contacted_at,
            lastContactedMilestone: p.last_contacted_milestone
          })
        ).length;
      case 'mariane':
        return patientsMariane.filter(p => 
          shouldShowPatientInAlerts({
            consultationDate: p.data_consulta,
            lastContactedAt: p.last_contacted_at,
            lastContactedMilestone: p.last_contacted_milestone
          })
        ).length;
      default:
        return 0;
    }
  };

  const getCurrentPatientCount = () => {
    switch (activeMainTab) {
      case 'rogerio': return patients.length;
      case 'medico': return patientsMedico.length;
      case 'mariane': return patientsMariane.length;
      default: return 0;
    }
  };

  // Abas principais
  const mainTabs = [
    { id: 'rogerio', label: 'Pacientes Rogério', icon: Users, count: patients.length },
    { id: 'medico', label: 'Pacientes Médico', icon: Stethoscope, count: patientsMedico.length },
    { id: 'mariane', label: 'Pacientes Mariane', icon: Heart, count: patientsMariane.length }
  ];

  // Sub-abas (apenas para Rogério por enquanto)
  const getSubTabs = () => {
    const baseCount = getCurrentPatientCount();
    const overdueCount = getActiveRemindersCount();
    
    return [
      { id: 'patients', label: 'Pacientes', icon: Users, count: baseCount },
      { id: 'reminders', label: 'Pacientes Vencidos', icon: Bell, count: overdueCount }
    ];
  };

  const subTabs = getSubTabs();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sistema Nutricionista</h1>
              <p className="text-gray-600">Gestão de pacientes e acompanhamentos</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Contador de lembretes vencidos para todas as abas */}
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                <Bell className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  {getActiveRemindersCount()} vencidos
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onLogout}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sair do sistema"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
                {/* Botão logout mobile */}
                <button
                  onClick={onLogout}
                  className="sm:hidden p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sair do sistema"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                {(activeSubTab === 'patients' || !activeSubTab) && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="hidden sm:flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Paciente
                  </button>
                )}
                {/* Botão novo paciente mobile */}
                {(activeSubTab === 'patients' || !activeSubTab) && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="sm:hidden p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    title="Novo Paciente"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação principal */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id as MainTab)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeMainTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">{tab.label}</span>
                <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                  activeMainTab === tab.id
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Sub-navegação para todas as abas */}
      {(activeMainTab === 'rogerio' || activeMainTab === 'medico' || activeMainTab === 'mariane') && (
        <nav className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex space-x-2 sm:space-x-8 overflow-x-auto">
              {subTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as SubTab)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeSubTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                    activeSubTab === tab.id
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Alertas para todas as abas */}
        {activeMainTab === 'rogerio' && (
          <PatientAlertsPanel 
            patients={patients}
            onViewAllOverdue={handleViewAllOverdue}
            onMarkAsContacted={(patientId, milestone) => markAsContacted(patientId, milestone)}
          />
        )}
        
        {activeMainTab === 'medico' && (
          <PatientAlertsPanelMedico 
            patients={patientsMedico}
            onViewAllOverdue={() => {
              setActiveMainTab('medico');
              setActiveSubTab('reminders');
            }}
            onMarkAsContacted={(patientId, milestone) => markAsContactedMedico(patientId, milestone)}
          />
        )}
        
        {activeMainTab === 'mariane' && (
          <PatientAlertsPanelMariane 
            patients={patientsMariane}
            onViewAllOverdue={() => {
              setActiveMainTab('mariane');
              setActiveSubTab('reminders');
            }}
            onMarkAsContacted={(patientId, milestone) => markAsContactedMariane(patientId, milestone)}
          />
        )}

        {/* Conteúdo baseado na aba ativa */}
        {activeMainTab === 'rogerio' && activeSubTab === 'patients' && (
          <PatientList
            patients={patients}
            loading={patientsLoading}
            onEdit={(patient) => {
              setEditingPatient(patient);
              setShowForm(true);
            }}
            onDelete={handleDeletePatient}
            onAddNew={() => setShowForm(true)}
          />
        )}

        {activeMainTab === 'rogerio' && activeSubTab === 'reminders' && (
          <ActiveRemindersPanel patients={patients} />
        )}

        {activeMainTab === 'medico' && activeSubTab === 'patients' && (
          <PatientListMedico
            patients={patientsMedico}
            loading={patientsMedicoLoading}
            onEdit={(patient) => {
              setEditingPatientMedico(patient);
              setShowForm(true);
            }}
            onDelete={handleDeletePatientMedico}
            onAddNew={() => setShowForm(true)}
          />
        )}

        {activeMainTab === 'medico' && activeSubTab === 'reminders' && (
          <ActiveRemindersPanelMedico patients={patientsMedico} />
        )}

        {activeMainTab === 'mariane' && activeSubTab === 'patients' && (
          <PatientListMariane
            patients={patientsMariane}
            loading={patientsMarianeLoading}
            onEdit={(patient) => {
              setEditingPatientMariane(patient);
              setShowForm(true);
            }}
            onDelete={handleDeletePatientMariane}
            onAddNew={() => setShowForm(true)}
          />
        )}
        
        {activeMainTab === 'mariane' && activeSubTab === 'reminders' && (
          <ActiveRemindersPanelMariane patients={patientsMariane} />
        )}
      </main>

      {/* Formulários condicionais */}
      {showForm && activeMainTab === 'rogerio' && activeSubTab === 'patients' && (
        <PatientForm
          patient={editingPatient || undefined}
          onSave={handleSavePatient}
          onClose={() => {
            setShowForm(false);
            setEditingPatient(null);
          }}
        />
      )}

      {showForm && activeMainTab === 'medico' && activeSubTab === 'patients' && (
        <PatientFormMedico
          patient={editingPatientMedico || undefined}
          onSave={handleSavePatientMedico}
          onClose={() => {
            setShowForm(false);
            setEditingPatientMedico(null);
          }}
        />
      )}

      {showForm && activeMainTab === 'mariane' && activeSubTab === 'patients' && (
        <PatientFormMariane
          patient={editingPatientMariane || undefined}
          onSave={handleSavePatientMariane}
          onClose={() => {
            setShowForm(false);
            setEditingPatientMariane(null);
          }}
        />
      )}
    </div>
  );
};

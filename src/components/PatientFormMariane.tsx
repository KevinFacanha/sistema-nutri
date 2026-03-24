import React, { useState } from 'react';
import { X, Save, User, Phone, Calendar, Hash, MapPin } from 'lucide-react';
import { PatientMariane, PatientOrigin, PatientSex } from '../types';

interface PatientFormMarianeProps {
  patient?: PatientMariane;
  onSave: (patientData: Omit<PatientMariane, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

const SEX_OPTIONS: PatientSex[] = ['Masculino', 'Feminino', 'Outro', 'Prefiro não informar'];
const ORIGIN_OPTIONS: PatientOrigin[] = [
  'Instagram',
  'TikTok',
  'Google Ads',
  'Indicação de amigo',
  'Indicação de outro profissional'
];

export const PatientFormMariane: React.FC<PatientFormMarianeProps> = ({ patient, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nome: patient?.nome || '',
    telefone: patient?.telefone || '',
    data_consulta: patient?.data_consulta || new Date().toISOString().split('T')[0],
    sexo: patient?.sexo || '',
    idade: patient?.idade?.toString() || '',
    origem_paciente: patient?.origem_paciente || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim() || !formData.telefone.trim()) return;
    if (formData.idade && (!/^\d+$/.test(formData.idade) || Number(formData.idade) <= 0)) return;

    const idade = formData.idade ? Number(formData.idade) : undefined;
    const payload: Omit<PatientMariane, 'id' | 'created_at' | 'updated_at'> = {
      nome: formData.nome,
      telefone: formData.telefone,
      data_consulta: formData.data_consulta
    };
    if (formData.sexo) payload.sexo = formData.sexo as PatientSex;
    if (idade !== undefined) payload.idade = idade;
    if (formData.origem_paciente) payload.origem_paciente = formData.origem_paciente as PatientOrigin;

    setLoading(true);
    try {
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {patient ? 'Editar Paciente da Mariane' : 'Novo Paciente da Mariane'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Nome do Paciente
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Telefone
            </label>
            <input
              type="tel"
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Data da Última Consulta
            </label>
            <input
              type="date"
              value={formData.data_consulta}
              onChange={(e) => setFormData(prev => ({ ...prev, data_consulta: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Sexo
            </label>
            <select
              value={formData.sexo}
              onChange={(e) => setFormData(prev => ({ ...prev, sexo: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              <option value="">Selecione</option>
              {SEX_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4 inline mr-2" />
              Idade
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={formData.idade}
              onChange={(e) => setFormData(prev => ({ ...prev, idade: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex.: 35"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Origem do Paciente
            </label>
            <select
              value={formData.origem_paciente}
              onChange={(e) => setFormData(prev => ({ ...prev, origem_paciente: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
            >
              <option value="">Selecione</option>
              {ORIGIN_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

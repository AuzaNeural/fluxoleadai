import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { KanbanStatus } from '../../types';
import { useLeads } from '../../context/LeadContext';
import { useToast } from '../../context/ToastContext';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: KanbanStatus;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  defaultStatus = 'Novo lead'
}) => {
  const { addLead } = useLeads();
  const { showToast } = useToast();

  const [companyName, setCompanyName] = useState('');
  const [niche, setNiche] = useState('Serviços Gerais');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<KanbanStatus>(defaultStatus);
  const [hasWebsite, setHasWebsite] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      showToast('O nome da empresa é obrigatório.', 'error');
      return;
    }

    addLead({
      company_name: companyName,
      niche,
      phone: phone || '(11) 90000-0000',
      whatsapp: phone ? '55' + phone.replace(/\D/g, '') : undefined,
      email: email || undefined,
      status,
      has_website: hasWebsite,
      notes: notes || undefined,
      tags: hasWebsite ? ['Com site'] : ['Sem site informado'],
      contacted: status !== 'Novo lead' && status !== 'Não contatado'
    });

    showToast(`Lead "${companyName}" cadastrado com sucesso!`, 'success');
    onClose();
    // Limpar campos
    setCompanyName('');
    setPhone('');
    setEmail('');
    setNotes('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastrar Novo Lead"
      subtitle="Insira as informações da empresa para iniciar a prospecção."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">
            Nome da Empresa / Negócio <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Ex: Consultório Odonto Prime"
            className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#2b2b2b] rounded-xl text-sm text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Nicho / Categoria</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Ex: Dentistas, Mecânica"
              className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#2b2b2b] rounded-xl text-sm text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Telefone / WhatsApp</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#2b2b2b] rounded-xl text-sm text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">E-mail de Contato</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contato@empresa.com"
            className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#2b2b2b] rounded-xl text-sm text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Etapa Inicial do CRM</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as KanbanStatus)}
              className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#2b2b2b] rounded-xl text-sm text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="Novo lead">Novo lead</option>
              <option value="Não contactado">Não contactado</option>
              <option value="Primeiro contato">Primeiro contato</option>
              <option value="Respondeu">Respondeu</option>
              <option value="Interessado">Interessado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Status do Site</label>
            <select
              value={hasWebsite ? 'true' : 'false'}
              onChange={(e) => setHasWebsite(e.target.value === 'true')}
              className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#2b2b2b] rounded-xl text-sm text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="false">Sem site informado (Oportunidade)</option>
              <option value="true">Já possui site</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Observações Internas</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anotações sobre a abordagem, horário de contato ou dores da empresa..."
            className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#2b2b2b] rounded-xl text-sm text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-[#1e1e1e] hover:bg-[#282828] text-gray-300 border border-[#333]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 glow-orange-btn"
          >
            Salvar Lead
          </button>
        </div>
      </form>
    </Modal>
  );
};


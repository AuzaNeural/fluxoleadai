import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Template } from '../../types';
import { useLeads } from '../../context/LeadContext';
import { useToast } from '../../context/ToastContext';
import { Sparkles, ArrowRight, CheckCircle2, Globe } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplate?: Template | null;
  onSuccess?: () => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  selectedTemplate,
  onSuccess
}) => {
  const { createProject } = useLeads();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [niche, setNiche] = useState(selectedTemplate?.category || 'Saúde & Odonto');
  const [phone, setPhone] = useState('(11) 98745-2311');
  const [city, setCity] = useState('São Paulo / SP');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Analisando nicho...');

  const handleNext = () => {
    if (!projectName.trim()) {
      showToast('Dê um nome ao seu projeto ou empresa.', 'error');
      return;
    }
    setStep(2);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const steps = [
      'Conectando motor de IA...',
      'Estruturando páginas e seções institucionais...',
      'Criando copy persuasiva para WhatsApp...',
      'Otimizando SEO local para Google Maps...',
      'Finalizando geração de site com IA!'
    ];

    for (let i = 0; i < steps.length; i++) {
      setLoadingStep(steps[i]);
      await new Promise((r) => setTimeout(r, 600));
    }

    createProject(projectName, selectedTemplate?.id || 'tmpl_1');
    setLoading(false);
    showToast(`Site "${projectName}" gerado com inteligência artificial!`, 'success');
    setStep(1);
    setProjectName('');
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Criar Novo Site com Inteligência Artificial"
      subtitle={selectedTemplate ? `Baseado no modelo: ${selectedTemplate.name}` : 'Gere uma landing page completa em segundos.'}
    >
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white mb-1">Gerando seu site com IA...</h4>
            <p className="text-xs text-gray-400 font-mono">{loadingStep}</p>
          </div>
          <div className="w-48 h-1.5 bg-[#222] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 animate-[pulse_1s_ease-in-out_infinite]"></div>
          </div>
        </div>
      ) : step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Nome da Empresa / Projeto <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Ex: Clínica Sorriso & Vida"
              className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#282828] rounded-xl text-sm text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Ramo de Atuação / Nicho</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="Ex: Odontologia, Mecânica, Estética"
              className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#282828] rounded-xl text-sm text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
            />
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
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 glow-orange-btn flex items-center gap-1.5"
            >
              <span>Próximo Passo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">WhatsApp para Botão</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#282828] rounded-xl text-sm text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Cidade / Região</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0a0a0a] border border-[#282828] rounded-xl text-sm text-white focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3.5 bg-[#0a0a0a] border border-[#222] rounded-xl text-xs text-gray-400 space-y-1">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Domínio gratuito com SSL incluso
            </p>
            <p>Seu site será publicado instantaneamente com link para demonstração ao cliente.</p>
          </div>

          <div className="flex justify-between items-center pt-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-medium text-gray-400 hover:text-white"
            >
              Voltar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 glow-orange-btn flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Site com IA</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};


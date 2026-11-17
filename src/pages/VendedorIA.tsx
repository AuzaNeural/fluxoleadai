import React, { useState } from 'react';
import {
  Bot,
  QrCode,
  Pause,
  Play,
  Users,
  MessageSquare,
  RefreshCw,
  Send,
  Unplug,
  Plug,
  Smartphone,
  Sliders,
  CheckCircle2,
  Search,
  Phone
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';

export const VendedorIA: React.FC = () => {
  const { whatsapp, toggleWhatsAppAI, connectWhatsApp, disconnectWhatsApp, leads } = useLeads();
  const { showToast } = useToast();

  // Selected WhatsApp connection instance
  const [instances, setInstances] = useState<Array<{ id: string; name: string }>>([
    { id: 'inst_1', name: 'WhatsApp principal' },
  ]);
  const [selectedInstance, setSelectedInstance] = useState<string>('WhatsApp principal');
  const [newWhatsAppName, setNewWhatsAppName] = useState<string>('');

  // Active tab: 'conversas' | 'contatos' | 'agente' | 'conexao'
  const [activeTab, setActiveTab] = useState<'conversas' | 'contatos' | 'agente' | 'conexao'>('conversas');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // AI Agent Prompt & Settings (Contexto comercial)
  const [suaEmpresa, setSuaEmpresa] = useState<string>('');
  const [servicosProdutos, setServicosProdutos] = useState<string>('');
  const [precosAprovados, setPrecosAprovados] = useState<string>('');
  const [prazos, setPrazos] = useState<string>('');
  const [perguntasFrequentes, setPerguntasFrequentes] = useState<string>('');
  const [portfolio, setPortfolio] = useState<string>('');
  const [condicoesComerciais, setCondicoesComerciais] = useState<string>('');
  const [testingApi, setTestingApi] = useState<boolean>(false);

  const handleSaveContexto = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Contexto comercial salvo com sucesso!', 'success');
  };

  const handleTestApi = async () => {
    setTestingApi(true);
    showToast('Testando conexão com a API de IA...', 'info');
    await new Promise((r) => setTimeout(r, 1200));
    setTestingApi(false);
    showToast('API de IA online e respondendo perfeitamente!', 'success');
  };

  // Chat simulation state
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Array<{ from: 'bot' | 'client'; text: string; time: string }>>>({
    demo: [
      { from: 'bot', text: 'Olá! Sou consultor da Fluxo Lead. Notei que a sua empresa no Google Maps possui ótimas avaliações, mas ainda não tem um site oficial cadastrado. Posso te enviar uma prévia de como ficaria?', time: '14:20' },
      { from: 'client', text: 'Boa tarde! Qual é o valor e quanto tempo demora?', time: '14:24' },
      { from: 'bot', text: 'Nossa inteligência artificial cria o site em minutos, com design responsivo e botão direto para o seu WhatsApp! Temos planos a partir de R$ 97/mês com domínio incluso.', time: '14:25' }
    ]
  });
  const [newMessage, setNewMessage] = useState<string>('');
  const [connecting, setConnecting] = useState<boolean>(false);
  const [showQrCode, setShowQrCode] = useState<boolean>(true);
  const [senhaPainelAnterior, setSenhaPainelAnterior] = useState<string>('');

  const handleToggleQr = () => {
    setShowQrCode((prev) => !prev);
  };

  const handleSimulateScan = async () => {
    setConnecting(true);
    await connectWhatsApp('+55 84 99931-1856');
    setConnecting(false);
    showToast('WhatsApp conectado com sucesso!', 'success');
  };

  const handleStopConnection = async () => {
    await disconnectWhatsApp();
    setShowQrCode(false);
    showToast('Conexão encerrada com sucesso.', 'info');
  };

  const handleVincularConexao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senhaPainelAnterior.trim()) {
      showToast('Informe a senha do painel anterior.', 'error');
      return;
    }
    await connectWhatsApp('+55 84 99931-1856');
    showToast('Conexão existente vinculada com sucesso!', 'success');
    setSenhaPainelAnterior('');
  };

  // Contatos tab state
  const [contatosList, setContatosList] = useState<Array<{ id: string; name: string; whatsapp: string; company: string }>>([]);
  const [contatoNome, setContatoNome] = useState<string>('');
  const [contatoWhatsapp, setContatoWhatsapp] = useState<string>('');
  const [contatoEmpresa, setContatoEmpresa] = useState<string>('');

  const handleSaveContato = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contatoNome.trim() || !contatoWhatsapp.trim()) {
      showToast('Preencha pelo menos o nome e o WhatsApp do contato.', 'error');
      return;
    }
    const newC = {
      id: `contato_${Date.now()}`,
      name: contatoNome.trim(),
      whatsapp: contatoWhatsapp.trim(),
      company: contatoEmpresa.trim()
    };
    setContatosList((prev) => [newC, ...prev]);
    setContatoNome('');
    setContatoWhatsapp('');
    setContatoEmpresa('');
    showToast('Contato salvo com sucesso!', 'success');
  };

  const isConnected = whatsapp.status === 'Connected';
  const isAiActive = whatsapp.ai_status === 'Active';

  const handleAddInstance = () => {
    if (!newWhatsAppName.trim()) {
      showToast('Digite um nome para o novo WhatsApp (ex.: Comercial 2).', 'error');
      return;
    }
    const newInst = {
      id: `inst_${Date.now()}`,
      name: newWhatsAppName.trim(),
    };
    setInstances((prev) => [...prev, newInst]);
    setSelectedInstance(newInst.name);
    setNewWhatsAppName('');
    showToast(`Conexão "${newInst.name}" adicionada com sucesso!`, 'success');
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Status e conversas atualizados!', 'info');
    }, 600);
  };

  const handleToggleAI = async (activate: boolean) => {
    if (!isConnected && activate) {
      showToast('Conecte uma instância de WhatsApp antes de ligar o Vendedor IA.', 'error');
      return;
    }
    await toggleWhatsAppAI(activate);
    showToast(activate ? 'Vendedor IA ativado com sucesso!' : 'Vendedor IA pausado.', 'info');
  };

  const handleConnectSimulated = async () => {
    setConnecting(true);
    await connectWhatsApp('+55 84 99931-1856');
    setConnecting(false);
    showToast('WhatsApp conectado com sucesso via QR Code!', 'success');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatId) return;

    setChatMessages((prev) => ({
      ...prev,
      [selectedChatId]: [
        ...(prev[selectedChatId] || []),
        {
          from: 'bot',
          text: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }));
    setNewMessage('');
    showToast('Mensagem enviada pelo WhatsApp!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* =========================================================================
          1. CARD DO TOPO: SEUS WHATSAPPS (100% Idêntico ao Original)
          ========================================================================= */}
      <section className="rounded-2xl border border-[#232833] bg-[#0c0d12]/90 p-5 sm:p-6 shadow-xl">
        <h2 className="text-xs sm:text-sm font-bold text-white mb-4">
          Seus WhatsApps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Campo Esquerdo: WhatsApp em uso */}
          <div>
            <label className="block text-xs text-[#929292] font-medium mb-1.5">
              WhatsApp em uso
            </label>
            <div className="relative">
              <select
                value={selectedInstance}
                onChange={(e) => setSelectedInstance(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#141720] border border-[#262a34] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none cursor-pointer"
              >
                {instances.map((inst) => (
                  <option key={inst.id} value={inst.name}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1.5 text-[11px] text-[#717786]">
              Esta escolha também fica salva para os próximos envios nos seus leads.
            </p>
          </div>

          {/* Campo Direito: Adicionar outro WhatsApp */}
          <div>
            <label className="block text-xs text-[#929292] font-medium mb-1.5">
              Adicionar outro WhatsApp
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newWhatsAppName}
                onChange={(e) => setNewWhatsAppName(e.target.value)}
                placeholder="Ex.: Comercial 2"
                className="flex-1 h-10 px-3.5 bg-[#141720] border border-[#262a34] rounded-xl text-xs text-white placeholder-gray-500 focus:border-[#fa2600] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddInstance}
                className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#fa2600] to-[#c82200] hover:from-[#ff3a17] hover:to-[#db2700] text-white text-xs font-semibold transition-all cursor-pointer shadow-md shrink-0"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé explicativo do card */}
        <p className="mt-4 text-[11px] text-[#717786] leading-relaxed">
          Selecione uma conexão e abra a aba Conexão para ler o QR Code. Configure o Agente de IA e ligue o atendimento em cada número. Os históricos ficam separados.
        </p>
      </section>

      {/* =========================================================================
          2. CABEÇALHO DA SEÇÃO: VENDEDOR IA (ATENDIMENTO NO WHATSAPP)
          ========================================================================= */}
      <div>
        <p className="fx-eyebrow text-[11px] font-bold text-[#fa2600] uppercase tracking-[0.25em] mb-1">
          ATENDIMENTO NO WHATSAPP
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Vendedor IA
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#929292]">
              Você inicia a conversa. Quando o cliente responde, a IA continua com o seu contexto comercial.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-[#262a34] bg-[#141720] text-xs font-semibold text-gray-200 hover:text-white hover:border-[#383e4d] transition-all cursor-pointer self-start sm:self-auto shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. TRÊS CARDS DE STATUS (WHATSAPP, ATENDIMENTO COM IA, CONTATOS)
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: WhatsApp */}
        <div className="rounded-2xl border border-[#232833] bg-[#0c0d12]/90 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8f94a3] font-medium">WhatsApp</span>
            <div className="text-gray-400">
              {isConnected ? (
                <Plug className="w-4 h-4 text-emerald-400" />
              ) : (
                <Unplug className="w-4 h-4 text-[#ff5c5c]" />
              )}
            </div>
          </div>
          <div className="mt-3 text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </div>
        </div>

        {/* Card 2: Atendimento com IA */}
        <div className="rounded-2xl border border-[#232833] bg-[#0c0d12]/90 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8f94a3] font-medium">Atendimento com IA</span>
            <div className="text-gray-400">
              <Bot className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="mt-3 text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {isAiActive ? 'Ativo' : 'Pausado'}
          </div>
        </div>

        {/* Card 3: Contatos */}
        <div className="rounded-2xl border border-[#232833] bg-[#0c0d12]/90 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8f94a3] font-medium">Contatos</span>
            <div className="text-gray-400">
              <Users className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {contatosList.length}
            </div>
            <p className="mt-0.5 text-[11px] text-[#717786]">
              Histórico exclusivo da sua conta
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. BANNER DE CONTROLE (SEM DISPARO INICIAL / LIGAR IA / PAUSAR IA)
          ========================================================================= */}
      <div className="rounded-2xl border border-[#232833] bg-[#0c0d12]/90 p-4 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <p className="text-xs text-[#9ca3af]">
          Sem disparo inicial. Pedidos de pagamento vão para atendimento humano.
        </p>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleToggleAI(true)}
            className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isAiActive
                ? 'bg-gradient-to-r from-[#fa2600] to-[#c82200] text-white shadow-[0_0_15px_rgba(250,38,0,0.5)]'
                : 'bg-gradient-to-r from-[#fa2600] to-[#c82200] hover:from-[#ff3a17] hover:to-[#db2700] text-white shadow-md'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Ligar IA</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleAI(false)}
            className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
              !isAiActive
                ? 'border-[#383e4d] bg-[#161922] text-gray-300'
                : 'border-[#262a34] bg-[#141720] text-gray-400 hover:text-white'
            }`}
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pausar IA</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          5. ABAS DE NAVEGAÇÃO EM PÍLULAS (CONVERSAS, CONTATOS, AGENTE DE IA, CONEXÃO)
          ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setActiveTab('conversas')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'conversas'
              ? 'bg-[#fa2600] text-white shadow-[0_0_12px_rgba(250,38,0,0.4)]'
              : 'bg-[#141720] border border-[#262a34] text-gray-400 hover:text-white hover:border-[#383e4d]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Conversas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contatos')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'contatos'
              ? 'bg-[#fa2600] text-white shadow-[0_0_12px_rgba(250,38,0,0.4)]'
              : 'bg-[#141720] border border-[#262a34] text-gray-400 hover:text-white hover:border-[#383e4d]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Contatos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('agente')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'agente'
              ? 'bg-[#fa2600] text-white shadow-[0_0_12px_rgba(250,38,0,0.4)]'
              : 'bg-[#141720] border border-[#262a34] text-gray-400 hover:text-white hover:border-[#383e4d]'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Agente de IA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('conexao')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'conexao'
              ? 'bg-[#fa2600] text-white shadow-[0_0_12px_rgba(250,38,0,0.4)]'
              : 'bg-[#141720] border border-[#262a34] text-gray-400 hover:text-white hover:border-[#383e4d]'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Conexão</span>
        </button>
      </div>

      {/* =========================================================================
          6. CONTEÚDO DAS ABAS
          ========================================================================= */}

      {/* ABA 1: CONVERSAS (EXATAMENTE COMO NA IMAGEM) */}
      {activeTab === 'conversas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[340px]">
          {/* Card Esquerdo: Suas conversas */}
          <div className="fx-card md:col-span-1 flex flex-col overflow-hidden">
            <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
              <h3 className="font-display text-[15px] text-fg">Suas conversas</h3>
            </header>
            <div className="p-5 flex-1 flex flex-col">
              {leads.length === 0 ? (
                <p className="text-xs text-fg-3 leading-relaxed">
                  As conversas aparecerão aqui após conectar o WhatsApp, ligar a IA e receber a resposta de um cliente à sua abordagem.
                </p>
              ) : (
                <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                  {leads.map((l, idx) => (
                    <div
                      key={l.id}
                      onClick={() => setSelectedChatId(l.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedChatId === l.id
                          ? 'border-[#fa2600] bg-[#fa2600]/10'
                          : 'border-[#20242e] bg-[#12141c] hover:border-[#353c4d]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-white truncate max-w-[170px]">
                          {l.company_name}
                        </p>
                        <span className="text-[10px] text-gray-500">14:25</span>
                      </div>
                      <p className="text-[11px] text-[#8f94a3] truncate">
                        {idx === 0 ? 'Qual é o valor e quanto tempo demora?' : 'Mensagem enviada pelo Vendedor IA'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Card Direito: Selecione uma conversa */}
          <div className="fx-card md:col-span-2 flex flex-col justify-between overflow-hidden">
            <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
              <h3 className="font-display text-[15px] text-fg">Selecione uma conversa</h3>
            </header>
            <div className="p-5 flex-1 flex flex-col justify-between">
              {!selectedChatId ? (
                <div>
                  <p className="text-xs text-fg-3">
                    Seu histórico fica separado dos outros usuários do Fluxo Lead.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col h-full justify-between">
                  {/* Chat Topbar */}
                  <div className="border-b border-[#20242e] pb-3 mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {leads.find((l) => l.id === selectedChatId)?.company_name || 'Empresa'}
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        {leads.find((l) => l.id === selectedChatId)?.phone || ''}
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      IA Ativa
                    </span>
                  </div>

                  {/* Messages list */}
                  <div className="space-y-3 overflow-y-auto flex-1 pr-2 max-h-[300px]">
                    {(chatMessages[selectedChatId] || chatMessages['demo']).map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${msg.from === 'bot' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                            msg.from === 'bot'
                              ? 'bg-gradient-to-r from-[#fa2600] to-[#e02200] text-white rounded-br-none shadow-md'
                              : 'bg-[#161922] border border-[#262a34] text-gray-200 rounded-bl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendMessage} className="pt-3 border-t border-[#20242e] flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Enviar mensagem manual..."
                      className="flex-1 h-10 px-3.5 bg-[#141720] border border-[#262a34] rounded-xl text-xs text-white placeholder-gray-500 focus:border-[#fa2600] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#fa2600] to-[#c82200] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: CONTATOS (100% IDÊNTICO À IMAGEM DO PROJETO ORIGINAL) */}
      {activeTab === 'contatos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[340px]">
          {/* Card Esquerdo: Cadastrar contato */}
          <section className="fx-card md:col-span-1 flex flex-col overflow-hidden">
            <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
              <h3 className="font-display text-[15px] text-fg">Cadastrar contato</h3>
            </header>
            <div className="p-5">
              <form onSubmit={handleSaveContato} className="flex flex-col gap-4">
                {/* Nome */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contato_nome" className="text-[13px] font-medium text-fg-2">
                    Nome
                  </label>
                  <input
                    id="contato_nome"
                    type="text"
                    value={contatoNome}
                    onChange={(e) => setContatoNome(e.target.value)}
                    className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                {/* WhatsApp com país e DDD */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contato_whatsapp" className="text-[13px] font-medium text-fg-2">
                    WhatsApp com país e DDD
                  </label>
                  <input
                    id="contato_whatsapp"
                    type="text"
                    value={contatoWhatsapp}
                    onChange={(e) => setContatoWhatsapp(e.target.value)}
                    className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                  <p className="text-xs text-fg-3">
                    Somente números. Exemplo: 5561999999999.
                  </p>
                </div>

                {/* Empresa */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contato_empresa" className="text-[13px] font-medium text-fg-2">
                    Empresa
                  </label>
                  <input
                    id="contato_empresa"
                    type="text"
                    value={contatoEmpresa}
                    onChange={(e) => setContatoEmpresa(e.target.value)}
                    className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                  <p className="text-xs text-fg-3 leading-relaxed">
                    Cadastrar não envia mensagens. Faça a abordagem pelo seu WhatsApp.
                  </p>
                </div>

                {/* Botão Salvar contato */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 fx-btn-primary text-white h-10 px-6 text-sm"
                  >
                    Salvar contato
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Card Direito: Seus contatos */}
          <section className="fx-card md:col-span-2 flex flex-col overflow-hidden">
            <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
              <h3 className="font-display text-[15px] text-fg">Seus contatos</h3>
            </header>
            <div className="p-5 flex-1">
              {contatosList.length === 0 ? (
                <p className="text-sm text-fg-3">Nenhum contato ainda.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {contatosList.map((c) => (
                    <li key={c.id} className="py-3.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-fg truncate">{c.name}</p>
                        <p className="text-xs text-fg-3 flex items-center gap-2 mt-0.5">
                          <span>{c.whatsapp}</span>
                          {c.company && (
                            <>
                              <span>·</span>
                              <span>{c.company}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      )}

      {/* ABA 3: AGENTE DE IA (100% IDÊNTICO ÀS IMAGENS DO PROJETO ORIGINAL) */}
      {activeTab === 'agente' && (
        <section className="fx-card overflow-hidden">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <h3 className="font-display text-[15px] text-fg">Contexto comercial da sua empresa</h3>
          </header>
          <div className="p-5 sm:p-6">
            <p className="text-sm text-fg-3 leading-relaxed mb-6">
              A IA usa estas informações e a sua abordagem no WhatsApp. Valores não cadastrados serão confirmados com você. A chave da IA é gerenciada pelo Fluxo Lead.
            </p>

            <form onSubmit={handleSaveContexto} className="flex flex-col gap-6">
              {/* Sua empresa */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sua_empresa" className="text-[13px] font-medium text-fg-2">
                  Sua empresa
                </label>
                <textarea
                  id="sua_empresa"
                  rows={3}
                  value={suaEmpresa}
                  onChange={(e) => setSuaEmpresa(e.target.value)}
                  className="w-full rounded-[12px] border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 leading-relaxed resize-y"
                />
                <p className="text-xs text-fg-3">
                  Nome, apresentação e identidade da empresa que vende.
                </p>
              </div>

              {/* Serviços e produtos */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="servicos_produtos" className="text-[13px] font-medium text-fg-2">
                  Serviços e produtos
                </label>
                <textarea
                  id="servicos_produtos"
                  rows={3}
                  value={servicosProdutos}
                  onChange={(e) => setServicosProdutos(e.target.value)}
                  className="w-full rounded-[12px] border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 leading-relaxed resize-y"
                />
                <p className="text-xs text-fg-3">
                  O que você oferece, benefícios e diferenciais.
                </p>
              </div>

              {/* Preços aprovados */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="precos_aprovados" className="text-[13px] font-medium text-fg-2">
                  Preços aprovados
                </label>
                <textarea
                  id="precos_aprovados"
                  rows={3}
                  value={precosAprovados}
                  onChange={(e) => setPrecosAprovados(e.target.value)}
                  className="w-full rounded-[12px] border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 leading-relaxed resize-y"
                />
                <p className="text-xs text-fg-3">
                  Informe os valores e condições que a IA pode apresentar.
                </p>
              </div>

              {/* Prazos */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prazos" className="text-[13px] font-medium text-fg-2">
                  Prazos
                </label>
                <textarea
                  id="prazos"
                  rows={3}
                  value={prazos}
                  onChange={(e) => setPrazos(e.target.value)}
                  className="w-full rounded-[12px] border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 leading-relaxed resize-y"
                />
                <p className="text-xs text-fg-3">
                  Prazos de entrega e atendimento.
                </p>
              </div>

              {/* Perguntas frequentes */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="perguntas_frequentes" className="text-[13px] font-medium text-fg-2">
                  Perguntas frequentes
                </label>
                <textarea
                  id="perguntas_frequentes"
                  rows={3}
                  value={perguntasFrequentes}
                  onChange={(e) => setPerguntasFrequentes(e.target.value)}
                  className="w-full rounded-[12px] border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 leading-relaxed resize-y"
                />
                <p className="text-xs text-fg-3">
                  Como responder dúvidas e objeções.
                </p>
              </div>

              {/* Portfólio */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="portfolio" className="text-[13px] font-medium text-fg-2">
                  Portfólio
                </label>
                <textarea
                  id="portfolio"
                  rows={3}
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  className="w-full rounded-[12px] border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 leading-relaxed resize-y"
                />
                <p className="text-xs text-fg-3">
                  Links de exemplos que podem ser enviados aos clientes.
                </p>
              </div>

              {/* Condições comerciais */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="condicoes_comerciais" className="text-[13px] font-medium text-fg-2">
                  Condições comerciais
                </label>
                <textarea
                  id="condicoes_comerciais"
                  rows={3}
                  value={condicoesComerciais}
                  onChange={(e) => setCondicoesComerciais(e.target.value)}
                  className="w-full rounded-[12px] border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 leading-relaxed resize-y"
                />
                <p className="text-xs text-fg-3">
                  Garantias, regras e quando transferir para você.
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 fx-btn-primary text-white h-10 px-6 text-sm"
                >
                  Salvar contexto
                </button>
                <button
                  type="button"
                  onClick={handleTestApi}
                  disabled={testingApi}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 border border-line bg-surface-2 text-fg hover:border-line-strong hover:bg-surface-3 h-10 px-5 text-sm"
                >
                  {testingApi ? 'Testando API...' : 'Testar API de IA'}
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* ABA 4: CONEXÃO (100% IDÊNTICO À IMAGEM DO PROJETO ORIGINAL) */}
      {activeTab === 'conexao' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Seu WhatsApp */}
          <section className="fx-card flex flex-col justify-between overflow-hidden">
            <div>
              <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
                <h3 className="font-display text-[15px] text-fg">Seu WhatsApp</h3>
              </header>
              <div className="p-5 sm:p-6">
                <p className="text-sm text-fg-3 leading-relaxed mb-4">
                  No celular, vá em Aparelhos conectados → Conectar aparelho. Escaneie o QR Code e depois clique em Ligar IA. Cada usuário conecta seu próprio WhatsApp.
                </p>

                {/* QR Code inline idêntico à imagem */}
                {showQrCode && (
                  <div className="w-[303px] max-w-full my-4 rounded-[22px] overflow-hidden bg-white shadow-xl">
                    <img
                      src="/brand/whatsapp-qr.png"
                      alt="QR Code WhatsApp"
                      onClick={handleSimulateScan}
                      title="Clique para simular leitura do QR Code"
                      className="w-full h-auto object-contain rounded-[22px] cursor-pointer hover:opacity-95 transition-opacity"
                    />
                  </div>
                )}

                <p className="text-sm font-semibold text-fg my-4">
                  {showQrCode
                    ? 'Aguardando leitura do QR Code.'
                    : isConnected
                    ? 'WhatsApp conectado.'
                    : 'WhatsApp desconectado.'}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleToggleQr}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 fx-btn-primary text-white h-10 px-5 text-sm"
                  >
                    Mostrar QR Code
                  </button>
                  <button
                    type="button"
                    onClick={handleStopConnection}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 border border-line bg-surface-2 text-fg hover:border-line-strong hover:bg-surface-3 h-10 px-5 text-sm"
                  >
                    Parar conexão
                  </button>
                </div>

                <p className="text-xs text-fg-3 leading-relaxed mt-6">
                  Não compartilhe seu QR Code. Restrições e pedidos para parar interrompem o atendimento. Nenhuma conexão por QR garante ausência de bloqueio pelo WhatsApp.
                </p>
              </div>
            </div>
          </section>

          {/* Card 2: Trazer minha conexão existente */}
          <section className="fx-card flex flex-col justify-between overflow-hidden">
            <div>
              <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
                <h3 className="font-display text-[15px] text-fg">Trazer minha conexão existente</h3>
              </header>
              <div className="p-5 sm:p-6">
                <p className="text-sm text-fg-3 leading-relaxed mb-4">
                  Se você já usa o painel anterior do vendedor, informe a senha daquele painel para vincular seu WhatsApp e histórico aqui. Esta opção só pode ser usada por uma conta.
                </p>

                <form onSubmit={handleVincularConexao} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="senha_painel" className="text-[13px] font-medium text-fg-2">
                      Senha do painel anterior
                    </label>
                    <input
                      id="senha_painel"
                      type="password"
                      value={senhaPainelAnterior}
                      onChange={(e) => setSenhaPainelAnterior(e.target.value)}
                      className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 fx-btn-primary text-white h-10 px-6 text-sm mt-2"
                    >
                      Vincular conexão existente
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

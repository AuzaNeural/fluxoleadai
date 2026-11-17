# 🚀 Fluxo Lead AI (Clone Completo)

Plataforma Premium de prospecção de empresas via Google Maps, criação de sites com Inteligência Artificial e CRM Kanban integrado.

---

## 🛠️ Tecnologias Utilizadas
* **Framework**: React 18 + TypeScript + Vite
* **Estilização**: Tailwind CSS com tema Dark Mode Nativo (`bg-[#0a0a0a]`, cards `bg-[#121212]`, efeitos glow laranja)
* **Ícones**: Lucide React
* **Persistência**: LocalStorage + Mock API com delay de rede simulado
* **Automação & Drag and Drop**: HTML5 Drag and Drop nativo nas colunas do CRM

---

## 🧩 Módulos Implementados

### 1. Layout Global & Design System
* **Tela de Login**: Efeito de curva/arco laranja brilhante (`.glow-arch`), campos de e-mail e senha com toggle de visibilidade, validações e botão degradê com glow.
* **Banner de Cookies**: Modal lateral direito com toggles individuais (Necessários, Analíticos, Marketing, Preferências) e botões de ação.
* **Sidebar Completa**: 11 seções navegáveis com ícones dedicados, estado ativo com gradiente laranja vibrante, rodapé com badge de plano PRO, dados do usuário ("Anderson") e botão para recolher o menu.

### 2. Telas & Visualizações
* **Visão Geral (Dashboard)**: Saudação personalizada, grid com 8 cards de métricas (Empresas encontradas, Leads salvos, Sem site informado, Com site, Leads contactados, Negociações em andamento, Projetos criados, Buscas disponíveis).
* **Buscar Empresas**: Formulário de busca avançada no Google Maps com filtros em pills, validação obrigatória (Nicho, UF, Cidade) e tabela de resultados com salvamento instantâneo no CRM.
* **Meus Leads**: Gestão de contatos, filtros por etapa e presença web, exportação/importação de CSV e ações rápidas de WhatsApp.
* **CRM (Kanban)**: 5 colunas (*Novo lead*, *Não contactado*, *Primeiro contato*, *Respondeu*, *Interessado*) com recurso de **arrastar e soltar (drag and drop)**.
* **Vendedor IA**: Painel de automação do WhatsApp com 3 cards de status, abas de chat simulado, contatos na fila, configuração de prompt da IA e QR Code de conexão.
* **Templates**: Catálogo de landing pages de alta conversão divididos por categorias em pills com acionamento do gerador de sites com IA.
* **Meus Projetos**: Listagem de sites gerados, status Rascunho/Publicado e wizard de criação passo a passo.
* **Sites Publicados**: Empty state original quando vazio e listagem de links online com certificado SSL ativo.
* **Planos e Assinatura**: Status do plano Anual, barra de consumo de buscas do mês, tabela comparativa de planos e histórico de faturas.
* **Histórico**: Auditoria de ações registradas na conta com filtros por categoria.
* **Configurações**: Edição de perfil, alteração de senha e encerramento de sessões ativas remotas.
* **Suporte**: Abertura de chamados com validação de campos e listagem com empty state.

---

## 🏃 Como Rodar Localmente

```bash
# Instalar dependências
npm install

# Rodar o servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

O servidor local é executado em `http://localhost:3000/`.


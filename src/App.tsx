import { useState, useEffect } from 'react';
import { 
  Building2, Bot, BadgeCheck, BookOpen, Clock, 
  MapPin, Phone, Mail, Award, ArrowUpRight, Share2, 
  Layers, Users, Shield, Sparkles, Lock
} from 'lucide-react';

// Import our modular custom components
import ConsorcioSimulator from './components/ConsorcioSimulator';
import AtendimentoChat from './components/AtendimentoChat';
import GestoresSection from './components/GestoresSection';
import EduFinanceira from './components/EduFinanceira';
import PushNotificationSimulator from './components/PushNotificationSimulator';
import TrabalheConosco from './components/TrabalheConosco';
import AdminPanel from './components/AdminPanel';
import { WhyConsorcio, StepByStep, FAQSection, StickyWhatsApp } from './components/CorporateSections';

type TabType = 'simulation' | 'atendimento' | 'gestores' | 'trabalhe' | 'admin';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('simulation');
  const [showEduHub, setShowEduHub] = useState(false);

  // Auto scroll to elements if needed
  useEffect(() => {
    // Scroll mildly to section header to maintain visibility of our interactive system
    if (activeTab) {
      const element = document.getElementById("content-hub");
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeTab]);

  return (
    <div className="bg-[#f8fafc] text-slate-800 font-sans min-h-screen selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      
      {/* 1. Header & Navigation inside a sticky bar */}
      <header className="sticky top-0 z-40 bg-[#05112c]/95 backdrop-blur-md border-b border-blue-900/45 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between py-4 md:h-20 gap-4">
            
            {/* Logo details with brand compliance */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-tr from-blue-700 to-blue-900 border border-blue-500/30 p-2 rounded-xl shadow-lg relative shrink-0">
                <Building2 className="w-5.5 h-5.5 text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#05112c] animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base sm:text-lg font-black text-white tracking-tight uppercase leading-none">
                  DSS <span className="text-blue-300 font-medium font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-blue-950 ml-1 border border-blue-900">Intermediação</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                  Afiliada Autorizada Ademicon
                </span>
              </div>
            </div>

            {/* Custom Interactive Navigation Bar for easily moving around the site (tipo assim) */}
            <nav className="flex items-center bg-[#0d1f4d] p-1 rounded-2xl border border-blue-900/40 shadow-inner">
              {[
                { id: 'simulation', label: 'Simulação' },
                { id: 'atendimento', label: 'Atendimento' },
                { id: 'gestores', label: 'Gestores' },
                { id: 'trabalhe', label: 'Trabalhe Conosco' }
              ].map((item) => (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setShowEduHub(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === item.id && !showEduHub
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-[#11275f]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Header Right Widgets: Notification Bell & Education Shortcut */}
            <div className="flex items-center space-x-3.5 shrink-0">
              <button
                onClick={() => {
                  setShowEduHub(!showEduHub);
                  const element = document.getElementById("content-hub");
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                  showEduHub 
                    ? 'bg-blue-600 text-white border-blue-600 font-extrabold' 
                    : 'bg-[#0d1f4d] border-blue-900/40 text-slate-300 hover:text-white hover:bg-[#11275f]'
                }`}
                title="Central de Educação Financeira"
              >
                <BookOpen className="w-4 h-4 text-blue-300" />
                <span className="hidden lg:inline">Educação Financeira</span>
              </button>

              {/* Floating Alert Trigger */}
              <PushNotificationSimulator />

              {/* Admin Panel Entry Button */}
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setShowEduHub(false);
                }}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  activeTab === 'admin'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md font-extrabold'
                    : 'bg-[#0d1f4d] border-blue-900/40 text-slate-300 hover:text-white hover:bg-[#11275f]'
                }`}
                title="Painel de Administração de Leads (Restrito)"
                id="admin-panel-toggle"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 2. Hero Presentation Block - Blue top fading/changing into White below */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-[#05112c] via-[#091b40] to-[#f8fafc] text-slate-100 border-b border-slate-200">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[130px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-fadeIn">
              <div className="inline-flex items-center space-x-2 bg-blue-600/15 border border-blue-500/30 px-3 py-1.5 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider mx-auto lg:mx-0">
                <Award className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Especialista Autorizada Ademicon</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Consórcio Planejado e Seguro com a <span className="text-blue-300 underline decoration-blue-500/40 underline-offset-4">DSS Intermediação</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                A <strong className="font-semibold text-white">Ademicon</strong> é especialista em consórcios há 30 anos (desde 1991), consolidada como uma das maiores administradoras independentes do Brasil. 
                A <strong className="font-semibold text-white">DSS Intermediação</strong> atua há 14 anos, desde 2012, oferecendo consultoria estratégica e atendimento personalizado para a conquista segura do seu patrimônio.
              </p>

              {/* Real credibility strip */}
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto max-w-sm mx-auto lg:mx-0">
                <div className="bg-[#0b193c]/80 border border-blue-900/30 p-4 rounded-2xl text-center shadow-lg">
                  <span className="text-2xl font-black text-white block">30 Anos</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 block">Ademicon no Brasil</span>
                </div>
                <div className="bg-[#0b193c]/80 border border-blue-900/30 p-4 rounded-2xl text-center shadow-lg">
                  <span className="text-2xl font-black text-blue-300 block">14 Anos</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 mt-1 block">Atuação da DSS</span>
                </div>
              </div>
            </div>

            {/* Beautiful Luxury House Image Section */}
            <div className="lg:col-span-5 relative group w-full max-w-lg mx-auto">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[32px] blur opacity-25 group-hover:opacity-35 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#0d1f4d] border border-blue-900/45 rounded-[28px] p-2 overflow-hidden shadow-2xl">
                <img 
                  src="/src/assets/images/beautiful_house_1779733686313.png" 
                  alt="Casa de Alto Padrão - Consórcio Imobiliário" 
                  referrerPolicy="no-referrer"
                  className="w-full h-56 sm:h-72 object-cover rounded-[22px] shadow-inner transform hover:scale-[1.01] transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-[#05112c]/90 backdrop-blur-md rounded-2xl p-3.5 border border-blue-500/20 text-left">
                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-400 block">Conquista Patrimonial</span>
                  <span className="text-xs font-bold text-white mt-0.5 block leading-tight">Projete seu imóvel com a assessoria especializada da DSS.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Central Interactive Hub (Beautifully transitioned to White Background) */}
      <main id="content-hub" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-8 scroll-mt-24">
        
        {/* If user triggered education shortcut, render it directly on top with simple close option */}
        {showEduHub && (
          <div className="bg-white border border-blue-200 p-5 rounded-3xl relative animate-fadeIn mb-2 shadow-sm text-slate-800">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setShowEduHub(false)}
                className="text-xs font-mono font-bold text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
              >
                Esconder Central
              </button>
            </div>
            <EduFinanceira />
          </div>
        )}

        {/* Unified Tab Switcher Navigation (EXACTLY FOUR MAIN TABS MAPPED ACCIENT COLORING BLUE) */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-250 pb-3">
            <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-250 w-full md:max-w-2xl mx-auto shadow-sm">
              
              {/* Tab 1: Simulação */}
              <button
                id="tab-simulador"
                onClick={() => {
                  setActiveTab('simulation');
                  setShowEduHub(false);
                }}
                className={`py-3 px-1 rounded-xl text-center text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 sm:space-x-2 ${
                  activeTab === 'simulation' && !showEduHub
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Layers className="w-4.5 h-4.5 shrink-0" />
                <span>Simulador</span>
              </button>

              {/* Tab 2: Atendimento */}
              <button
                id="tab-atendimento"
                onClick={() => {
                  setActiveTab('atendimento');
                  setShowEduHub(false);
                }}
                className={`py-3 px-1 rounded-xl text-center text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 sm:space-x-2 ${
                  activeTab === 'atendimento' && !showEduHub
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Bot className="w-4.5 h-4.5 shrink-0" />
                <span>Atendimento</span>
              </button>

              {/* Tab 3: Gestores */}
              <button
                id="tab-gestores"
                onClick={() => {
                  setActiveTab('gestores');
                  setShowEduHub(false);
                }}
                className={`py-3 px-1 rounded-xl text-center text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 sm:space-x-2 ${
                  activeTab === 'gestores' && !showEduHub
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <BadgeCheck className="w-4.5 h-4.5 shrink-0" />
                <span>Gestores</span>
              </button>

              {/* Tab 4: Trabalhe Conosco */}
              <button
                id="tab-trabalhe"
                onClick={() => {
                  setActiveTab('trabalhe');
                  setShowEduHub(false);
                }}
                className={`py-3 px-1 rounded-xl text-center text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center space-x-1.5 sm:space-x-2 ${
                  activeTab === 'trabalhe' && !showEduHub
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Users className="w-4.5 h-4.5 shrink-0" />
                <span>Carreiras</span>
              </button>

            </div>
          </div>

          {/* Active Tab rendering slot */}
          <div className="pt-2 text-slate-800">
            {activeTab === 'simulation' && (
              <div className="space-y-12">
                <ConsorcioSimulator />
                <WhyConsorcio />
                <StepByStep />
                <FAQSection />
              </div>
            )}
            {activeTab === 'atendimento' && <AtendimentoChat />}
            {activeTab === 'gestores' && <GestoresSection />}
            {activeTab === 'trabalhe' && <TrabalheConosco />}
            {activeTab === 'admin' && <AdminPanel />}
          </div>
        </div>
      </main>

      {/* Floating WhatsApp contact component */}
      <StickyWhatsApp />

      {/* 4. Footer in Deep Slate/Blue Theme */}
      <footer className="bg-[#05112c] border-t border-slate-950 py-12 text-left mt-16 text-xs sm:text-sm text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-blue-950">
            {/* Directives and History */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-white text-sm">DSS Intermediação Ltda</h5>
              <p className="text-slate-300 font-light leading-relaxed">
                Empresa parceira e afiliada licenciada oficial Ademicon Consórcios e Investimentos. Prestamos consultoria de planejamento de crédito, lances e lances embutidos com total transparência e segurança regulada pelo Banco Central.
              </p>
            </div>

            {/* Quick links & regulatory info */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-[#3b82f6] text-sm">Estrutura Reguladora</h5>
              <div className="space-y-2 text-slate-305 font-light">
                <p>◆ Administradora: Ademicon Administradora de Consórcios S.A.</p>
                <p>◆ CNPJ Ademicon: 76.538.318/0001-34</p>
                <p>◆ Registro do Banco Central do Brasil: Nº 03/00.003-9</p>
              </div>
            </div>

            {/* Direct addresses */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-white text-sm">Informação e Contato</h5>
              <div className="space-y-2 text-slate-350 font-light">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Av. Batel, 1230 - Batel, Curitiba - PR</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>+55 11 99355-1951 / +55 11 98280-3557</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>contato@dssintermediacao.com.br</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-light">
            <span>© 2026 DSS Intermediação. Afiliada autorizada Ademicon. Todos os direitos reservados.</span>
            <div className="flex flex-wrap items-center gap-4 justify-center">
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setShowEduHub(false);
                }}
                className="hover:text-blue-400 hover:underline transition font-bold cursor-pointer flex items-center space-x-1 text-[11px]"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Área Restrita (Admin)</span>
              </button>
              <div className="flex items-center space-x-1.5 font-mono">
                <Shield className="w-3.5 h-3.5 text-emerald-500/60" />
                <span>Conexão Segura Criptografada SSL</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

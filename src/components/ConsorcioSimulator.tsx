import React, { useState, useMemo } from 'react';
import { 
  Building2, Car, Activity, Info, FileSpreadsheet, Share2, 
  HelpCircle, Sparkles, User, Phone, Mail, Check, Calendar, ArrowRight, Save
} from 'lucide-react';
import { SIM_CONFIGS } from '../data';
import { Lead } from '../types';

export default function ConsorcioSimulator() {
  const [activeCategory, setActiveCategory] = useState<'imoveis' | 'veiculos' | 'servicos'>('imoveis');
  const [credit, setCredit] = useState(SIM_CONFIGS.imoveis.defaultCredit);
  const [term, setTerm] = useState(SIM_CONFIGS.imoveis.defaultTerm);
  const [useReduced, setUseReduced] = useState(true);
  const [useEmbedded, setUseEmbedded] = useState(false);

  // Form Lead State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [savedLeadsCount, setSavedLeadsCount] = useState(() => {
    try {
      const existing = localStorage.getItem('dss_leads_list');
      return existing ? JSON.parse(existing).length : 0;
    } catch {
      return 0;
    }
  });

  const config = useMemo(() => {
    return SIM_CONFIGS[activeCategory];
  }, [activeCategory]);

  // Adjust credit/term when category changes to fit limits
  const handleCategoryChange = (cat: 'imoveis' | 'veiculos' | 'servicos') => {
    setActiveCategory(cat);
    const targetConfig = SIM_CONFIGS[cat];
    setCredit(targetConfig.defaultCredit);
    setTerm(targetConfig.defaultTerm);
    setIsSubmitted(false);
  };

  const formattedCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculations
  const calculations = useMemo(() => {
    // Total admin tax is typically split over the term
    const totalTaxFactor = 1 + config.adminTax + config.reserveTax;
    const totalWithTaxes = credit * totalTaxFactor;
    
    // Normal installment
    const installmentFull = totalWithTaxes / term;
    
    // Reduced 70% installment (exclusive to Ademicon)
    const installmentReduced = installmentFull * 0.7;

    // Simulated Bank Financing comparison
    const annualRate = activeCategory === 'imoveis' ? 0.095 : activeCategory === 'veiculos' ? 0.15 : 0.18;
    const monthlyRate = annualRate / 12;
    const pmtFinancing = credit * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    const totalFinancing = pmtFinancing * term;
    const savingComparedToFinancing = totalFinancing - totalWithTaxes;

    return {
      installmentFull,
      installmentReduced,
      totalWithTaxes,
      totalFinancing,
      savingComparedToFinancing,
      monthlyAdminTax: (config.adminTax / term) * 100,
      embeddedBidValue: credit * 0.3
    };
  }, [credit, term, config, activeCategory]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    const newLead: Lead = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      name: leadName,
      phone: leadPhone,
      email: leadEmail || 'nao_informado@dss.com.br',
      category: activeCategory,
      creditSelected: credit,
      termSelected: term,
      estimatedInstallmentFull: calculations.installmentFull,
      estimatedInstallmentReduced: calculations.installmentReduced,
      useEmbeddedBid: useEmbedded,
      date: new Date().toLocaleDateString('pt-BR')
    };

    try {
      // Secondary backup local state
      const existing = localStorage.getItem('dss_leads_list');
      const leadsList = existing ? JSON.parse(existing) : [];
      leadsList.push(newLead);
      localStorage.setItem('dss_leads_list', JSON.stringify(leadsList));
      setSavedLeadsCount(leadsList.length);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    }

    // Direct real-time backend persistence
    fetch('/api/leads', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLead)
    })
    .then(res => res.json())
    .then(data => {
      console.log("Lead sincronizado com o servidor:", data);
    })
    .catch(err => {
      console.error("Erro ao sincronizar lead com o servidor:", err);
    });
  };

  const handleCopyLink = () => {
    const formattedText = `DSS Simulação - Consórcio Ademicon
Categoria: ${activeCategory.toUpperCase()}
Crédito: ${formattedCurrency(credit)}
Prazo: ${term} meses
Parc. Facilitada (70%): ${formattedCurrency(calculations.installmentReduced)}
Parc. Integral (100%): ${formattedCurrency(calculations.installmentFull)}
Poupe até ${formattedCurrency(calculations.savingComparedToFinancing)} vs financiamento bancário!
Visite dss-intermediacao.com.br`;

    navigator.clipboard.writeText(formattedText).then(() => {
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2500);
    });
  };

  const downloadCSV = () => {
    try {
      const existing = localStorage.getItem('dss_leads_list');
      if (!existing) return;
      const list = JSON.parse(existing);
      
      const headers = "ID,Data,Nome,Telefone,Email,Categoria,Credito,Prazo,Parcela_Cheia,Parcela_Reduzida,Lance_Embutido\n";
      const rows = list.map((l: Lead) => 
        `"${l.id}","${l.date}","${l.name}","${l.phone}","${l.email}","${l.category}",${l.creditSelected},${l.termSelected},${l.estimatedInstallmentFull.toFixed(2)},${l.estimatedInstallmentReduced.toFixed(2)},${l.useEmbeddedBid}`
      ).join("\n");

      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `dss_simulacoes_leads.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="simulator-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      
      {/* Simulation Box controls */}
      <div className="lg:col-span-7 bg-white border border-slate-205 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
        
        {/* Category selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">1. Selecione a Modalidade de Consórcio</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'imoveis', label: 'Imóveis', icon: <Building2 className="w-4 h-4" /> },
              { id: 'veiculos', label: 'Veículos', icon: <Car className="w-4 h-4" /> },
              { id: 'servicos', label: 'Serviços', icon: <Activity className="w-4 h-4" /> }
            ].map((cat) => (
              <button
                key={cat.id}
                id={`cat-button-${cat.id}`}
                onClick={() => handleCategoryChange(cat.id as any)}
                className={`py-3 px-2 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  activeCategory === cat.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Credit Value slider */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Escolha o Crédito pretendido</label>
            <span className="text-base sm:text-lg font-black text-blue-750 font-mono">{formattedCurrency(credit)}</span>
          </div>
          <input
            type="range"
            min={config.minCredit}
            max={config.maxCredit}
            step={config.stepCredit}
            value={credit}
            onChange={(e) => setCredit(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Mín: {formattedCurrency(config.minCredit)}</span>
            <span>Máx: {formattedCurrency(config.maxCredit)}</span>
          </div>

          {/* Quick Credit Selection Chips */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Atalhos de valores rápidos:</span>
            <div className="flex flex-wrap gap-1.5">
              {(activeCategory === 'imoveis' 
                ? [200000, 500000, 1000000, 3000000, 5000000, 10000000] 
                : activeCategory === 'veiculos' 
                ? [100000, 250000, 500000, 1000000, 2000000, 3000000] 
                : [15000, 30000, 50000, 75000, 100000]
              ).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setCredit(v)}
                  className={`py-1 px-2.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                    credit === v 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {v >= 1000000 ? `${v / 1000000}mi` : `${v / 1000}k`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Terms choice */}
        <div className="space-y-4 pt-1">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">3. Período do Plano (Prazo em Meses)</label>
            <span className="text-base sm:text-lg font-black text-blue-750 font-mono">{term} meses</span>
          </div>

          <input
            type="range"
            min={12}
            max={config.terms[config.terms.length - 1]}
            step={1}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Mín: 12 meses</span>
            <span>Máx: {config.terms[config.terms.length - 1]} meses</span>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ou atalhos de prazos comuns:</span>
            <div className="flex flex-wrap gap-1.5">
              {config.terms.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTerm(t)}
                  className={`py-1.5 px-3 rounded-xl text-center font-mono text-xs font-bold border transition-all cursor-pointer ${
                    term === t 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-extrabold shadow-sm' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  {t} meses
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Addons checkboxes */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-505 uppercase tracking-wider block">4. Otimizadores de Contemplação</label>
          
          <div className="space-y-2.5">
            {/* Parcela Reduzida */}
            <div 
              onClick={() => setUseReduced(!useReduced)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                useReduced 
                  ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
                  : 'bg-slate-50/20 border-slate-200 hover:bg-slate-100/60'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                useReduced ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
              }`}>
                {useReduced && <Check className="w-3.5 h-3.5 stroke-[4px]" />}
              </div>
              <div className="space-y-1 select-none text-slate-800">
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Parcela Facilitada Ademicon (70%)</h4>
                  <span className="bg-blue-100 text-blue-705 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Excl. Ademicon</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-normal font-light">
                  Pague apenas 70% do valor da parcela até a sua contemplação por sorteio ou lance. A diferença é diluída apenas depois do recebimento do bem.
                </p>
              </div>
            </div>

            {/* Lance Embutido */}
            <div 
              onClick={() => setUseEmbedded(!useEmbedded)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                useEmbedded 
                  ? 'bg-blue-50/55 border-blue-200 shadow-sm' 
                  : 'bg-slate-50/20 border-slate-200 hover:bg-slate-100/60'
              }`}
            >
              <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                useEmbedded ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
              }`}>
                {useEmbedded && <Check className="w-3.5 h-3.5 stroke-[4px]" />}
              </div>
              <div className="space-y-1 select-none text-slate-800">
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Lance Embutido de até 30%</h4>
                <p className="text-slate-505 text-[11px] leading-normal font-light">
                  Permite utilizar até 30% do próprio crédito (<strong>{formattedCurrency(calculations.embeddedBidValue)}</strong>) para turbinar o seu lance de contemplação voluntário.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculations Breakdown and Lead Capture */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Results layout */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Parcelas Estimadas Ademicon</span>
          </div>

          <div className="space-y-4">
            {useReduced ? (
              <div className="p-4 bg-blue-50/45 rounded-2xl border border-blue-200 relative overflow-hidden">
                <div className="absolute top-2.5 right-3 px-1.5 py-0.5 bg-blue-600 text-[8px] font-black text-white rounded">
                  70% ATÉ CONTEMPLAÇÃO
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide font-mono block">Parcela Facilitada inicial</span>
                <span className="text-2xl sm:text-3xl font-black text-blue-700 font-mono mt-1 block">
                  {formattedCurrency(calculations.installmentReduced)}
                  <span className="text-xs font-semibold text-slate-500">/mês</span>
                </span>
                <span className="text-[10px] text-slate-450 leading-normal block mt-1.5 font-light">
                  Após a contemplação, a parcela se ajusta para o valor cheio com acréscimo de saldo diluído.
                </span>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide font-mono block">Parcela Integral Regular</span>
                <span className="text-xl sm:text-2xl font-black text-slate-850 font-mono mt-1 block">
                  {formattedCurrency(calculations.installmentFull)}
                  <span className="text-xs font-semibold text-slate-500">/mês</span>
                </span>
                <span className="text-[10px] text-slate-450 leading-normal block mt-1.5 font-light">
                  Plano linear tradicional do início ao fim sem facilitador temporário de 70%.
                </span>
              </div>
            )}

            {/* Sub details metrics */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-light">Valor total contratado:</span>
                <span className="text-slate-800 font-bold font-mono">{formattedCurrency(credit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-light">Taxa Administrativa total:</span>
                <span className="text-slate-800 font-bold font-mono">{(config.adminTax * 100).toFixed(1)}% <span className="text-[10px] text-slate-400">({(calculations.monthlyAdminTax).toFixed(3)}%/mês)</span></span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-light">Fundo de Reserva total:</span>
                <span className="text-slate-800 font-bold font-mono">{(config.reserveTax * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold">
                <span className="text-slate-700">Total do Consórcio:</span>
                <span className="text-blue-700 font-mono">{formattedCurrency(calculations.totalWithTaxes)}</span>
              </div>
            </div>

            {/* Smart Comparison to Financial compound interest */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/60 text-xs">
              <span className="font-extrabold text-emerald-800 block mb-1">◆ ALERTA DE ECONOMIA PATRIMONIAL</span>
              <p className="text-slate-600 leading-relaxed font-light">
                Planejando com a DSS Intermediação, você economiza aproximadamente <strong className="text-emerald-700 font-mono">{formattedCurrency(calculations.savingComparedToFinancing)}</strong> em comparação ao financiamento tradicional de bancos comerciais varejistas.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {/* Share simulation */}
            <div className="relative flex-1">
              <button
                onClick={handleCopyLink}
                className="w-full px-3 py-2.5 bg-slate-120 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-blue-600" />
                <span>Compartilhar</span>
              </button>
              {showShareTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-11 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wide shadow-md z-30 whitespace-nowrap animate-fadeIn">
                  Copiado para área de transferência!
                </div>
              )}
            </div>

            {/* If admin leads lists, show export button */}
            {savedLeadsCount > 0 && (
              <button
                onClick={downloadCSV}
                className="px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title="Exportar Simulações Salvas como CSV"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Salvos ({savedLeadsCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Lead Form Box */}
        <div id="lead-form-section" className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5 sm:p-6 space-y-3.5 relative shadow-sm">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700">
                <Check className="w-6 h-6 stroke-[3px]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800 text-sm">Simulação Registrada!</h4>
                <p className="text-slate-500 text-xs font-light max-w-xs mx-auto">
                  Seus dados de planejamento foram salvos localmente. Nossos gestores autorizados Denilson ou Davison entrarão em contato para estruturá-lo no melhor grupo Ademicon.
                </p>
              </div>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-2 text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Realizar nova simulação de crédito
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Save className="w-4.5 h-4.5 text-blue-600" />
                  <span>Deseja registrar essa proposta?</span>
                </h4>
                <p className="text-slate-500 text-xs font-light">
                  Preencha os campos abaixo de forma real para que os gestores analisem as taxas do grupo ideal para você de forma rápida.
                </p>
              </div>

              <div className="space-y-3">
                {/* Nome */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-450 focus:outline-none focus:border-blue-500 text-xs h-9 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Telefone */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp (com DDD)"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-450 focus:outline-none focus:border-blue-500 text-xs h-9 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450" />
                    <input
                      type="email"
                      placeholder="Seu melhor e-mail"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-80 \ placeholder-slate-450 focus:outline-none focus:border-blue-500 text-xs h-9 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span>Obter Análise Oficial de Taxas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

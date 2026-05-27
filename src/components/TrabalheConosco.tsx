import React, { useState } from 'react';
import { Briefcase, ArrowRight, CheckCircle2, Award, ClipboardCheck, Sparkles, User, Phone, Mail, FileText } from 'lucide-react';

export default function TrabalheConosco() {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [experiencia, setExperiencia] = useState('nenhuma');
  const [mensagem, setMensagem] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !whatsapp) return;

    // Simulate database or lead registration for hiring
    const candidateData = {
      id: Math.random().toString(),
      nome,
      whatsapp,
      email,
      experiencia,
      mensagem,
      date: new Date().toLocaleDateString('pt-BR')
    };

    try {
      const existing = localStorage.getItem('dss_candidates_list');
      const candidatesList = existing ? JSON.parse(existing) : [];
      candidatesList.push(candidateData);
      localStorage.setItem('dss_candidates_list', JSON.stringify(candidatesList));
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    }

    // Direct real-time backend candidate persistence
    fetch('/api/candidates', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: candidateData.id,
        name: candidateData.nome,
        phone: candidateData.whatsapp,
        email: candidateData.email || 'nao_informado@dss.com.br',
        experience: candidateData.experiencia,
        message: candidateData.mensagem,
        date: candidateData.date
      })
    })
    .catch(err => {
      console.error("Erro ao enviar interesse ao servidor:", err);
    });
  };

  return (
    <div id="trabalhe-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      
      {/* Left Pitch Column */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Oportunidade Comercial DSS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
            Venha Ser um Consultor de <span className="text-blue-700">Inteligência Patrimonial</span>
          </h2>
          <p className="text-slate-500 font-light text-xs sm:text-sm leading-relaxed">
            A <strong>DSS Intermediação</strong> cresce em ritmo acelerado em parceria com a <strong>Ademicon</strong>. Procuramos profissionais éticos, ambiciosos e focados em estruturar grandes planos de consórcio e consultoria de crédito corporativo.
          </p>
        </div>

        {/* Benefits bullet grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          {[
            {
              title: "Altíssimas Comissões",
              desc: "Ganhos recorrentes e estruturados proporcionais ao volume de créditos intermediados (ticket patrimonial elevado)."
            },
            {
              title: "Treinamentos Oficiais",
              desc: "Acesso integral aos métodos de lances da Ademicon Academy e capacitações de alavancagem de capitais."
            },
            {
              title: "Estrutura Operacional",
              desc: "Suporte comercial dedicado para fechamento de lances embutidos complexos e assembleias."
            },
            {
              title: "Indicação de Leads",
              desc: "Acesso a ferramentas de inteligência para trabalhar simulações quentes no nicho de alto padrão."
            }
          ].map((b, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-150 transition-colors space-y-1.5">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{b.title}</h4>
              </div>
              <p className="text-slate-500 text-[11px] sm:text-xs leading-normal font-light">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Real Certification seal */}
        <div className="p-4 bg-blue-50/55 rounded-2xl border border-blue-100 flex items-start space-x-3 text-xs">
          <Award className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-slate-800">Parceria Transparente DSS & Ademicon</h5>
            <p className="text-slate-500 leading-normal font-light">
              Nossa operação de intermediação respeita as diretrizes rígidas do Banco Central do Brasil. Os novos consultores parceiros se unem a uma marca consolidada, recebendo assessoria direta de nossos fundadores Davison e Denilson.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm relative">
          
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="w-5 h-5 text-blue-700" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Candidatura Comercial</span>
          </div>

          {isSubmitted ? (
            <div className="py-8 text-center space-y-3.5 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-6 h-6 stroke-[3px]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800 text-sm">Dados Enviados com Sucesso!</h4>
                <p className="text-slate-500 text-xs font-light max-w-xs mx-auto">
                  Agradecemos seu interesse em atuar com a DSS Intermediação. Nosso comitê de contratação de corretores credenciados analisará suas informações e entrará em contato via WhatsApp.
                </p>
              </div>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline block mx-auto mt-2"
              >
                Enviar nova proposta de parceria
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Preencha seus dados de contato</h4>
                <p className="text-slate-400 text-[11px] font-light leading-normal">
                  Selecione sua maturidade comercial. Analisamos todos os perfis estrategicamente.
                </p>
              </div>

              <div className="space-y-3">
                {/* Nome */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-450 focus:outline-none focus:border-blue-500 focus:bg-white text-xs h-9 transition-all"
                  />
                </div>

                {/* WhatsApp */}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp para contato (com DDD)"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-450 focus:outline-none focus:border-blue-500 focus:bg-white text-xs h-9 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-450 focus:outline-none focus:border-blue-500 focus:bg-white text-xs h-9 transition-all"
                  />
                </div>

                {/* Experiencia Selector */}
                <div className="space-y-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider block">
                  <span className="text-[10px] text-slate-400 font-bold block">Qual seu nível de experiência?</span>
                  <select 
                    value={experiencia} 
                    onChange={(e) => setExperiencia(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-500 text-xs h-9 font-normal"
                  >
                    <option value="nenhuma">Iniciante / Sem experiência na área comercial</option>
                    <option value="vendas_geral">Já atuo com vendas (outros segmentos)</option>
                    <option value="imoveis_veiculos">Corretor de Imóveis ou Veículos</option>
                    <option value="consorcio_banco">Já vendi consórcios ou crédito bancário</option>
                  </select>
                </div>

                {/* Mensagem */}
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    placeholder="Fale um pouco sobre você ou deixe suas dúvidas..."
                    rows={3}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-450 focus:outline-none focus:border-blue-500 focus:bg-white text-xs transition-all font-light"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-transform cursor-pointer"
              >
                <span>Enviar Formulário de Carreira</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

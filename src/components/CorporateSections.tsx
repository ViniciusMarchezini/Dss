import React, { useState } from 'react';
import { 
  DollarSign, Percent, ArrowUpRight, CheckCircle2, 
  HelpCircle, ShieldAlert, Award, FileText, ChevronDown, 
  ChevronUp, Sparkles, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Custom comparative card component
export function WhyConsorcio() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 animate-fadeIn">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-105 px-3 py-1.5 rounded-full uppercase tracking-wider">
          Planejamento Inteligente
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          Comparação Direta: Consórcio Ademicon vs. Financiamento Comum
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-light max-w-2xl mx-auto">
          Veja por que planejar seu patrimônio com a assessoria da DSS Intermediação e a robustez da Ademicon é a decisão financeira mais lúcida do mercado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Consorcio Card */}
        <div className="bg-[#05112c] text-white rounded-2xl p-6 border border-blue-900/40 relative overflow-hidden flex flex-col justify-between space-y-6 shadow-md shadow-blue-950/20">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Percent className="w-40 h-40" />
          </div>
          
          <div className="space-y-4 relative z-10 text-left">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <h4 className="font-extrabold text-lg text-white">Consórcio Ademicon</h4>
            </div>

            <p className="text-slate-300 text-xs font-light leading-relaxed">
              Sistema de autofinanciamento planejado. O recurso é arrecadado mensalmente através do esforço mútuo dos consorciados, livre de juros rotativos.
            </p>

            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-start space-x-2.5">
                <span className="text-emerald-400 mt-0.5">✔</span>
                <span><strong>Taxa de Juros: 0%</strong> (Apenas taxa administrativa diluída altamente competitiva).</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-emerald-400 mt-0.5">✔</span>
                <span><strong>Entrada e Menos Burocracia:</strong> Não exige valor de entrada imediato para iniciar os planos.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-emerald-400 mt-0.5">✔</span>
                <span><strong>Poder de Compra Real:</strong> Ao ser contemplado por sorteio ou lance, a carta de crédito equivale a dinheiro à vista, permitindo descontos agressivos.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-emerald-400 mt-0.5">✔</span>
                <span><strong>Parcela Facilitada:</strong> Opção de pagar apenas 70% da parcela integral até a sua contemplação exclusiva.</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-950/60 rounded-xl p-3 border border-blue-900 text-blue-300 font-mono text-[10px] uppercase font-bold text-center">
            👑 Escolha mais econômica e com retorno garantido a médio prazo
          </div>
        </div>

        {/* Financiamento Comum Card */}
        <div className="bg-slate-50 text-slate-700 rounded-2xl p-6 border border-slate-250 relative overflow-hidden flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 bg-red-50 border border-red-100 text-red-500 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h4 className="font-extrabold text-lg text-slate-800">Financiamento Tradicional</h4>
            </div>

            <p className="text-slate-500 text-xs font-light leading-relaxed">
              Crédito bancário imediato custeado por captação externa, incidindo em alta alavancagem com aplicação diária de juros compostos.
            </p>

            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start space-x-2.5">
                <span className="text-red-500 mt-0.5">✘</span>
                <span><strong>Juros Compostos Abusivos:</strong> Custo final do bem pode ultrapassar o dobro ou triplo do valor simulado original.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-red-500 mt-0.5">✘</span>
                <span><strong>Entrada Obrigatória:</strong> Bancos exigem entre 20% a 30% do custo total do bem quitado upfront.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-red-500 mt-0.5">✘</span>
                <span><strong>Análise Rígida:</strong> Processo de aprovação burocrático e taxas que flutuam conforme a economia geral.</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <span className="text-red-500 mt-0.5">✘</span>
                <span><strong>Desvalorização de Garantias:</strong> Enquanto o bem deprecia, a dívida continua sofrendo correção monetária periódica.</span>
              </li>
            </ul>
          </div>

          <div className="bg-rose-50/55 rounded-xl p-3 border border-rose-100 text-red-650 font-mono text-[10px] uppercase font-bold text-center">
            ⚠ Alto impacto no orçamento familiar e endividamento prolongado
          </div>
        </div>

      </div>
    </div>
  );
}

// 4-step explanation section
export function StepByStep() {
  const steps = [
    {
      num: "01",
      title: "Simulação e Planejamento",
      desc: "Você define o valor da sua carta de crédito de acordo com seus objetivos (Imóvel, Automóvel ou Serviços) e escolhe a parcela ideal para o seu bolso hoje."
    },
    {
      num: "02",
      title: "Formação de Poupança",
      desc: "Mensalmente você realiza as contribuições planejadas. Esse caixa consolidado é gerado de forma segura e auditada para custear as futuras aquisições."
    },
    {
      num: "03",
      title: "Sorteios ou Lances",
      desc: "Todos os meses você concorre pelo sorteio da loteria federal ou pode acelerar sua contemplação ofertando um lance embutido (usando parte da sua própria carta)."
    },
    {
      num: "04",
      title: "Contemplação e Compra",
      desc: "Com a carta de crédito liberada em mãos, você adquire o bem desejado à vista, com plena liberdade de escolha e autonomia para negociar descontos expressivos."
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8 text-left">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-105 px-3 py-1.5 rounded-full uppercase tracking-wider">
          Passo a Passo Simplificado
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          Como Funciona o Consórcio do Começo à Conquista?
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-light max-w-2xl mx-auto">
          Entender o mecanismo por trás do consórcio ajuda a extrair o máximo de benefícios estratégicos da sua futura carta de crédito planejada.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
        {steps.map((step, idx) => (
          <div key={idx} className="relative bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-sm transition duration-300 flex flex-col justify-between min-h-[180px] group">
            <div className="space-y-3">
              <span className="text-3xl font-black text-blue-200 group-hover:text-blue-600 transition duration-300 font-mono block leading-none">
                {step.num}
              </span>
              <h4 className="font-extrabold text-sm text-slate-800 tracking-tight">{step.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-light">{step.desc}</p>
            </div>
            
            {idx < 3 && (
              <div className="hidden lg:block absolute -right-3.5 top-[38%] translate-y-[-50%] z-20">
                <span className="text-slate-350 text-base font-bold font-mono">→</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Accordion-style Frequently Asked Questions
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "O que é e como funciona o lance embutido no consórcio Ademicon?",
      a: "O lance embutido é uma facilidade comercial extraordinária oferecida pela Ademicon que permite que você utilize até um limite percentual (frequentemente até 30% ou mais conforme o grupo escolhido) do valor da sua própria carta de crédito para pagar o seu lance ofertado. Ou seja, se a sua carta é de R$ 200.000, você pode dar um lance de R$ 60.000 usando a própria carta, necessitando apenas quitar a diferença ou até mesmo reduzindo o valor total do crédito retirado (comprando um bem de R$ 140.000 livre de custos imediatos do próprio bolso)."
    },
    {
      q: "É seguro ingressar no consórcio da Ademicon?",
      a: "Totalmente seguro e auditado. As regras de regulação e fiscalização de consórcio no Brasil são rigorosamente estabelecidas pela Lei nº 11.795/2008 e supervisionadas pelo Banco Central do Brasil. A Ademicon possui 30 anos de mercado sólido, possuindo autorização expressa outorgada pelo Banco Central nº 03/00.003-9, o que significa que seus fundos são protegidos com as mais altas garantias bancárias e comerciais modernas do país."
    },
    {
      q: "O que significa a parcela reduzida de 70%?",
      a: "A modalidade facilitada de Parcela Reduzida permite ao consorciado planejar sua conquista financeira pagando um valor mensal otimizado, equivalente a 70% da parcela integral de seu crédito antes de ser contemplado. Com isso, seu planejamento ganha folga no orçamento. Após a sua contemplação exclusiva (quando a carta de crédito total é retirada para compra), a parcela é recalculada para compensar a facilidade, ajustada proporcionalmente ao saldo devedor de maneira transparente."
    },
    {
      q: "Quais bens e serviços posso contratar no consórcio?",
      a: "Você tem flexibilidade irrestrita. O grupo de consórcio de Imóveis serve para aquisição de casas, apartamentos, terrenos, construções, reformas ou quitação de financiamentos anteriores. O grupo de Veículos atende veículos de passeio, caminhões, maquinários de frotas e náutica. Já o grupo de Serviços atende viagens, eventos corporativos, procedimentos cirúrgicos de saúde variados, casamentos de alto planejamento ou serviços de tecnologia consultiva em geral."
    },
    {
      q: "Em quanto tempo posso ser contemplado no consórcio Ademicon?",
      a: "A contemplação ocorre através de assembleias mensais conduzidas pela Ademicon. Mensalmente, cada grupo conta com contemplações por via de sorteios da loteria federal. Além do sorteio, você tem o direito garantido de ofertar um lance mensalmente para acelerar sua obtenção. O lance vencedor com o maior valor ofertado é contemplado. Com a nossa assessoria personalizada da DSS Intermediação, analisamos o histórico e o comportamento de lances médios do grupo para montar a melhor estratégia de lance para você."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-105 px-3 py-1.5 rounded-full uppercase tracking-wider">
          Dúvidas Frequentes
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          Perguntas Frequentes Sobre Consórcios
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-light max-w-2xl mx-auto">
          Encontre respostas para as perguntas mais comuns e conheça a mecânica segura do nosso sistema Ademicon.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-2">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50 hover:bg-white transition duration-200"
            >
              <button
                type="button"
                onClick={() => handleToggle(idx)}
                className="w-full py-4.5 px-5 flex items-center justify-between text-left text-xs sm:text-sm font-extrabold text-slate-800 select-none cursor-pointer focus:outline-none"
              >
                <div className="flex items-center space-x-2.5">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{faq.q}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4.5 h-4.5 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4.5 h-4.5 text-slate-500 shrink-0" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pt-1 border-t border-slate-150/60 text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Corporate Sticky Contact & Differential banner
export function StickyWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-[#05112c]/95 border border-blue-900/40 text-white p-3.5 rounded-2xl shadow-xl max-w-[240px] text-xs relative font-light text-left"
          >
            <button 
              onClick={() => setShowTooltip(false)}
              className="absolute top-1.5 right-1.5 font-sans font-bold text-[9px] hover:text-red-400 select-none cursor-pointer"
            >
              ✕
            </button>
            <span className="font-extrabold text-blue-300 uppercase tracking-widest text-[9px] block">Consultor Comercial DSS</span>
            <span className="block mt-1">Quer simular lances ou tirar dúvidas agora pelo WhatsApp?</span>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href="https://api.whatsapp.com/send?phone=5511993551951&text=Ol%C3%A1%21%20Gostaria%20de%20conversar%20sobre%20as%20solu%C3%A7%C3%B5es%20de%20cons%C3%B3rcio%20da%20%2A%2ADSS%20Intermedia%C3%A7%C3%A3o%2A%22"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-emerald-500 hover:bg-emerald-600 text-white p-4.5 rounded-full shadow-2xl transition hover:scale-105 duration-200 cursor-pointer flex items-center justify-center relative group"
        title="Falar no WhatsApp Comercial"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          fill="currentColor" 
          viewBox="0 0 16 16"
          className="shrink-0 text-white"
        >
          <path d="M13.601 2.326A7.854 7.854 0 0 0 11.233.447 7.561 7.561 0 0 0 7.917 0a7.513 7.513 0 0 0-4.823 1.733 7.735 7.735 0 0 0-2.613 4.2c-.15.542-.18.998-.074 1.543l-.934 3.415a.502.502 0 0 0 .616.616l3.415-.934c.545.106 1.001.076 1.543-.074a7.674 7.674 0 0 0 4.2-2.613 7.514 7.514 0 0 0 1.733-4.823 7.564 7.564 0 0 0-.447-3.316 7.854 7.854 0 0 0-1.879-2.368zM7.92 14.1a6.381 6.381 0 0 1-3.256-.893l-.234-.14-2.42.662.662-2.42-.153-.255a6.388 6.388 0 0 1-.9-3.242c0-3.525 2.87-6.395 6.395-6.395 1.708 0 3.314.665 4.52 1.872a6.347 6.347 0 0 1 1.871 4.522c0 3.526-2.87 6.397-6.397 6.397zm3.125-4.298c-.171-.085-1.012-.5-1.168-.557-.156-.057-.27-.085-.384.086-.114.17-.44.556-.54.67-.1.112-.2.127-.37.042-.172-.085-.724-.266-1.378-.85-.509-.453-.853-1.013-.953-1.183-.1-.17-.01-.262.076-.347.077-.076.17-.198.256-.297.085-.1.113-.17.17-.283.056-.113.028-.212-.014-.297-.042-.085-.384-.928-.526-1.27-.138-.331-.277-.284-.384-.29-.1-.005-.213-.005-.327-.005-.114 0-.298.043-.454.213-.156.17-.597.583-.597 1.42 0 .837.609 1.643.694 1.756.085.114 1.198 1.83 2.903 2.564.405.175.722.28 1.002.369.418.132.8.113 1.102.068.337-.05 1.012-.414 1.155-.815.142-.4.142-.743.1-.814-.043-.07-.156-.113-.327-.198z"/>
        </svg>
        <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
      </a>
    </div>
  );
}

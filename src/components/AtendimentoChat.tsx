import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Phone, MessageSquare, ShieldCheck, Sparkles, AlertCircle, HelpCircle
} from 'lucide-react';
import { ChatMessage } from '../types';
import { GESTORES } from '../data';

const SUGGESTED_QUESTIONS = [
  "Como funciona o Plano Parcela Facilitada 70%?",
  "O consórcio realmente não tem juros?",
  "Como utilizar meu FGTS para dar lance?",
  "Qual a história da Ademicon e da DSS Intermediação?"
];

export default function AtendimentoChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Olá! Seja muito bem-vindo à DSS Intermediação, afiliada autorizada Ademicon.\n\nSou a especialista técnica virtual. Estou aqui para sanar suas dúvidas iniciais, detalhar os planos, as taxas de administração e como obter contemplações rápidas.\n\nQual modalidade de consórcio você tem interesse em simular hoje ou o que gostaria de entender?",
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      // Fetch assistant response from our API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          messages: [...messages, userMsg]
        })
      });

      if (!response.ok) {
        throw new Error("Erro de rede.");
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: "assistant",
        text: "Pedimos desculpas, tive uma oscilação temporária de conexão com nossa base de dados. Porém, a Ademicon possui 30 anos de excelência e a DSS atua há 14 anos trazendo segurança ao seu patrimônio.\n\nPara planejamentos complexos e lances assertivos, agende um horário imediato com nossos gestores licenciados: Denilson Santos (+55 11 99355-1951) ou Davison Santos (+55 11 98280-3557).",
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="atendimento-flow" className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      
      {/* Left Chat block */}
      <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-3xl h-[600px] overflow-hidden shadow-sm">
        
        {/* Chat Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md font-black shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-800 font-bold text-xs sm:text-sm">Assistente IA Especialista</span>
                <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider">Online</span>
              </div>
              <p className="text-[10px] text-slate-500 font-light">Especialista autorizada da DSS & Ademicon</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] text-slate-505 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Integridade BACEN</span>
          </div>
        </div>

        {/* Message Container Feed */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/30 select-text">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              {m.sender !== 'user' && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs shrink-0 select-none">
                  AI
                </div>
              )}
              
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-sm leading-relaxed whitespace-pre-line ${
                m.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
              }`}>
                {m.text}
                <span className={`block text-[9px] text-right mt-1.5 font-mono select-none ${m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>{m.timestamp}</span>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-700 font-extrabold text-xs shrink-0 select-none font-mono">
                  VC
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 justify-start animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-blue-105 text-blue-707 border border-blue-200 flex items-center justify-center text-xs shrink-0">
                ••
              </div>
              <div className="bg-white border border-slate-200 text-slate-500 text-xs rounded-2xl p-3.5 rounded-tl-none font-light italic">
                A IA está buscando as melhores opções de crédito e planejamento Ademicon...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Queries Tray */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2 select-none">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Dúvidas Frequentes (Toque para enviar)</span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[10px] sm:text-xs text-slate-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50/55 transition-colors cursor-pointer text-left font-light"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Form input field */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Digite sua dúvida sobre consórcios Ademicon..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-grow px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-all h-10"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center disabled:opacity-40 shrink-0 cursor-pointer shadow"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>

      {/* Right Referral block to humans */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Connection flow message card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">Etapa 2: Falar com os Diretores</h4>
          </div>

          <p className="text-slate-500 text-xs leading-relaxed font-light">
            Após obter as clarificações iniciais com nossa consultora virtual, o encaminhamento estratégico é direcionado para os Gestores Oficiais Autorizados da DSS Intermediação.
          </p>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Contato Humano Oficial:</span>

            {GESTORES.map((gestor) => (
              <div 
                key={gestor.id}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-blue-300 hover:bg-white transition-colors"
              >
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-800 text-xs">{gestor.name}</h5>
                  <p className="text-[10px] text-blue-700 font-mono font-bold">Gestor Oficial Ademicon</p>
                  <p className="text-[10px] text-slate-400">{gestor.phone}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <a
                    href={gestor.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer shadow flex items-center justify-center"
                    title="Enviar WhatsApp direto"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protection alert regulatory banner */}
        <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span>Atendimento Protegido LGPD</span>
          </div>
          <p className="text-slate-500 font-light leading-normal text-[11px]">
            Seus dados informados ou coletados em chat são armazenados de forma criptografada localmente. Jamais realizamos compartilhamentos indevidos com outras instituições comerciais.
          </p>
        </div>
      </div>
    </div>
  );
}

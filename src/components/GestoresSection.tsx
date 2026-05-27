import { CheckCircle2, MessageSquare, Phone, Mail, Award, ShieldAlert, BadgeCheck } from 'lucide-react';
import { GESTORES } from '../data';

export default function GestoresSection() {
  return (
    <div id="gestores-section" className="space-y-6 text-left">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center justify-center md:justify-start gap-2">
          <BadgeCheck className="w-6 h-6 text-blue-600" />
          <span>Gestores Autorizados Ademicon</span>
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm leading-normal max-w-2xl font-light">
          A DSS Intermediação opera sob rígido credenciamento oficial Ademicon (há 14 anos). Nossos consultores fornecem atendimento de ponta a ponta com segurança regulada completa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {GESTORES.map((g) => (
          <div 
            key={g.id}
            className="relative bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 hover:border-blue-200 hover:bg-slate-50/20 transition-all shadow-sm"
          >
            {/* Regulatory Badge */}
            <div className="absolute top-4 right-4 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-105 text-[10px] font-bold text-blue-700 flex items-center space-x-1 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Autorizado Ademicon</span>
            </div>

            {/* Profile Picture */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner shrink-0">
                <img 
                  src={g.avatarUrl} 
                  alt={g.name} 
                  className="w-full h-full object-cover filter contrast-105 select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Bio info */}
            <div className="flex-grow space-y-3">
              <div className="space-y-0.5 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-black text-slate-800">{g.name}</h3>
                <p className="text-blue-700 text-xs font-mono font-bold uppercase tracking-wider">{g.role}</p>
                <p className="text-[11px] text-slate-400 font-light">{g.experience}</p>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed font-light text-center sm:text-left">
                {g.description}
              </p>

              {/* Specialties removed */}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <a 
                  href={g.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white/10" />
                  <span>Chamar no WhatsApp</span>
                </a>
                <a 
                  href={`tel:${g.phone.replace(/\s+/g, '')}`}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-bold text-[11px] rounded-xl flex items-center justify-center space-x-1 transition-all cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Ligar</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust guarantees footer card */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
        <div className="flex items-center space-x-3.5 max-w-lg">
          <div className="p-3 bg-blue-100 border border-blue-200 rounded-xl text-blue-700 hidden sm:block">
            <Award className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-sm">Garantia Reguladora Ademicon</h4>
            <p className="text-slate-505 text-xs font-light">
              Toda a estruturação de grupos, sorteios, assembleias mensais e gestão de saldos são operados de forma centralizada e direta pela Ademicon, devidamente regulada pelo Banco Central do Brasil.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Certificação Oficial DSS 4118.</span>
        </div>
      </div>
    </div>
  );
}

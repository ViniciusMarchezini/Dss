import React, { useState } from 'react';
import { Bell, X, Info, Shield, Award, Sparkles } from 'lucide-react';
import { PushNotification } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data';

export default function PushNotificationSimulator() {
  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.isNew).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      {/* Floating Bell Indicator inside the header */}
      <button
        id="notification-bell"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAllAsRead();
        }}
        className="relative p-2.5 rounded-xl bg-blue-950/80 border border-blue-900/40 text-slate-300 hover:text-white hover:bg-blue-900/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer shrink-0"
        title="Oportunidades e Avisos DSS"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-black text-white ring-2 ring-[#05112c] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover tray */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#091535] border border-blue-900/50 p-4 shadow-2xl z-50 animate-fadeIn text-left text-white">
          <div className="flex items-center justify-between pb-3 border-b border-blue-950">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <h3 className="font-bold text-white text-sm">Painel de Oportunidades</h3>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead} 
                  className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                >
                  Ler todas
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 rounded bg-blue-950 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-950">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-450 text-xs">
                Nenhum aviso ou oportunidade recente.
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  className={`p-3 rounded-xl border transition-all ${n.isNew ? 'bg-blue-950/80 border-blue-500/30' : 'bg-blue-950/20 border-blue-950/45'} relative`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        {n.isNew && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-ping" />}
                        <span className={`text-[10px] font-bold ${n.category === 'opportunity' ? 'text-emerald-400' : n.category === 'alert' ? 'text-blue-300' : 'text-slate-350'}`}>
                          {n.category === 'opportunity' ? '◆ Oportunidade' : n.category === 'alert' ? '◆ Aviso' : '◆ Notícia'}
                        </span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <h4 className="font-semibold text-white text-xs mt-1 leading-snug">{n.title}</h4>
                      <p className="text-slate-400 text-[11px] mt-1 pr-4 leading-normal font-light">{n.body}</p>
                    </div>
                    <button 
                      onClick={(e) => removeNotification(n.id, e)}
                      className="text-slate-500 hover:text-red-400 p-0.5 cursor-pointer"
                      title="Remover"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-blue-950 flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>Conexão segura BACEN</span>
            </span>
            <span>DSS © 2026</span>
          </div>
        </div>
      )}
    </div>
  );
}

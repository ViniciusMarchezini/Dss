import React, { useState, useEffect } from "react";
import { 
  Lock, CheckCircle2, XCircle, Search, 
  Trash2, Mail, Phone, Calendar, Download, 
  RefreshCw, LogOut, ShieldAlert, Award, 
  LayoutDashboard, TrendingUp, Users, ExternalLink, Key
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: "imoveis" | "veiculos" | "servicos";
  creditSelected: number;
  termSelected: number;
  estimatedInstallmentFull: number;
  estimatedInstallmentReduced: number;
  useEmbeddedBid: boolean;
  date: string;
}

interface Candidate {
  id: string;
  name: string;
  phone: string;
  email: string;
  experience: string;
  message: string;
  date: string;
}

export default function AdminPanel() {
  // Authentication states
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  
  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"leads" | "candidates">("leads");

  // Dynamic values
  const ALLOWED_ADMINS = [
    "vinicius@dssproducoes.com.br", 
    "denilson@dssproducoes.com.br", 
    "deivison.santos.consultor@gmail.com",
    "viniciusmarchezini2021@gmail.com", 
    "marchezini.consultor@gmail.com",
    "marcehzini.consultor@gmail.com"
  ];

  // Try parsing session on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("dss_admin_email");
    if (savedEmail && ALLOWED_ADMINS.includes(savedEmail.toLowerCase().trim())) {
      setIsAdmin(true);
      setAdminEmail(savedEmail.toLowerCase().trim());
    }
  }, []);

  // Fetch data from server once premium active
  useEffect(() => {
    if (isAdmin && adminEmail) {
      fetchAdminData();
    }
  }, [isAdmin, adminEmail]);

  const fetchAdminData = async () => {
    setIsLoadingData(true);
    setFetchError("");
    try {
      const res = await fetch(`/api/leads?email=${encodeURIComponent(adminEmail)}`);
      if (!res.ok) {
        throw new Error("Não autorizado ou erro no servidor.");
      }
      const data = await res.json();
      setLeads(data.leads || []);
      setCandidates(data.candidates || []);
    } catch (err: any) {
      console.error(err);
      setFetchError("Falha ao recuperar dados dos leads da API central.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      setAuthError("Por favor informe seu e-mail.");
      return;
    }
    if (!passwordInput) {
      setAuthError("Por favor informe a senha.");
      return;
    }

    const emailClean = emailInput.toLowerCase().trim();
    setIsLoadingAuth(true);
    setAuthError("");

    try {
      const response = await fetch("/api/admin/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailClean, password: passwordInput })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authorized) {
          // Safe authenticated
          setIsAdmin(true);
          setAdminEmail(emailClean);
          localStorage.setItem("dss_admin_email", emailClean);
          setPasswordInput("");
        } else {
          setAuthError("Acesso Negado: E-mail não autorizado.");
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        setAuthError(errData.error || "Acesso Negado: E-mail ou senha incorretos.");
      }
    } catch (err) {
      console.error(err);
      setAuthError("Falha na comunicação de validação de autenticidade.");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminEmail("");
    localStorage.removeItem("dss_admin_email");
    setEmailInput("");
    setPasswordInput("");
    setAuthError("");
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm("CONFIRMAR EXCLUSÃO: Deseja realmente remover este lead permanentemente do servidor?")) {
      return;
    }
    try {
      const res = await fetch(`/api/leads/${id}?email=${encodeURIComponent(adminEmail)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== id));
      } else {
        alert("Não foi possível excluir o lead.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir.");
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    if (!window.confirm("CONFIRMAR EXCLUSÃO: Deseja realmente remover este interesse de contratação?")) {
      return;
    }
    try {
      const res = await fetch(`/api/candidates/${id}?email=${encodeURIComponent(adminEmail)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setCandidates(prev => prev.filter(c => c.id !== id));
      } else {
        alert("Não foi possível excluir candidato.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir.");
    }
  };

  // CSV Exporters
  const downloadLeadsCSV = () => {
    if (leads.length === 0) return;
    const headers = "ID,Data,Nome,Telefone,Email,Categoria,CreditoSelected,PrazoSelected,ParcelaCheia,ParcelaReduzida,LanceEmbutido\n";
    const rows = leads.map(l => 
      `"${l.id}","${l.date}","${l.name}","${l.phone}","${l.email}","${l.category}",${l.creditSelected},${l.termSelected},${l.estimatedInstallmentFull},${l.estimatedInstallmentReduced},${l.useEmbeddedBid}`
    ).join("\n");

    const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dss_leads_consorcio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCandidatesCSV = () => {
    if (candidates.length === 0) return;
    const headers = "ID,Data,Nome,Telefone,Email,Experiencia,Mensagem\n";
    const rows = candidates.map(c => 
      `"${c.id}","${c.date}","${c.name}","${c.phone}","${c.email}","${c.experience}","${c.message.replace(/"/g, '""')}"`
    ).join("\n");

    const blob = new Blob(["\uFEFF" + headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dss_candidatos_vagas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick Stats Calculations
  const totalLeadsCount = leads.length;
  const totalCandidatesCount = candidates.length;
  const totalImoveisLeads = leads.filter(l => l.category === "imoveis").length;
  const totalVeiculosLeads = leads.filter(l => l.category === "veiculos").length;
  const totalServicosLeads = leads.filter(l => l.category === "servicos").length;
  const totalVolumeCredito = leads.reduce((sum, current) => sum + current.creditSelected, 0);

  const formattedCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  };

  // Filtering leads on search
  const filteredLeads = leads.filter(l => {
    const q = searchTerm.toLowerCase();
    return (
      (l.name?.toLowerCase() || "").includes(q) ||
      (l.phone?.toLowerCase() || "").includes(q) ||
      (l.email?.toLowerCase() || "").includes(q) ||
      (l.category?.toLowerCase() || "").includes(q)
    );
  });

  const filteredCandidates = candidates.filter(c => {
    const q = searchTerm.toLowerCase();
    return (
      (c.name?.toLowerCase() || "").includes(q) ||
      (c.phone?.toLowerCase() || "").includes(q) ||
      (c.email?.toLowerCase() || "").includes(q) ||
      (c.experience?.toLowerCase() || "").includes(q) ||
      (c.message?.toLowerCase() || "").includes(q)
    );
  });

  // Render Login View if not auth
  if (!isAdmin) {
    return (
      <div className="bg-[#05112c]/05 border border-slate-200/60 rounded-3xl p-6 md:p-10 max-w-md mx-auto space-y-6 shadow-sm">
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 bg-blue-600/10 border border-blue-500/20 text-blue-600 flex items-center justify-center rounded-2xl">
            <Lock className="w-6 h-6 shrink-0" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Área Restrita</h2>
          <p className="text-slate-500 text-xs sm:text-sm font-light max-w-sm mx-auto">
            O Painel de Controle de Leads possui acesso criptografado exclusivo para gestores autorizados da <strong>DSS Intermediação</strong>.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">E-mail do Administrador:</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="exemplo@dssproducoes.com.br"
                className="w-full bg-white border border-slate-200 px-4 py-3 pl-10 rounded-xl font-mono text-sm placeholder:text-slate-400 text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Senha de Acesso:</label>
            <div className="relative">
              <Key className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 uppercase font-mono" />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white border border-slate-200 px-4 py-3 pl-10 rounded-xl text-sm placeholder:text-slate-400 text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200/80 p-3.5 rounded-xl flex items-start space-x-2.5 text-red-700 text-xs text-left animate-shake">
              <XCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoadingAuth}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md hover:bg-blue-700 transition cursor-pointer flex items-center justify-center space-x-2"
            >
              {isLoadingAuth ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span>Validando...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Entrar no Painel</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Dashboard Control Screen (Authorized)
  return (
    <div className="space-y-6 animate-fadeIn text-left">
      
      {/* Admin header layout with details */}
      <div className="bg-[#05112c] border border-blue-900/35 rounded-3xl p-5 md:p-6 text-white relative shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-blue-300">
            <Award className="w-5 h-5 text-blue-400 shrink-0/5" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#60a5fa] font-mono">Painel de Leads Centralizado</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white leading-tight">Gestão Comercial DSS Intermediação</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 font-light">
            <span className="font-mono bg-blue-950 border border-blue-900 px-2 py-0.5 rounded text-emerald-400 font-bold block">Administrador Autorizado</span>
            <span>◆ Logado como:</span>
            <strong className="text-white font-mono">{adminEmail}</strong>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={fetchAdminData}
            disabled={isLoadingData}
            className="px-3.5 py-2.5 bg-[#0d1f4d] border border-blue-900/60 hover:bg-[#152e72] rounded-xl text-xs font-bold text-slate-350 flex items-center space-x-1.5 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isLoadingData ? 'animate-spin text-blue-400' : ''}`} />
            <span>Atualizar</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 bg-red-650 hover:bg-red-750 text-white border border-red-900/20 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </div>

      {/* Metrics board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm space-y-2 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Leads de Consórcio</span>
            <span className="text-3xl font-black text-slate-800 font-mono block">{totalLeadsCount}</span>
            <span className="text-[10px] font-bold text-slate-500 block leading-none">Simulações de crédito</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <LayoutDashboard className="w-5 h-5 shrink-0" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm space-y-2 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Volume Projetado</span>
            <span className="text-xl md:text-2xl font-black text-blue-700 font-mono block truncate">{formattedCurrency(totalVolumeCredito)}</span>
            <span className="text-[10px] font-bold text-slate-500 block leading-none">Capital total pretendido</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-5 h-5 shrink-0" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm space-y-2 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Interesses de Carreira</span>
            <span className="text-3xl font-black text-slate-800 font-mono block">{totalCandidatesCount}</span>
            <span className="text-[10px] font-bold text-slate-500 block leading-none">Candidatos a vaga</span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Users className="w-5 h-5 shrink-0" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm text-xs grid grid-cols-3 gap-1.5">
          <div className="p-2 bg-slate-50 rounded-xl text-center">
            <span className="font-extrabold text-blue-800 block text-[11px] font-mono">{totalImoveisLeads}</span>
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter mt-1 block">Imóveis</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl text-center">
            <span className="font-extrabold text-indigo-800 block text-[11px] font-mono">{totalVeiculosLeads}</span>
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter mt-1 block">Veículos</span>
          </div>
          <div className="p-2 bg-slate-50 rounded-xl text-center">
            <span className="font-extrabold text-emerald-800 block text-[11px] font-mono">{totalServicosLeads}</span>
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-tighter mt-1 block">Serviços</span>
          </div>
        </div>

      </div>

      {/* Database control section with search and tables */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
        
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          <div className="flex bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl p-0.75 shadow-inner">
            <button
              onClick={() => setActiveSubTab("leads")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeSubTab === "leads" 
                  ? "bg-white text-slate-800 shadow-md font-black" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>Simulações de Consórcio ({leads.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab("candidates")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeSubTab === "candidates" 
                  ? "bg-white text-slate-800 shadow-md font-black" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>Candidatos ({candidates.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 self-center sm:self-auto w-full sm:w-auto">
            
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar leads..."
                className="w-full sm:w-60 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 pl-9 text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={activeSubTab === "leads" ? downloadLeadsCSV : downloadCandidatesCSV}
              disabled={activeSubTab === "leads" ? leads.length === 0 : candidates.length === 0}
              className="py-2.5 px-3 bg-slate-50 hover:bg-[#ebf3fe] border border-slate-250 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-700 transition flex items-center space-x-1 cursor-pointer shrink-0"
              title="Baixar planilha Excel/CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

          </div>

        </div>

        {/* Database output table */}
        {isLoadingData ? (
          <div className="py-20 text-center text-slate-500 space-y-3.5">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto shrink-0" />
            <p className="text-xs font-mono font-bold uppercase tracking-wider animate-pulse">Sincronizando Leads com o Servidor Central...</p>
          </div>
        ) : fetchError ? (
          <div className="p-6 text-center text-red-700 bg-red-50 border border-red-200/50 rounded-2xl space-y-3">
            <ShieldAlert className="w-10 h-10 mx-auto text-red-500 shrink-0 animate-bounce" />
            <h4 className="font-extrabold text-sm">{fetchError}</h4>
            <button
              onClick={fetchAdminData}
              className="py-2 px-4 rounded-xl text-xs font-bold bg-white border border-red-200 text-red-800 hover:bg-slate-50 transition"
            >
              Tentar Novamente
            </button>
          </div>
        ) : activeSubTab === "leads" ? (
          
          filteredLeads.length === 0 ? (
            <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto shrink-0 mb-2" />
              <p className="text-xs font-bold leading-normal">Nenhum lead de simulação encontrado.</p>
              <p className="text-[10px] text-slate-400 mt-1 font-light">As novas simulações de crédito preenchidas no portal aparecerão aqui instantaneamente.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-xs font-light text-left whitespace-nowrap border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Data</th>
                    <th className="py-3.5 px-4">Cliente</th>
                    <th className="py-3.5 px-4">Modo</th>
                    <th className="py-3.5 px-4">Crédito</th>
                    <th className="py-3.5 px-4">Prazo</th>
                    <th className="py-3.5 px-4">Parcela 70%</th>
                    <th className="py-3.5 px-4">Contato</th>
                    <th className="py-3.5 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/75 transition duration-150">
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{l.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col text-left">
                          <span className="font-extrabold text-slate-800">{l.name}</span>
                          <span className="font-mono text-[10px] text-slate-400 leading-normal">{l.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          l.category === "imoveis" 
                            ? "bg-blue-50 text-blue-700 border border-blue-100" 
                            : l.category === "veiculos" 
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}>
                          {l.category === "imoveis" ? "Imóvel" : l.category === "veiculos" ? "Veículo" : "Serviço"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{formattedCurrency(l.creditSelected)}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600">{l.termSelected} meses</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col text-left font-mono">
                          <span className="font-bold text-slate-700">{formattedCurrency(l.filteredInstallmentReduced || l.estimatedInstallmentReduced)}</span>
                          <span className="text-[9px] text-slate-400 leading-none">Facilitada</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600">
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{l.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center space-x-1.5">
                          <a
                            href={`https://api.whatsapp.com/send?phone=55${l.phone.replace(/\D/g, "")}&text=Ol%C3%A1%2C%20${encodeURIComponent(l.name)}.%20Aqui%20%C3%A9%20o%20consultor%20da%20%2A%2ADSS%20Intermedia%C3%A7%C3%A3o%2A%2A%20%28Ademicon%29.%20Acabo%20de%20receber%20sua%20simula%C3%A7%C3%A3o%20especializada%20de%20cons%C3%B3rcio%20de%20${l.category === 'imoveis' ? 'Im%C3%B3vel' : l.category === 'veiculos' ? 'Ve%C3%ADculo' : 'Servi%C3%A7or'}%20no%20valor%20de%20${encodeURIComponent(formattedCurrency(l.creditSelected))}%20em%20${l.termSelected}%20meses.%20Podemos%2520conversar%2520sobre%2520seu%2520planejamento%3F`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-50 border border-emerald-150 hover:bg-emerald-500 hover:text-white p-1.5 rounded-lg text-emerald-600 font-bold transition flex items-center justify-center"
                            title="Conversar via WhatsApp"
                          >
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1 inline-block">WhatsApp</span>
                          </a>
                          <button
                            onClick={() => handleDeleteLead(l.id)}
                            className="p-1.5 border border-red-100 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-lg transition"
                            title="Remover Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          
          filteredCandidates.length === 0 ? (
            <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto shrink-0 mb-2" />
              <p className="text-xs font-bold leading-normal">Nenhum candidato cadastrado.</p>
              <p className="text-[10px] text-slate-400 mt-1 font-light">Os dados de interessados em vagas no formulário "Trabalhe Conosco" serão registrados aqui.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-xs font-light text-left whitespace-nowrap border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Data</th>
                    <th className="py-3.5 px-4">Candidato</th>
                    <th className="py-3.5 px-4">Contato</th>
                    <th className="py-3.5 px-4">Experiência Comercial</th>
                    <th className="py-3.5 px-4">Breve Resumo</th>
                    <th className="py-3.5 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/75 transition duration-150">
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{c.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col text-left">
                          <span className="font-extrabold text-slate-800">{c.name}</span>
                          <span className="font-mono text-[10px] text-slate-400 leading-normal">{c.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 font-medium">
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{c.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.experience === "bastante" 
                            ? "bg-blue-50 text-blue-700 border border-blue-100" 
                            : c.experience === "pouca" 
                            ? "bg-slate-100 text-slate-600 border border-slate-205" 
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {c.experience === "bastante" ? "Com Experiência" : c.experience === "pouca" ? "Alguma Experiência" : "Sem Experiência"}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-sm truncate text-slate-500 font-light" title={c.message}>
                        {c.message || "Sem mensagem"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center space-x-1.5">
                          <a
                            href={`https://api.whatsapp.com/send?phone=55${c.phone.replace(/\D/g, "")}&text=Ol%C3%A1%2C%20${encodeURIComponent(c.name)}.%20Aqui%2520%C3%A9%2520a%2520%2A%2ADSS%2520Intermedia%C3%A7%C3%A3o%2A%2A.%20Recebi%2520sua%2520ficha%2520de%2520candidato%2520a%2520consultor%2520de%2520cons%C3%B3rcio%20Ademicon%20em%20nosso%20portal.%20Gostaria%2520de%2520conversar%25253F`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-50 border border-emerald-150 hover:bg-emerald-500 hover:text-white p-1.5 rounded-lg text-emerald-600 font-bold transition flex items-center justify-center text-[10px] uppercase font-bold tracking-wider"
                            title="Chamar com WhatsApp"
                          >
                            <span>WhatsApp</span>
                          </a>
                          <button
                            onClick={() => handleDeleteCandidate(c.id)}
                            className="p-1.5 border border-red-100 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 rounded-lg transition"
                            title="Remover Registro"
                          >
                            <Trash2 className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

      </div>

    </div>
  );
}

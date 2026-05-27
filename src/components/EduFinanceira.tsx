import { useState } from 'react';
import { Search, BookOpen, Clock, ChevronRight, TrendingUp, Home, Car, Award, Sparkles } from 'lucide-react';
import { EDUCATION_ARTICLES } from '../data';
import { Article } from '../types';

export default function EduFinanceira() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(EDUCATION_ARTICLES.map(a => a.category)))];

  const filteredArticles = EDUCATION_ARTICLES.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'Home': return <Home className="w-5 h-5 text-emerald-600" />;
      case 'Car': return <Car className="w-5 h-5 text-sky-600" />;
      default: return <Award className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div id="education-hub" className="py-2 text-left">
      {selectedArticle ? (
        // Detailed Article View
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 animate-fadeIn max-w-3xl mx-auto shadow-sm text-slate-800">
          <button 
            id="back-to-articles"
            onClick={() => setSelectedArticle(null)}
            className="flex items-center space-x-1.5 text-xs text-blue-650 hover:text-blue-800 transition-colors font-semibold cursor-pointer"
          >
            ← Voltar para a Central de Educação
          </button>
          
          <div className="space-y-3 pt-2">
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md bg-blue-50 text-blue-700 border border-blue-100">
              {selectedArticle.category}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-tight">
              {selectedArticle.title}
            </h1>
            <div className="flex items-center space-x-4 text-xs text-slate-450 font-mono">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedArticle.readTime}</span>
              </span>
              <span>•</span>
              <span>Por Equipe de Inteligência DSS</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed font-light">
            {selectedArticle.content.map((p, idx) => (
              <p key={idx} className="whitespace-pre-line">{p}</p>
            ))}
          </div>

          <div className="bg-blue-55/45 border border-blue-100 rounded-2xl p-4 sm:p-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-slate-800 text-sm">Ficou interessado nesta estratégia?</h4>
              <p className="text-slate-500 text-xs font-light">Simule agora o seu consórcio Ademicon com assessoria completa dos gestores da DSS.</p>
            </div>
            <button 
              onClick={() => {
                setSelectedArticle(null);
                // Trigger transition to simulator
                const simulatorTab = document.getElementById("tab-simulador");
                if (simulatorTab) {
                  simulatorTab.click();
                  const navItem = document.getElementById("nav-item-simulation");
                  if (navItem) navItem.click();
                }
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              Simular Agora
            </button>
          </div>
        </div>
      ) : (
        // Grid Directory View
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <span>Educação Financeira & Planejamento</span>
            </h2>
            <p className="text-slate-505 text-xs sm:text-sm text-center sm:text-left leading-normal font-light">
              Informações oficiais, estratégias de lances e dicas validadas para você conquistar seus objetivos com inteligência patrimonial.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-205 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 text-xs transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 text-white shadow-sm font-bold' 
                      : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600'
                  }`}
                >
                  {cat === 'all' ? 'Ver Todos' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Nenhum artigo encontrado para a palavra-chave informada.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredArticles.map((article) => (
                <div 
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="group bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow transition-all rounded-3xl p-5 cursor-pointer flex flex-col justify-between h-full"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-slate-50 group-hover:bg-blue-50 rounded-xl border border-slate-150 group-hover:border-blue-105 transition-all">
                        {getIcon(article.iconName)}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-blue-650 tracking-wider">
                        {article.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-slate-500 text-xs leading-normal font-light line-clamp-2">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-800">
                    <span>Ler Artigo Completo</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

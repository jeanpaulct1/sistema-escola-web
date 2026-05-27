'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfessorDashboard() {
  const router = useRouter();
  const [nomeProfessor, setNomeProfessor] = useState('Professora');

  // Mini-segurança: Só deixa ver o painel se tiver o token de login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSair = () => {
  // Cria uma janela de confirmação nativa do navegador
  const confirmar = window.confirm('Tem certeza que deseja sair do painel?');
  
  // Se a pessoa clicar em "OK", o código entra no IF e faz o logout
  if (confirmar) {
    localStorage.removeItem('token');
    router.push('/');
  }
};

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Barra Superior */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Olá, {nomeProfessor}! 👋
            </h1>
            <p className="text-slate-500 mt-1">Bem-vinda ao seu centro de gerenciamento.</p>
          </div>
          <button 
            onClick={handleSair}
            className="text-slate-400 hover:text-red-500 font-medium transition-colors text-sm"
          >
            Sair do Portal
          </button>
        </header>

        {/* Grid de Ações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* BOTÃO: LANÇAR NOVO MATERIAL */}
          <button 
            onClick={() => router.push('/professor/novo')}
            className="group relative bg-emerald-600 p-8 rounded-3xl text-left shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">
              ✨
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Novo Material
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Publique novos PDFs do Drive, vídeos do YouTube e atividades para suas turmas agora mesmo.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-white font-bold text-sm">
              Começar publicação <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>

          {/* BOTÃO: GERENCIAR MATERIAIS */}
          <button 
            onClick={() => router.push('/professor/lista')}
            className="group relative bg-white border border-slate-200 p-8 rounded-3xl text-left shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-6">
              📋
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Gerenciar Materiais
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Veja tudo o que já foi publicado, edite descrições ou apague conteúdos que não são mais necessários.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-blue-600 font-bold text-sm">
              Ver lista completa <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>

        </div>

        {/* Pequeno Resumo de Status (Opcional, mas dá um ar profissional) */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-200 pt-8">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total de Materiais</p>
            <p className="text-2xl font-bold text-slate-700">12</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Turmas Ativas</p>
            <p className="text-2xl font-bold text-slate-700">8</p>
          </div>
        </div>

      </div>
    </main>
  );
}
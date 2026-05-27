'use client'; // Avisa ao Next.js que este componente usa interatividade (React Hooks)
import { useRouter } from 'next/navigation';

import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  // Exemplo prático de Estado (State) no React para testar os cliques
  const [perfilSelecionado, setPerfilSelecionado] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      
      {/* Cabeçalho / Logo */}
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 mb-4 text-3xl">
          📚
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
          Portal Escolar
        </h1>
        <p className="mt-3 text-lg text-slate-600 max-w-md mx-auto">
          Selecione como você deseja acessar a plataforma hoje.
        </p>
      </div>

      {/* Grid com os Dois Grandes Botões de Caminho */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        
        {/* CARD DO ALUNO */}
        <button 
          onClick={() => router.push('/aluno')}
          className="group relative bg-white border border-slate-200 rounded-3xl p-8 text-left shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-500 group-hover:animate-pulse transition-colors">
              🎒
            </span>
            <span className="text-slate-400 group-hover:text-blue-500 transition-colors text-xl font-bold">
              →
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Sou Aluno
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Acesse imediatamente os materiais didáticos, vídeos e atividades organizados para a sua turma.
          </p>
        </button>

        {/* CARD DO PROFESSOR */}
        <button 
          onClick={() => router.push('/login')}
          className="group relative bg-white border border-slate-200 rounded-3xl p-8 text-left shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-500 group-hover:animate-pulse transition-colors">
              👩‍🏫
            </span>
            <span className="text-slate-400 group-hover:text-emerald-500 transition-colors text-xl font-bold">
              →
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Sou Professor
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Área restrita para gerenciamento de turmas, publicação de novos conteúdos e controle do painel escolar.
          </p>
        </button>

      </div>

      {/* Feedback Visual usando o Estado do React (Apenas para testes rápidos) */}
      {perfilSelecionado && (
        <div className="mt-8 p-4 bg-slate-800 text-slate-200 rounded-xl text-sm font-mono animate-fade-in">
          ℹ️ Você clicou em: <span className="text-yellow-400 font-bold">{perfilSelecionado.toUpperCase()}</span>. 
          {perfilSelecionado === 'aluno' 
            ? ' Próximo passo: Redirecionar para a lista de turmas.' 
            : ' Próximo passo: Abrir a tela de login.'}
        </div>
      )}

      {/* Rodapé sutil */}
      <footer className="mt-16 text-xs text-slate-400">
        Portal Escolar &copy; {new Date().getFullYear()}
      </footer>

    </main>
  );
}
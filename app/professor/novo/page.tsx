'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NovoMaterialPage() {
  const router = useRouter();
  
  // Estados para os campos do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [urlDrive, setUrlDrive] = useState('');
  const [urlYoutube, setUrlYoutube] = useState('');
  const [turmaId, setTurmaId] = useState('');
  
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  // Lista Mock de turmas (isso depois virá do seu Python)
  const [turmas, setTurmas] = useState<any[]>([]);

  // Proteção de rota
useEffect(() => {
  
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Busca as turmas reais no Python
    const buscarTurmas = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/turmas');
        if (res.ok) {
          const dados = await res.json();
          setTurmas(dados);
         
        }
      } catch (error) {
        console.error("Erro ao buscar turmas:", error);
      }
    };

    buscarTurmas();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ tipo: '', texto: '' });

    // Simulação de envio para a API
    try {
      // O fetch real que bate no Python
      const resposta = await fetch('http://localhost:8000/api/materiais', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: titulo,
          descricao: descricao,
          turma_id: turmaId, 
          url_drive: urlDrive || null, 
          url_youtube: urlYoutube || null
        }),
      });

      if (!resposta.ok) {
        throw new Error('Falha ao salvar no banco');
      }

      setMensagem({ tipo: 'sucesso', texto: 'Material publicado com sucesso! 🎉' });
      
      // Limpa e redireciona após 2 segundos
      setTimeout(() => router.push('/professor/lista'), 2000);
      
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Ops! Não foi possível comunicar com o servidor.' });
    } finally {
      setCarregando(false);
    }

  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        
        <button 
          onClick={() => router.push('/professor')}
          className="text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-2 text-sm font-medium mb-8"
        >
          ← Voltar para o Painel
        </button>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/60">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Lançar Novo Material</h1>
            <p className="text-slate-500 mt-2">Preencha os campos abaixo para disponibilizar o conteúdo aos alunos.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* TÍTULO */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Título do Material</label>
              <input 
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Aula 01 - Dias da semana em Espanhol"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
              />
            </div>

            {/* SELEÇÃO DE TURMA */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Para qual turma?</label>
              <select 
                required
                value={turmaId}
                onChange={(e) => setTurmaId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all bg-white"
              >
                <option value="">Selecione uma turma...</option>
                {turmas.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>

            {/* DESCRIÇÃO */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Descrição / Instruções</label>
              <textarea 
                rows={4}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Explique o que o aluno deve fazer com este material..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all resize-none"
              />
            </div>

            {/* LINKS (GRID 2 COLUNAS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 text-emerald-700">Link do Google Drive 📎</label>
                <input 
                  type="url"
                  value={urlDrive}
                  onChange={(e) => setUrlDrive(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-4 py-3 rounded-xl border border-emerald-100 bg-emerald-50/30 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 text-red-700">Link do YouTube 🎥</label>
                <input 
                  type="url"
                  value={urlYoutube}
                  onChange={(e) => setUrlYoutube(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 rounded-xl border border-red-100 bg-red-50/30 focus:border-red-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* ALERTAS */}
            {mensagem.texto && (
              <div className={`p-4 rounded-xl text-center font-medium animate-fade-in ${
                mensagem.tipo === 'sucesso' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {mensagem.texto}
              </div>
            )}

            {/* BOTÃO FINAL */}
            <button 
              type="submit"
              disabled={carregando}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {carregando ? 'Publicando...' : 'Publicar Material para os Alunos'}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}
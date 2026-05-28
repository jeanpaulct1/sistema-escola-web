'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Dicionário para traduzir o ID que vem do banco para o nome legível
const mapaTurmas: Record<string, string> = {
  '1': '1º Ano', '2': '2º Ano', '3': '3º Ano',
  '4': '4º Ano', '5': '5º Ano', '6': '6º Ano',
  '7': '7º Ano', '8': '8º Ano', '9': '9º Ano',
  '10': '1º Ano EM', '11': '2º Ano EM', '12': '3º Ano EM'
};


export default function ListaMateriaisPage() {
  const router = useRouter();
  const [listaTurmas, setListaTurmas] = useState<any[]>([]);

  const [materiais, setMateriais] = useState<any[]>([]);
  const [pesquisa, setPesquisa] = useState('');
  const [filtroTurma, setFiltroTurma] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Busca os dados da API assim que a tela carrega
  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Busca turmas e materiais simultaneamente
        const [resTurmas, resMateriais] = await Promise.all([
          fetch('https://sistema-escola-api-kfkl.onrender.com/api/turmas'),
          fetch('https://sistema-escola-api-kfkl.onrender.com/api/materiais')
        ]);
        
        if (resTurmas.ok) setListaTurmas(await resTurmas.json());
        if (resMateriais.ok) setMateriais(await resMateriais.json());
      } catch (error) {
        console.error("Erro ao carregar:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [router]);

  // Função para deletar chamando o Python
  const handleDeletar = async (id: number, titulo: string) => {
    const confirmar = window.confirm(`Tem a certeza que deseja apagar o material "${titulo}"?`);
    
    if (confirmar) {
      try {
        const res = await fetch(`https://sistema-escola-api-kfkl.onrender.com/api/materiais/${id}`, { 
          method: 'DELETE' 
        });
        
        if (res.ok) {
          // Remove da tela instantaneamente sem precisar dar F5
          setMateriais(materiais.filter(item => item.id !== id));
        } else {
          alert('Erro ao apagar no banco de dados.');
        }
      } catch (error) {
        alert('Erro de conexão ao tentar apagar.');
      }
    }
  };

  // Lógica de filtragem com os dados reais
  const materiaisFiltrados = materiais.filter((material) => {
    const textoBusca = pesquisa.toLowerCase();
    const titulo = material.titulo?.toLowerCase() || '';
    const descricao = material.descricao?.toLowerCase() || '';
    const bateTexto = titulo.includes(textoBusca) || descricao.includes(textoBusca);
    
    // Pega o nome da turma usando o dicionário
    const nomeTurma = mapaTurmas[material.turma_id] || '';
    const bateTurma = filtroTurma === '' || nomeTurma.includes(filtroTurma);
    
    return bateTexto && bateTurma;
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        <button 
          onClick={() => router.push('/professor')}
          className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-medium mb-8"
        >
          ← Voltar para o Painel
        </button>

        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Materiais Lançados</h1>
            <p className="text-slate-500 mt-1">Gerencie, filtre e remova os conteúdos disponíveis para os alunos.</p>
          </div>
          <button 
            onClick={() => router.push('/professor/novo')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm"
          >
            + Novo Material
          </button>
        </header>

        {/* BARRA DE FILTROS */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row gap-4 mb-6 shadow-sm">
          <div className="flex-1">
            <input 
              type="text"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Pesquisar por título ou descrição..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="w-full md:w-64">
            <select
              value={filtroTurma}
              onChange={(e) => setFiltroTurma(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all text-sm bg-white"
>
              <option value="">Todas as turmas</option>
               {listaTurmas.map((turma) => (
               <option key={turma.id} value={turma.nome}>
               {turma.nome}
             </option>
           ))}
            </select>
          </div>
        </div>

        {/* LISTAGEM DE MATERIAIS */}
        <div className="space-y-4">
          {carregando ? (
            <div className="text-center py-12 text-slate-400 font-medium animate-pulse">
              Carregando materiais do banco de dados...
            </div>
          ) : materiaisFiltrados.length > 0 ? (
            materiaisFiltrados.map((material) => (
              <div 
                key={material.id}
                className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                      {mapaTurmas[material.turma_id] || `Turma ${material.turma_id}`}
                    </span>
                    {/* Exibe o tipo de conteúdo com base nos links que o professor preencheu */}
                    {material.url_youtube && (
                      <span className="text-xs font-bold px-2.5 py-1 bg-red-50 text-red-600 rounded-md">Vídeo</span>
                    )}
                    {material.url_drive && (
                      <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md">Drive</span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mt-2">{material.titulo}</h2>
                  <p className="text-slate-500 text-sm line-clamp-2">{material.descricao}</p>
                </div>

                <div className="flex items-center gap-4 justify-end border-t md:border-t-0 pt-4 md:pt-0">
                  <button
                    onClick={() => handleDeletar(material.id, material.titulo)}
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Apagar material"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                      onClick={() => window.open(`/aluno/${material.turma_id}`)}
                      className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                   title="Visualizar material"
        > 
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-white">
              Nenhum material cadastrado ainda.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Interface que define o formato de uma Turma
interface Turma {
  id: number;
  nome: string;
  categoria: string;
  materiais: number;
}

export default function AlunoPage() {
  const router = useRouter();
  
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDadosDoAluno = async () => {
      try {
        const [resTurmas, resMateriais] = await Promise.all([
          fetch('http://localhost:8000/api/turmas'),
          fetch('http://localhost:8000/api/materiais')
        ]);

        if (resTurmas.ok && resMateriais.ok) {
          const dadosTurmas = await resTurmas.json();
          const dadosMateriais = await resMateriais.json();

          const turmasProcessadas: Turma[] = dadosTurmas.map((turma: any) => {
            const totalMateriais = dadosMateriais.filter(
              (material: any) => material.turma_id === turma.id
            ).length;

            let categoriaFormated = 'Outros';
            if (turma.nivel === 'EF1') categoriaFormated = 'Ensino Fundamental I';
            if (turma.nivel === 'EF2') categoriaFormated = 'Ensino Fundamental II';
            if (turma.nivel === 'EM') categoriaFormated = 'Ensino Médio';

            return {
              id: turma.id,
              nome: turma.nome,
              categoria: categoriaFormated,
              materiais: totalMateriais
            };
          });

          setTurmas(turmasProcessadas);
        }
      } catch (error) {
        console.error('Erro ao carregar o portal do aluno:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDadosDoAluno();
  }, []);

  // Agrupamento das turmas usando o tipo definido
  const turmasAgrupadas = turmas.reduce((acc: Record<string, Turma[]>, turma) => {
    if (!acc[turma.categoria]) acc[turma.categoria] = [];
    acc[turma.categoria].push(turma);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <button 
              onClick={() => router.push('/')}
              className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-medium mb-4"
            >
              ← Voltar para o início
            </button>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Selecione sua Turma
            </h1>
            <p className="text-slate-500 mt-1">
              Escolha seu ano para acessar os materiais disponíveis.
            </p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl text-2xl hidden md:block">
            🎒
          </div>
        </header>

        {carregando ? (
          <div className="text-center py-20 text-slate-400 font-medium animate-pulse">
            Organizando as salas de aula... 🏢
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(turmasAgrupadas).map(([categoria, listaDeTurmas]) => (
              <section key={categoria}>
                <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                  {categoria}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {listaDeTurmas.map((turma) => (
                    <button
                      key={turma.id}
                      onClick={() => router.push(`/aluno/${turma.id}`)}
                      className="flex flex-col text-left bg-white border border-slate-200 p-6 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all duration-200 group"
                    >
                      <span className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {turma.nome}
                      </span>
                      <span className="text-sm text-slate-400 mt-2 flex items-center gap-2">
                        {turma.materiais} {turma.materiais === 1 ? 'material' : 'materiais'}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
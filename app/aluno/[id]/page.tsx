'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TurmaMateriaisPage() {
  const router = useRouter();
  const params = useParams(); 
  const turmaId = params.id; 

  const [materiais, setMateriais] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  

  useEffect(() => {
    // Busca na API passando o ID da turma na URL (?turma_id=...)
    const buscarMateriaisDaTurma = async () => {
      try {
        const res = await fetch(`https://sistema-escola-api-kfkl.onrender.com/api/materiais?turma_id=${turmaId}`);
        if (res.ok) {
          const dados = await res.json();
          setMateriais(dados);
        }
      } catch (error) {
        console.error('Erro ao buscar os materiais:', error);
      } finally {
        setCarregando(false);
      }
    };

    if (turmaId) {
      buscarMateriaisDaTurma();
    }
  }, [turmaId]);

  // Função para formatar o link do YouTube para o modo "Embed" (caixinha de vídeo)
  const formatarLinkYoutube = (url: string) => {
    if (!url) return null;
    // Pega o ID do vídeo seja no formato youtu.be/ID ou youtube.com/watch?v=ID
    const videoId = url.includes('youtu.be/') 
      ? url.split('youtu.be/')[1].split('?')[0]
      : url.split('v=')[1]?.split('&')[0];
      
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-10">
          <button 
            onClick={() => router.push('/aluno')}
            className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-medium mb-6"
          >
            ← Voltar para as Turmas
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg">
              📚
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Materiais da Turma
              </h1>
              <p className="text-slate-500 mt-1">
                Acompanhe as aulas e baixe os arquivos de estudo.
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {carregando ? (
            <div className="text-center py-12 text-slate-400 font-medium animate-pulse">
              Procurando materiais na mochila... 🎒
            </div>
          ) : materiais.length > 0 ? (
            materiais.map((material) => (
              <article key={material.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                
                {/* Renderiza o vídeo apenas se o link do YouTube existir */}
                {material.url_youtube && (
                  <div className="w-full aspect-video bg-slate-900 relative">
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full"
                      src={formatarLinkYoutube(material.url_youtube) || ''} 
                      title={material.titulo}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                    <span>📅 Publicado recentemente</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-800 mb-3">
                    {material.titulo}
                  </h2>
                  
                  <p className="text-slate-600 leading-relaxed whitespace-pre-wrap mb-6">
                    {material.descricao}
                  </p>

                  {/* Renderiza o botão de Drive apenas se o link existir */}
                  {material.url_drive && (
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                      <a 
                        href={material.url_drive}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-5 rounded-xl transition-colors"
                      >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Baixar Arquivo no Drive
                      </a>
                    </div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-white">
              Nenhum material foi publicado para esta turma ainda.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
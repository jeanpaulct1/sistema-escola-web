'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário
    setCarregando(true);
    setErro('');

    try {
      // Aqui o React bate na porta do nosso backend em Python!
      const resposta = await fetch('https://sistema-escola-api-kfkl.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!resposta.ok) {
        throw new Error('E-mail ou senha incorretos.');
      }

      const dados = await resposta.json();

      // Confere se o banco de dados confirmou que é realmente a professora
      if (dados.usuario.papel === 'professor') {
        // Guarda o "crachá" (Token JWT) no navegador
        localStorage.setItem('token', dados.access_token);
        // Redireciona para o  painel de controle
        router.push('/professor');
        // router.push('/painel'); 
      } else {
        setErro('Acesso negado. Esta área é restrita para professores.');
      }
    } catch (error: any) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      
      {/* Botão de voltar */}
      <div className="w-full max-w-md mb-6">
        <button 
          onClick={() => router.push('/')}
          className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          ← Voltar para o início
        </button>
      </div>

      {/* Cartão de Login */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 w-full max-w-md shadow-xl shadow-slate-200/50">
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-emerald-100 text-emerald-600 rounded-2xl mb-4 text-2xl">
            👩‍🏫
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Área da Professora</h1>
          <p className="text-sm text-slate-500 mt-2">Insira suas credenciais para acessar o painel de materiais.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
              placeholder="exemplo@escola.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
            <input 
              type="password" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-700"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Mensagem de Erro Condicional */}
          {erro && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center animate-fade-in">
              {erro}
            </div>
          )}
         

          
          <button 
            type="submit" 
            disabled={carregando}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {carregando ? 'Validando...' : 'Entrar no Painel'}
          </button>
          
        </form>
      </div>
    </main>
  );
}
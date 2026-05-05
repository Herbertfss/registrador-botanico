import { useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PlantIdentifier } from './components/PlantIdentifier';

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('biowoma_token');
    if (saved) {
      setToken(saved);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('biowoma_token');
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-green-700">Biowoma</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Identificação inteligente de plantas
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Envie a imagem e receba um registro validado, salvo e auditável na plataforma.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-green-900 px-5 py-4 text-white shadow-soft">
              <p className="text-xs uppercase tracking-[0.35em] text-green-200">
                Fluxo de identificação
              </p>
              <p className="mt-2 text-sm leading-6 text-green-50">
                O backend valida a requisição, aplica regras de domínio e persiste no PostgreSQL.
              </p>
            </div>

            {token && (
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Sair da conta"
              >
                Sair
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ErrorBoundary fallbackMessage="Falha ao carregar o módulo de identificação.">
          <PlantIdentifier token={token} onAuthToken={setToken} />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;

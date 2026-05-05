import { useEffect, useState } from 'react';
import { Leaf, AlertCircle, LogOut } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PlantIdentifier } from './components/PlantIdentifier';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('registrador_botanico_token');
    const savedEmail = localStorage.getItem('registrador_botanico_user_email');
    if (savedToken) {
      setToken(savedToken);
      setUserEmail(savedEmail);
    }
  }, []);

  const handleAuth = (newToken: string, email: string) => {
    localStorage.setItem('registrador_botanico_token', newToken);
    localStorage.setItem('registrador_botanico_user_email', email);
    setToken(newToken);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('registrador_botanico_token');
    localStorage.removeItem('registrador_botanico_user_email');
    setToken(null);
    setUserEmail(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Registrador Botânico
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Identificação inteligente de plantas
                </p>
              </div>
            </div>
            {token ? (
              <div className="flex items-center gap-3 text-sm">
                <span className="hidden sm:inline text-slate-600">{userEmail}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 transition hover:bg-slate-200 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  Não autenticado
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <ErrorBoundary fallbackMessage="Falha ao carregar o módulo de identificação.">
          <PlantIdentifier token={token} onAuth={handleAuth} onLogout={handleLogout} />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;

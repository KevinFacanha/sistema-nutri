import React, { Suspense, lazy, useState } from 'react';
import { LoginNutricionista } from './components/LoginNutricionista';

const Dashboard = lazy(async () => {
  const module = await import('./components/Dashboard');
  return { default: module.Dashboard };
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasSupabaseEnv =
    Boolean(import.meta.env.VITE_SUPABASE_URL) &&
    Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!hasSupabaseEnv) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white border border-red-200 rounded-xl shadow-sm p-6">
          <h1 className="text-xl font-semibold text-red-700 mb-3">
            Configuração ausente do Supabase
          </h1>
          <p className="text-gray-700 mb-3">
            Crie um arquivo <code>.env</code> na raiz do projeto com:
          </p>
          <pre className="bg-gray-900 text-green-300 rounded-lg p-4 text-sm overflow-x-auto">
{`VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON`}
          </pre>
          <p className="text-gray-700 mt-3">
            Depois reinicie o servidor (<code>npm run dev</code>).
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginNutricionista onLogin={handleLogin} />;
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-700">
          Carregando dashboard...
        </div>
      }
    >
      <Dashboard onLogout={handleLogout} />
    </Suspense>
  );
}

export default App;

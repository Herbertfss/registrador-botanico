import { useState } from 'react';
import { createPlantIdentification, authenticate } from '../lib/api';
import { CreatePlantIdentificationRequest, PlantIdentification } from '../types';
import { SkeletonCard } from './SkeletonCard';

interface PlantIdentifierProps {
  token: string | null;
  onAuthToken: (token: string) => void;
}

export function PlantIdentifier({ token, onAuthToken }: PlantIdentifierProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlantIdentification | null>(null);
  const [authenticating, setAuthenticating] = useState(false);

  const hasValidToken = !!token;

  async function handleLogin() {
    setAuthenticating(true);
    setError(null);

    try {
      const authToken = await authenticate();
      localStorage.setItem('biowoma_token', authToken);
      onAuthToken(authToken);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAuthenticating(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    if (!token) {
      setError('É necessário autenticar antes de enviar.');
      setLoading(false);
      return;
    }

    const payload: CreatePlantIdentificationRequest = {
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
    };

    try {
      const saved = await createPlantIdentification(payload, token);
      setResult(saved);
      setName('');
      setDescription('');
      setImageUrl('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-labelledby="plant-identification-title"
      className="rounded-3xl bg-white p-8 shadow-soft"
    >
      {/* Header do componente */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-green-600">Workflow</p>
          <h2
            id="plant-identification-title"
            className="mt-2 text-2xl font-semibold text-slate-900"
          >
            Identificação de Planta
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Submeta um registro e a API criará um recurso persistido e auditado.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={authenticating}
          className="inline-flex items-center justify-center rounded-full bg-green-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {authenticating ? 'Autenticando...' : hasValidToken ? 'Token carregado' : 'Autenticar'}
        </button>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Nome da Planta</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex: Samambaia"
              aria-label="Nome da planta"
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder:text-slate-400"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">URL da Imagem</span>
            <input
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://..."
              aria-label="URL da imagem da planta"
              required
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder:text-slate-400"
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Descrição</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Folhas serrilhadas, caules finos..."
            aria-label="Descrição da planta"
            rows={4}
            required
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 placeholder:text-slate-400"
          />
        </label>

        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={loading || !hasValidToken}
            className="inline-flex items-center justify-center rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? 'Enviando...' : 'Salvar Identificação'}
          </button>

          <p className="text-xs text-slate-500">
            {hasValidToken
              ? 'Autenticado com token válido.'
              : 'É necessário autenticar antes de enviar.'}
          </p>
        </div>
      </form>

      {/* Resultado ou Skeleton */}
      {loading ? (
        <SkeletonCard />
      ) : result ? (
        <article className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Identificação salva</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">{result.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{result.description}</p>
          <p className="mt-4 text-sm text-slate-500">Identificado por: {result.identifiedBy}</p>
          <p className="mt-1 text-sm text-slate-500">
            Criado em: {new Date(result.createdAt).toLocaleString()}
          </p>
          <div className="mt-4 rounded-3xl overflow-hidden border border-slate-200">
            <img
              src={result.imageUrl}
              alt={`Imagem de ${result.name}`}
              className="h-72 w-full object-cover"
              loading="lazy"
            />
          </div>
        </article>
      ) : null}
    </section>
  );
}

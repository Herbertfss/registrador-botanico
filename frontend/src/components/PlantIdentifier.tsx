import { useState } from 'react';
import {
  KeyRound,
  CheckCircle,
  Send,
  Loader2,
  Image,
  FileText,
  User,
  Calendar,
} from 'lucide-react';
import { createPlantIdentification, authenticate } from '../lib/api';
import { CreatePlantIdentificationRequest, PlantIdentification } from '../types';
import { SkeletonCard } from './SkeletonCard';

interface PlantIdentifierProps {
  token: string | null;
  onAuth: (token: string, email: string) => void;
  onLogout: () => void;
}

export function PlantIdentifier({ token, onAuth }: PlantIdentifierProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlantIdentification | null>(null);
  const [authenticating, setAuthenticating] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  const isAuthenticated = !!token;

  async function handleLogin() {
    setAuthenticating(true);
    setError(null);
    try {
      const authToken = await authenticate();
      const email = 'admin@registradorbotanico.com';
      onAuth(authToken, email);
    } catch (err) {
      setError((err as Error).message);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 300);
    } finally {
      setAuthenticating(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthenticated) {
      setError('Você precisa autenticar antes de enviar.');
      setShakeError(true);
      setTimeout(() => setShakeError(false), 300);
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    const payload: CreatePlantIdentificationRequest = {
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
    };

    try {
      const saved = await createPlantIdentification(payload, token!);
      setResult(saved);
      setName('');
      setDescription('');
      setImageUrl('');
    } catch (err) {
      setError((err as Error).message);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 300);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Nova identificação</h2>
            <p className="text-sm text-slate-500">Preencha os dados da planta</p>
          </div>
          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              disabled={authenticating}
              className="rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {authenticating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
              {authenticating ? 'Autenticando...' : 'Autenticar para enviar'}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Autenticado
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nome da planta <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: Samambaia"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus:border-green-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                URL da imagem <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  placeholder="https://exemplo.com/planta.jpg"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 transition focus:border-green-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Descrição <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="Descreva características da planta..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 transition focus:border-green-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          {error && (
            <div
              className={`rounded-xl border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700 ${shakeError ? 'animate-shake' : ''}`}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isAuthenticated}
            className="w-full rounded-full bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:px-8 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            {loading ? 'Enviando...' : 'Salvar identificação'}
          </button>
        </form>
      </div>

      {loading && <SkeletonCard />}
      {result && (
        <div className="animate-fade-slide-up rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-800">{result.name}</h3>
              <p className="mt-1 text-sm text-slate-500 flex items-center gap-1">
                <User className="h-3 w-3" />
                Identificado por {result.identifiedBy}
              </p>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(result.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-3 text-slate-700">{result.description}</p>
          {result.imageUrl && (
            <div className="mt-4 overflow-hidden rounded-xl border">
              <img
                src={result.imageUrl}
                alt={result.name}
                className="max-h-80 w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

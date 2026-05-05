import { CreatePlantIdentificationRequest, PlantIdentification } from '../types';

const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

export async function authenticate(): Promise<string> {
  const response = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: 'admin@registradorbotanico.com', password: 'registradorbotanico123' }),
  });

  if (!response.ok) {
    throw new Error('Falha ao autenticar usuário.');
  }

  const data = await response.json();
  return data.token;
}

export async function createPlantIdentification(
  payload: CreatePlantIdentificationRequest,
  token: string
): Promise<PlantIdentification> {
  const response = await fetch(`${apiBase}/plant-identifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(errorPayload?.message ?? 'Erro ao salvar identificação de planta.');
  }

  return response.json();
}

import axios from "axios";

const api = axios.create({
  baseURL: 'https://word-api-hmlg.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDifficulties = async () => {
  const response = await api.get('/difficulties');
  return response.data;
};

export const createGameSession = async (difficultyId) => {
  const response = await api.get(`/difficulties/${difficultyId}`);
  return response.data;
};

export const checkWord = async (sessionId, word) => {
  try {
    const response = await api.post('/checkWord', {
      sessionId,
      word,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error('La palabra no es válida');
      } else if (error.response.status === 404) {
        throw new Error('Sesión no encontrada');
      }
    }
    throw new Error('Error al verificar la palabra');
  }
};
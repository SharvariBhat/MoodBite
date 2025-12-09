const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

export const auth = {
  register: (name, email, password) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

export const recipes = {
  generate: (mood, diet, time, difficulty, cuisine) =>
    apiCall('/recipes/generate', {
      method: 'POST',
      body: JSON.stringify({ mood, diet, time, difficulty, cuisine }),
    }),

  addFavorite: (recipe) =>
    apiCall('/recipes/favorite', {
      method: 'POST',
      body: JSON.stringify({ recipe }),
    }),

  getFavorites: () =>
    apiCall('/recipes/favorite', {
      method: 'GET',
    }),

  deleteFavorite: (id) =>
    apiCall(`/recipes/favorite/${id}`, {
      method: 'DELETE',
    }),

  getShoppingList: (recipes) =>
    apiCall('/recipes/shopping-list', {
      method: 'POST',
      body: JSON.stringify({ recipes }),
    }),
};

export const planner = {
  generateWeek: (mood, days, diet) =>
    apiCall('/planner/week', {
      method: 'POST',
      body: JSON.stringify({ mood, days, diet }),
    }),

  getMealPlans: () =>
    apiCall('/planner', {
      method: 'GET',
    }),
};

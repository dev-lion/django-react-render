const API_BASE = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${API_BASE}/tasks`;

export async function login(username, password) {
    const res = await fetch(`${API_URL}/token/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    });
    return await res.json();
}

export async function register({ username, email, password }) {
  try {
    const res = await fetch(`${API_URL}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error en el registro');
    }

    return data;
  } catch (error) {
    console.error('Registro fallido:', error.message);
    return null;
  }
}

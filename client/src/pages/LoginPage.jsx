import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { CustomButton } from '../components/CustomButton';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 🚀 Hook para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.access) {
      localStorage.setItem('access', result.access);
      localStorage.setItem('refresh', result.refresh);
      //onLogin(); // callback para redirigir o actualizar estado
      navigate('/tasks'); // 🔁 redirección al home de tareas
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-900 text-white">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            className="bg-zinc-700 p-3 rounded-lg block w-full mb-4"
            autoComplete="username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="bg-zinc-700 p-3 rounded-lg block w-full mb-4"
            autoComplete="current-password"
          />
          <CustomButton type="submit" className="w-full">
            Ingresar
          </CustomButton>
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { CustomButton } from '../components/CustomButton';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await register({ username, email, password });

    if (result && result.id) {
      // Registro exitoso, redirigir al login
      navigate('/login');
    } else {
      setError('No se pudo registrar el usuario');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-900 text-white">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            className="bg-zinc-700 p-3 rounded-lg block w-full mb-4"
            autoComplete="username"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            type="email"
            className="bg-zinc-700 p-3 rounded-lg block w-full mb-4"
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="bg-zinc-700 p-3 rounded-lg block w-full mb-4"
            autoComplete="new-password"
          />
          <CustomButton type="submit" className="w-full">
            Registrarse
          </CustomButton>
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}

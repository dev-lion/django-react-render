import { Link, useNavigate } from "react-router-dom"
export function Navigation() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('access');

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <div className="flex justify-between py-3">
      <Link to=''>
        <h1 className="font-bold text-3xl mb-4">Tareas App</h1>
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/register" className="hover:underline">Registro</Link>
        <Link to="/mp3Audio" className="hover:underline">FLAC</Link>
        {isAuthenticated && (
          <>
            <Link
              to="/tasks-create"
              className="bg-indigo-500 px-3 py-2 rounded-lg hover:bg-indigo-600"
            >
              Crear tarea
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
      

    </div>
  )
}
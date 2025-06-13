import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { TasksPage } from './pages/TasksPage'
import { TaskFormPage } from './pages/TaskFormPage'
import { Navigation } from './components/Navigation'
import { Toaster } from 'react-hot-toast'
import { NavbarDark } from './components/NavbarDark'
import { Mp3Page } from './pages/Mp3Page'
import LoginPage from './pages/LoginPage'
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <div className='container mx-auto'>
        
        <Navigation />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks-create" element={<TaskFormPage />} />
            <Route path="/tasks/:id" element={<TaskFormPage />} />
            <Route path="/mp3Audio" element={<Mp3Page />} />
          </Route>
          <Route path="/" element={< Navigate to='/tasks' />} />
          
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  )
}

export default App
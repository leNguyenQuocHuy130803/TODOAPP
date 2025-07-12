import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OurTasksPage from './pages/OurTasksPage';
import MyTasksPage from './pages/MyTasksPage';
import CreateTaskPage from './pages/CreateTaskPage';
import UpdateTaskPage from './pages/UpdateTaskPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import AuthContext from './context';
import type { User } from './types';
import ViewTaskPage from './pages/ViewTaskPage';
import 'bootstrap/dist/css/bootstrap.min.css'

export default function TasksManagementGuidelines() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    // Clear user from state and localStorage
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    // Optionally, redirect to login page or show a message
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="countainer mx-auto px-4 py-8">
        <h1>Tasks Management Guidelines</h1>
        {user && <p>Hi, {user?.email}</p>}

        <BrowserRouter>
          <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 mb-4">
            <div className="navbar-nav gap-2">

              <NavLink
                to="/login"
                className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold text-success' : ''}`}
              >
                Home
              </NavLink>

              <NavLink
                to="/tasks"
                className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold text-success' : ''}`}
              >
                Tasks
              </NavLink>

              <NavLink
                to="/assignee-me"
                className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold text-success' : ''}`}
              >
                My Tasks
              </NavLink>

              <NavLink
                to="/create-task"
                className={({ isActive }) => `nav-link ${isActive ? 'active fw-bold text-success' : ''}`}
              >
                Create Task
              </NavLink>

              {user && (
                <button onClick={handleLogout} className="btn btn-sm btn-outline-danger ms-3">
                  Logout
                </button>
              )}
            </div>
          </nav>
          <Routes>
            <Route index element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Private */}
            {user && <Route path="/tasks" element={<OurTasksPage />} />}

            {user && <Route path="/assignee-me" element={<MyTasksPage />} />}
            {user && <Route path="/create-task" element={<CreateTaskPage />} />}
            {user && <Route path="/update-task/:id" element={<UpdateTaskPage />} />}
            {user && <Route path="/view-task/:id" element={<ViewTaskPage />} />}

            <Route path="/*" element={<AccessDeniedPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

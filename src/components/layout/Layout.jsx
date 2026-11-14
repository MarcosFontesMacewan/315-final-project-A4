import { Outlet } from 'react-router-dom';
import NavBar from '../ui/NavBar';
import { useAuth } from '../../context/AuthContext';

export default function Layout({ librarian = false }) {

  const { user } = useAuth();
  // Business rule said that all pages needs a login
  const role = librarian ? 'librarian' : 'member';
  if (!user || user.role !== role) {
    return <Navigate to={librarian ? '/librarian' : '/'} replace />;
  }

  return (
    <div className="app-shell">
      <NavBar librarian={librarian} />
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
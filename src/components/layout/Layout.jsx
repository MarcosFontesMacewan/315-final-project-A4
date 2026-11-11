import { Outlet } from 'react-router-dom';
import NavBar from '../ui/NavBar';

export default function Layout({ librarian = false }) {
  return (
    <div className="app-shell">
      <NavBar librarian={librarian} />
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
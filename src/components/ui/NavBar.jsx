import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function NavBar({ librarian = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate(librarian ? '/librarian' : '/');
  }

  return (
    <header className="navbar">
      <nav className="nav-links">
        {librarian ? (
          <>
            <Link to="/librarian/home">Dashboard</Link>
            <Link to="/librarian/books">Books</Link>
            <Link to="/librarian/loans">Loans</Link>
            <Link to="/librarian/members">Members</Link>
          </>
        ) : (
          <>
            <Link to="/home">Home</Link>
            <Link to="/home/catalog">Catalog</Link>
            <Link to="/home/rentals">Rentals</Link>
          </>
        )}
      </nav>
      <button className="logout-btn" onClick={handleLogout}>Log Out</button>
    </header>
  );
}
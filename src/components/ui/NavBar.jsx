import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function NavBar({ librarian = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // phone menu

  function handleLogout() {
    logout();
    navigate(librarian ? '/librarian' : '/');
  }

  return (
    <header className="navbar">
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>Menu</button>
      <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'} onClick={() => setMenuOpen(false)}>
        {librarian ? (
          <>
            <Link to="/librarian/home">Dashboard</Link>
            <Link to="/librarian/books">Books</Link>
            <Link to="/librarian/loans">Loans and Returns</Link>
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
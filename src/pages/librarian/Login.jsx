import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { loginLibrarian } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const res = loginLibrarian(username, password);
    if (!res.ok) setError(res.error);
    navigate('/librarian/home');;
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Librarian Login</h1>
        {error && <p className="error">{error}</p>}
        <input type="username" placeholder="Username" value={username}
               onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Log In</button>
        <Link to="/member">Member login</Link>
      </form>
    </div>
  );
}
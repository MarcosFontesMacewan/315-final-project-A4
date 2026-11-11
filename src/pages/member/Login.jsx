import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { loginMember } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const res = loginMember(email, password);
    if (!res.ok) setError(res.error);
    else navigate('/home');
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Member Login</h1>
        {error && <p className="error">{error}</p>}
        <input type="email" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Log In</button>
        {/* TODO: add link to register, or a separate /register route */}
        <Link to="/librarian">Librarian login</Link>
      </form>
    </div>
  );
}
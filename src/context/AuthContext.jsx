import { createContext, useContext, useState } from 'react';

// Import initial user data
import { initialMembers, initialLibrarians } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { role: 'member'|'librarian', ...user }

  // Match login credentials present in the mock data (Members)
  function loginMember(email, password) {
    const m = initialMembers.find(
      (x) => x.email === email && x.password === password
    );
    if (!m) return { ok: false, error: 'Invalid credentials' };
    setUser({ role: 'member', ...m });
    return { ok: true };
  }

  function registerMember({ firstName, lastName, email, password }) {
    if (initialMembers.some((m) => m.email === email)) {
      return { ok: false, error: 'Email already registered' };
    }

    // No need to persist yet
    setUser({ role: 'member', id: 'M' + Date.now(), firstName, lastName, email,
              status: 'Active' });
    return { ok: true };
  }

  // Match login credentials present in mock data (Librarians)
  function loginLibrarian(username, password) {
    const l = initialLibrarians.find(
      (x) => x.username === username && x.password === password
    );
    if (!l) return { ok: false, error: 'Invalid credentials' };
    setUser({ role: 'librarian', ...l });
    return { ok: true };
  }

  function logout() { setUser(null); }

  return (
    <AuthContext.Provider value={{ user, loginMember, registerMember, loginLibrarian, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
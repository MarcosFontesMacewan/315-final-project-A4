import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

import MemberLogin from './pages/member/Login';
import MemberHome from './pages/member/Home';
import Catalog from './pages/member/Catalog';
import Rentals from './pages/member/Rentals';
import RenewalRequest from './pages/member/RenewalRequest';
import Fees from './pages/member/Fees';

import LibrarianLogin from './pages/librarian/Login';
import Dashboard from './pages/librarian/Dashboard';
import ManageBooks from './pages/librarian/ManageBooks';
import Loans from './pages/librarian/Loans';
import Members from './pages/librarian/Members';
import Suspensions from './pages/librarian/Suspensions';
import LoanRequests from './pages/librarian/LoanRequests';
import RenewalRequests from './pages/librarian/RenewalRequests.jsx';

export default function App() {
  return (
    <Routes>
      {/* Member side */}
      <Route path="/" element={<MemberLogin />} />
      <Route element={<Layout />}>
        <Route path="/home" element={<MemberHome />} />
        <Route path="/home/catalog" element={<Catalog />} />
        <Route path="/home/rentals" element={<Rentals />} />
        <Route path="/home/rentals/renewal-request" element={<RenewalRequest />} />
        <Route path="/home/rentals/fees" element={<Fees />} />
      </Route>

      {/* Librarian side */}
      <Route path="/librarian" element={<LibrarianLogin />} />
      <Route element={<Layout librarian />}>
        <Route path="/librarian/home" element={<Dashboard />} />
        <Route path="/librarian/books" element={<ManageBooks />} />
        <Route path="/librarian/loans" element={<Loans />} />
        <Route path="/librarian/members" element={<Members />} />
        <Route path="/librarian/members/loan-request" element={<LoanRequests />} />
        <Route path="/librarian/members/renewal-request" element={<RenewalRequests />} />
        <Route path="/librarian/suspensions" element={<Suspensions />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
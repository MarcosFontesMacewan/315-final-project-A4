import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { todayString, addDays } from '../../utils/dates';
import { bookForLoan, renewalBlockReason, renewalDaysError } from '../../utils/businessRules';
import FormField from '../../components/forms/FormField';
import '../../styles/forms.css';

export default function RenewalRequest() {
  const { user } = useAuth();
  const { members, books, copies, loans, requests, renewals, renewLoan } = useData();
  const navigate = useNavigate();
  const [loanId, setLoanId] = useState('');
  const [days, setDays] = useState('');
  const [error, setError] = useState('');

  const today = todayString();
  const data = { members, books, copies, loans, requests, renewals };
  const memberId = user?.id;
  const myLoans = loans.filter((l) => l.memberId === memberId && l.status === 'Active');
  const selected = myLoans.find((l) => l.id === loanId);

  const n = days.trim() === '' ? NaN : Number(days);
  const daysProblem = renewalDaysError(n); // null when OK
  const newDue = selected && !daysProblem ? addDays(selected.expectedReturnDate, n) : null;

  function handleSubmit(e) {
    e.preventDefault();
    const result = renewLoan(loanId, n);
    if (!result.ok) return setError(result.reason);
    const title = bookForLoan(selected, copies, books)?.title;

    // Renewal Request -> Rentals ("Submit Request")
    navigate('/home/rentals', { state: { notice: `Renewal requested for "${title}".` } });
  }

  if (!user) return <div className="form-page"><p>Please <Link to="/">log in</Link> first.</p></div>;

  return (
    <div className="form-page">
      <h1>Renewal Request</h1>
      <form className="form-card" onSubmit={handleSubmit}>
        <FormField label="Book to renew" error={error}>
          <select value={loanId} onChange={(e) => { setLoanId(e.target.value); setError(''); }}>
            <option value="">Pick a book</option>
            {myLoans.map((l) => {
              const why = renewalBlockReason(data, l.id, today);          // reason or null
              const title = bookForLoan(l, copies, books)?.title;
              return (
                <option key={l.id} value={l.id} disabled={Boolean(why)}>
                  {title} ({why ?? 'due ' + l.expectedReturnDate})
                </option>
              );
            })}
          </select>
        </FormField>

        <FormField label="Extra days (1 to 14)" error={days !== '' ? daysProblem : null}>
          <input type="number" min="1" max="14" value={days} onChange={(e) => setDays(e.target.value)} />
        </FormField>

        {selected && newDue && (
          <div className="form-summary">
            <p>Current due date: {selected.expectedReturnDate}</p>
            <p><strong>New due date, if approved: {newDue}</strong></p>
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={!selected || Boolean(daysProblem)}>
          Submit Request
        </button>
      </form>
    </div>
  );
}
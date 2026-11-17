import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { buildRenewalRows } from '../../utils/renewalRows';
import FilterChips from '../../components/ui/FilterChips';
import RenewalCard from './RenewalCard';
import '../../styles/librarian.css';

export default function RenewalRequests() {
  const { user } = useAuth();
  const {
    members,
    books,
    copies,
    loans,
    renewals,
    approveRenewal,
    denyRenewal,
  } = useData();

  const [status, setStatus] = useState('Pending');
  const [notice, setNotice] = useState(null);

  const rows = useMemo(
    () => buildRenewalRows({ members, books, copies, loans, renewals }),
    [members, books, copies, loans, renewals]
  );

  const shown = useMemo(() => {
    const filtered = status
      ? rows.filter((row) => row.status === status)
      : rows;

    return [...filtered].sort(
      (a, b) => new Date(a.requestedAt) - new Date(b.requestedAt)
    );
  }, [rows, status]);

  // One handler for both buttons
  function decide(row, isApprove) {
    const result = isApprove
      ? approveRenewal(row.id, user.id)
      : denyRenewal(row.id, user.id);

    if (!result.ok) {
      setNotice({ kind: 'error', text: result.reason });
      return;
    }

    if (isApprove) {
      const newDate = result.newDueDate || result.dueDate || row.newDueDate;
      setNotice({
        kind: 'ok',
        text: `Approved "${row.bookTitle}". New due date: ${newDate}.`,
      });
    } else {
      setNotice({
        kind: 'ok',
        text: `Denied the renewal for "${row.bookTitle}".`,
      });
    }
  }

  return (
    <div className="renewal-requests-page">
      <div className="page-header">
        <h1>Renewal Requests</h1>
        <Link to="/librarian/members" className="btn">
          Back to Members
        </Link>
      </div>

      {notice && (
        <div
          className={`notice notice-${notice.kind}`}
          role="status"
        >
          {notice.text}
        </div>
      )}

      <FilterChips
        label="Status"
        options={['Pending', 'Approved', 'Denied']}
        selected={status}
        onSelect={setStatus}
      />

      {shown.length === 0 ? (
        <p className="empty-state">No renewal requests here.</p>
      ) : (
        <div className="renewal-grid">
          {shown.map((row) => (
            <RenewalCard
              key={row.id}
              row={row}
              onApprove={() => decide(row, true)}
              onDeny={() => decide(row, false)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

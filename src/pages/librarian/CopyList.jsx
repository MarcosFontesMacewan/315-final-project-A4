import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';

export default function CopyList({ bookId }) {
  const { copies, addCopy, setCopyStatus } = useData();
  const [message, setMessage] = useState('');

  const mine = useMemo(
    () => copies.filter((c) => c.bookId === bookId),
    [copies, bookId]
  );

  function handleStatusChange(copyId, value) {
    const result = setCopyStatus(copyId, value);
    if (!result.ok) {
      setMessage(result.reason);
    } else {
      setMessage('');
    }
  }

  return (
    <div className="copy-list">
      {message && (
        <p className="notice notice-error" role="status">
          {message}
        </p>
      )}

      <ul>
        {mine.map((copy) => (
          <li key={copy.id} className="copy-row">
            <span>{copy.id}</span>
            {copy.status === 'OnLoan' ? (
              <span>On loan</span>
            ) : (
              <select
                value={copy.status}
                onChange={(e) => handleStatusChange(copy.id, e.target.value)}
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            )}
          </li>
        ))}
      </ul>

      <Button type="button" onClick={() => addCopy(bookId)}>
        Add copy
      </Button>
    </div>
  );
}

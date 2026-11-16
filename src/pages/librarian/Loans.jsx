import { useState } from 'react';
import { useData } from '../../context/DataContext';
import BookCard from '../../components/ui/BookCard';

export default function Loans() {
  const { loans, books, members, returnLoan } = useData();
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  const today = new Date();

  // 1. Filter for Active loans only
  let activeLoans = loans.filter((loan) => loan.status === 'Active');

  // 2. Apply Overdue filter if toggled
  if (showOverdueOnly) {
    activeLoans = activeLoans.filter(
      (loan) => new Date(loan.expectedReturnDate) < today
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Loans and Returns</h1>
        <button 
          className={`btn ${showOverdueOnly ? 'btn-primary' : ''}`}
          onClick={() => setShowOverdueOnly(!showOverdueOnly)}
        >
          {showOverdueOnly ? 'Showing Overdue Only' : 'Overdue'}
        </button>
      </div>

      {activeLoans.length === 0 ? (
        <p className="empty-state">No active loans found.</p>
      ) : (
        <div className="book-grid">
          {activeLoans.map((loan) => {
            const book = books.find((b) => b.id === loan.copyId?.split('00')[0] || b.id === loan.bookId);
            const member = members.find((m) => m.id === loan.memberId);
            const isOverdue = new Date(loan.expectedReturnDate) < today;

            return (
              <BookCard
                key={loan.id}
                book={book || { title: 'Unknown Book', author: 'N/A' }}
                footer={
                  <div className="loan-admin-details">
                    <p><strong>Loaned to:</strong> {member ? member.firstName : loan.memberId}</p>
                    <p className={isOverdue ? 'text-danger' : ''}>
                      <strong>Due:</strong> {loan.expectedReturnDate}
                    </p>
                    <button 
                      className="btn btn-primary" 
                      style={{ marginTop: '8px', width: '100%', fontSize: '0.8rem' }}
                      onClick={() => returnLoan(loan.id)}
                    >
                      Mark Returned
                    </button>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
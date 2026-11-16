import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import BookCard from '../../components/ui/BookCard';
import { Link } from 'react-router-dom';

export default function Rentals() {
  const { user } = useAuth();
  const { books, activeLoansForMember } = useData();

  // Get the active loans for the logged-in member
  const myLoans = user ? activeLoansForMember(user.id) : [];

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Rentals</h1>
        <Link to="/home/rentals/renewal-request" className="btn btn-primary">
          Request Renewal
        </Link>
      </div>

      <h2>Currently Borrowed</h2>
      
      {myLoans.length === 0 ? (
        <p className="empty-state">You have no books currently borrowed.</p>
      ) : (
        <div className="book-grid">
          {myLoans.map((loan) => {
            // Find the book details for this loan
            const book = books.find((b) => b.id === loan.bookId);
            // Fallback if the book data is missing for some reason
            if (!book) return null; 

            return (
              <BookCard
                key={loan.id}
                book={book}
                footer={
                  <div className="loan-details">
                    <span>Rented: {loan.loanDate}</span>
                    <span>Due: {loan.expectedReturnDate}</span>
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
import { useData } from '../../context/DataContext';
import BookCard from '../../components/ui/BookCard';

export default function LoanRequests() {
  const { requests, books, members, approveRequest, denyRequest } = useData();

  // Filter for Pending requests only
  const pendingRequests = requests.filter((r) => r.status === 'Pending');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Pending Loan Requests</h1>
      </div>

      {pendingRequests.length === 0 ? (
        <p className="empty-state">There are no pending loan requests.</p>
      ) : (
        <div className="book-grid">
          {pendingRequests.map((req) => {
            const book = books.find((b) => b.id === req.bookId);
            const member = members.find((m) => m.id === req.memberId);

            return (
              <BookCard
                key={req.id}
                book={book || { title: 'Unknown Book', author: 'N/A' }}
                footer={
                  <div className="request-admin-details">
                    <p><strong>Requested By:</strong> {member ? `${member.firstName} ${member.lastName}` : req.memberId}</p>
                    <p><strong>Date:</strong> {new Date(req.requestedAt).toLocaleDateString()}</p>
                    
                    <div className="request-actions">
                      <button 
                        className="btn btn-primary" 
                        onClick={() => approveRequest(req.id)}
                        style={{ flex: 1 }}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn" 
                        onClick={() => denyRequest(req.id)}
                        style={{ flex: 1, borderColor: '#b00020', color: '#b00020' }}
                      >
                        Deny
                      </button>
                    </div>
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
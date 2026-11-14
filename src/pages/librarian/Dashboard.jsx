import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>Librarian Administrator Dashboard</h1>
      
      <div className="dashboard-grid">
        {/* Square 1: View Rentals */}
        <div 
          className="dashboard-card" 
          onClick={() => navigate('/librarian/loans')}
        >
          <h2>View Rentals</h2>
        </div>

        {/* Square 2: Manage Members */}
        <div 
          className="dashboard-card" 
          onClick={() => navigate('/librarian/members')}
        >
          <h2>Manage Members</h2>
        </div>

        {/* Square 3: Manage Books */}
        <div 
          className="dashboard-card" 
          onClick={() => navigate('/librarian/books')}
        >
          <h2>Manage Books</h2>
        </div>
      </div>
    </div>
  );
}
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext'

export default function Members() {
  const navigate = useNavigate();
  const { members } = useData();

  return (
    <div className="page">
      {/* Top Header Area matching wireframe */}
      <div className="members-header">
        <h1>Member List</h1>
        
        <div className="action-buttons">
          <button className="btn" onClick={() => navigate('/librarian/loans')}>
            Loan Requests
          </button>
          <button className="btn" onClick={() => navigate('/librarian/loans')}>
            Renewal Requests
          </button>
          <button className="btn" onClick={() => navigate('/librarian/suspensions')}>
            View Suspensions
          </button>
        </div>
      </div>

      <hr className="divider" />

      {/* Member Grid */}
      <div className="members-grid">
        {members.map((member) => (
          <div key={member.id} className="member-card">
            {/* Default Image */}
            <img src="/person.png" alt="Member avatar" className="member-avatar" />
            
            {/* User Info */}
            <h3 className="member-name">{member.firstName} {member.lastName}</h3>
            <p className="member-id">ID: {member.id}</p>
            <p className={`member-status ${member.status.toLowerCase()}`}>
              Status: {member.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useData } from '../../context/DataContext';

export default function Suspensions() {
  const { members, unsuspendMember } = useData();

  // Filter to only show suspended users
  const suspendedMembers = members.filter((m) => m.status === 'Suspended');

  return (
    <div className="page">
      <h1>Lift Suspensions</h1>
      <hr className="divider" />

      {suspendedMembers.length === 0 ? (
        <p className="empty-state">There are no suspended members at this time.</p>
      ) : (
        <div className="suspensions-grid">
          {suspendedMembers.map((member) => (
            <div key={member.id} className="suspension-card">
              <img src="/person.png" alt="Member avatar" className="member-avatar" />
              <h3 className="member-name">{member.firstName} {member.lastName}</h3>
              <p className="member-id">ID: {member.id}</p>
              <p className="member-status suspended">Status: Suspended</p>
              
              <button 
                className="btn btn-primary" 
                onClick={() => unsuspendMember(member.id)}
                style={{ marginTop: '10px' }}
              >
                Lift Suspension
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
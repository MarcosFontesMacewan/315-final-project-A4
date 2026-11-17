import Button from '../../components/ui/Button';

export default function RenewalCard({ row, onApprove, onDeny }) {
  return (
    <article className="renewal-card">
      <img src="/person.png" alt="Member avatar" className="member-avatar" />
      <h3>{row.memberName}</h3>
      <p>Loaned: {row.bookTitle}</p>
      <p>Due by: {row.dueDate}</p>
      <p>Renew until: {row.newDate}</p>
      {row.status === 'Pending' ? (
        <div className="card-actions">
          <Button onClick={onApprove}>Approve</Button>
          <Button onClick={onDeny}>Deny</Button>
        </div>
      ) : (
        <p className={'status-label ' + row.status.toLowerCase()}>{row.status}</p>
      )}
    </article>
  );
}

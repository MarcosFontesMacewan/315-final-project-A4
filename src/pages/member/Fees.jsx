import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { todayString } from '../../utils/dates';
import { daysOverdue, feeOwed, formatMoney, bookForLoan } from '../../utils/businessRules';
import { validateCard } from '../../utils/validation';
import FormField from '../../components/forms/FormField';
import '../../styles/forms.css';

export default function Fees() {
  const { user } = useAuth();
  const { loans, copies, books, payFee } = useData();

  // Card data will live in this component only
  const [loanId, setLoanId] = useState('');
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const [receipt, setReceipt] = useState(null); // { title, amount } after a payment

  const today = todayString();
  const memberId = user?.id; // works for both with and without login guard
  const owing = loans.filter((l) => l.memberId === memberId && feeOwed(l, today) > 0);
  const selected = owing.find((l) => l.id === loanId); // undefined until a book is picked
  const amount = selected ? feeOwed(selected, today) : 0; // computed each render, not stored

  function setField(key, value) {
    setCard((prev) => ({ ...prev, [key]: value }));
  }

  function handlePay(e) {
    e.preventDefault();
    if (paying) return; // stops a double click
    const found = validateCard(card, loanId);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const title = bookForLoan(selected, copies, books)?.title;
    const paidAmount = amount;
    setPaying(true); // button will show as "Paying..."
    setTimeout(() => { // short fake delay so the user sees it happen aka. pretend we have actual backend for payment
      const result = payFee(loanId);
      setPaying(false);
      if (!result.ok) return setErrors({ loan: result.reason });
      setReceipt({ title, amount: paidAmount });
      setLoanId('');
      setCard({ name: '', number: '', expiry: '', cvc: '' }); // clear the card data
    }, 600);
  }

  if (!user) return <div className="form-page"><p>Please <Link to="/">log in</Link> first.</p></div>;

  return (
    <div className="form-page">
      <h1>Pay Overdue Fees</h1>
      <form className="form-card" onSubmit={handlePay}>
        <FormField label="Overdue book" error={errors.loan}>
          <select value={loanId} onChange={(e) => setLoanId(e.target.value)}>
            <option value="">Pick a book</option>
            {owing.map((l) => (
              <option key={l.id} value={l.id}>
                {bookForLoan(l, copies, books)?.title} ({daysOverdue(l, today)} days late, {formatMoney(feeOwed(l, today))})
              </option>
            ))}
          </select>
        </FormField>

        {selected && (
          <div className="form-summary">
            <p>Days overdue: {daysOverdue(selected, today)}</p>
            <p>$10 for the first day, then $1 for each extra day.</p>
            <p><strong>Amount owed: {formatMoney(amount)}</strong></p>
          </div>
        )}

        <FormField label="Name on card" error={errors.name}>
          <input value={card.name} onChange={(e) => setField('name', e.target.value)} />
        </FormField>
        <FormField label="Card number" error={errors.number}>
          <input value={card.number} inputMode="numeric" placeholder="1234 5678 9012 3456"
                 onChange={(e) => setField('number', e.target.value)} />
        </FormField>
        <div className="form-row">
          <FormField label="Expiry (MM/YY)" error={errors.expiry}>
            <input value={card.expiry} placeholder="08/28" onChange={(e) => setField('expiry', e.target.value)} />
          </FormField>
          <FormField label="Security code" error={errors.cvc}>
            <input value={card.cvc} inputMode="numeric" onChange={(e) => setField('cvc', e.target.value)} />
          </FormField>
        </div>

        <p className="form-note">Payment is simulated. Nothing is saved.</p>
        <button className="btn btn-primary" type="submit" disabled={!selected || paying}>
          {paying ? 'Paying...' : selected ? `Pay ${formatMoney(amount)}` : 'Pay Fee'}
        </button>
      </form>
    </div>
  );
}
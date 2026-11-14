// For validation purposes, returns an object like { number: 'Enter 16 digits.' }. An empty object means all good.
export function validateCard(form, loanId, now = new Date()) {
    const errors = {};
  
    if (!loanId) errors.loan = 'Pick a book.';
    if (form.name.trim() === '') errors.name = 'Enter the name on the card.';
    if (!/^\d{16}$/.test(form.number.replace(/\s/g, ''))) errors.number = 'Enter 16 digits.';
  
    // Expiry date will be MM/YY
    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(form.expiry.trim());
    if (!match) {
      errors.expiry = 'Use MM/YY.';
    } else {
      const month = Number(match[1]);
      const year = 2000 + Number(match[2]);
      const thisYear = now.getFullYear();
      const thisMonth = now.getMonth() + 1;
      if (year < thisYear || (year === thisYear && month < thisMonth)) {
        errors.expiry = 'This card has expired.';
      }
    }
  
    if (!/^\d{3,4}$/.test(form.cvc.trim())) errors.cvc = 'Enter 3 or 4 digits.';
    return errors;
  }
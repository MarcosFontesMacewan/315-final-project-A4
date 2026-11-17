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

export function validateBook(form, books, editingId, mode) {
  const errors = {};

  const digits = form.isbn.replace(/[\s-]/g, '');
  if (!/^\d{9}[\dX]$|^\d{13}$/.test(digits)) {
    errors.isbn = 'Enter 10 or 13 digits.';
  } else if (books.some((book) => book.isbn.replace(/[\s-]/g, '') === digits && book.id !== editingId)) {
    errors.isbn = 'This ISBN is already in the catalog.';
  }

  for (const field of ['title', 'author', 'genre', 'language']) {
    if (form[field].trim() === '') errors[field] = 'Required.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.publishDate.trim())) {
    errors.publishDate = 'Use YYYY-MM-DD.';
  } else if (addDays(form.publishDate.trim(), 0) !== form.publishDate.trim()) {
    errors.publishDate = 'Not a real date.';
  }

  if (mode === 'add') {
    const copies = Number(form.copies);
    if (!Number.isInteger(copies) || copies < 1 || copies > 10) {
      errors.copies = 'Enter 1 to 10.';
    }
  }

  return errors;
}

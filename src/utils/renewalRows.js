import { bookForLoan } from './businessRules.js';

// As its name suggested, it builds rows
export function buildRenewalRows(data) {
  const { members = [], books = [], copies = [], loans = [], renewals = [] } = data;
  const rows = [];

  for (const renewal of renewals) {
    const loan = loans.find((l) => l.id === renewal.loanId);
    if (!loan) continue;

    const member = members.find((m) => m.id === loan.memberId);
    if (!member) continue;

    const book = bookForLoan(loan, copies, books);

    rows.push({
      id: renewal.id,
      status: renewal.status,
      requestedAt: renewal.requestedAt,
      memberName: `${member.firstName} ${member.lastName}`,
      bookTitle: book?.title ?? 'Removed book',
      dueDate: loan.expectedReturnDate,
      newDate: renewal.newReturnDate,
    });
  }

  return rows;
}

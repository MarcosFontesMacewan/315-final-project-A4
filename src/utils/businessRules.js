import { daysBetween } from './dates.js';

export const RULES = {
  MAX_ACTIVE_LOANS: 5,
  LOAN_DAYS: 21,
  NEW_RELEASE_LOAN_DAYS: 7,
  NEW_RELEASE_WINDOW_DAYS: 30,
  RENEW_MAX_DAYS: 14,
  SUSPEND_AFTER_DAYS: 30,
  FEE_FIRST_DAY: 10, // in whole dollars
  FEE_PER_EXTRA_DAY: 1,
};

export function isNewRelease(book, onDate) {
  const age = daysBetween(book.publishDate, onDate);
  return age >= 0 && age <= RULES.NEW_RELEASE_WINDOW_DAYS;
}

export function loanDaysFor(book, onDate) {
  return isNewRelease(book, onDate) ? RULES.NEW_RELEASE_LOAN_DAYS : RULES.LOAN_DAYS;
}

// Reurns the number of days that the member has missed from the due date
export function daysOverdue(loan, today) {
  const end = loan.actualReturnDate ?? today;
  return Math.max(0, daysBetween(loan.expectedReturnDate, end));
}

// Day 1 = $10, then +$1 for each extra day
export function lateFee(days) {
  if (days <= 0) return 0;
  return RULES.FEE_FIRST_DAY + (days - 1) * RULES.FEE_PER_EXTRA_DAY;
}

// What the member owes now
export function feeOwed(loan, today) {
  if (loan.feeStatus === 'Paid') return 0;
  return lateFee(daysOverdue(loan, today));
}

export function formatMoney(dollars) {
  return '$' + dollars.toFixed(2);
}

// loan -> copy -> book
export function bookForLoan(loan, copies, books) {
  const copy = copies.find((c) => c.id === loan.copyId);
  return copy ? books.find((b) => b.id === copy.bookId) : undefined;
}

// Pending requests for one book, oldest first
export function queueFor(bookId, requests) {
  return requests
    .filter((r) => r.bookId === bookId && r.status === 'Pending')
    .sort((a, b) => a.requestedAt.localeCompare(b.requestedAt));
}

export function queuePosition(request, requests) {
  return queueFor(request.bookId, requests).findIndex((r) => r.id === request.id) + 1;
}

// "data" = { members, books, copies, loans, requests, renewals }

export function borrowBlockReason(data, memberId, bookId, today) {
  const member = data.members.find((m) => m.id === memberId);

  if (!member) return 'Please log in first.';

  if (member.status === 'Suspended') return 'Your account is suspended.';
  const mine = data.loans.filter((l) => l.memberId === memberId);

  if (mine.filter((l) => l.status === 'Active').length >= RULES.MAX_ACTIVE_LOANS)
    return 'You already have 5 books on loan.';

  if (mine.some((l) => feeOwed(l, today) > 0)) return 'Pay your late fees before you borrow.';
  if (data.requests.some((r) => r.memberId === memberId && r.bookId === bookId && r.status === 'Pending'))
    return 'You already requested this book.';

  const hasIt = mine.some((l) => l.status === 'Active' && bookForLoan(l, data.copies, data.books)?.id === bookId);
  if (hasIt) return 'You already borrowed this book.';

  return null;
}

export function renewalBlockReason(data, loanId, today) {
  const loan = data.loans.find((l) => l.id === loanId);
  if (!loan || loan.status !== 'Active') return 'This loan is not active.';

  const member = data.members.find((m) => m.id === loan.memberId);

  if (member?.status === 'Suspended') return 'Your account is suspended.';
  if (loan.renewCount >= 1) return 'Already renewed once.';
  if (daysOverdue(loan, today) > 0) return 'Overdue loans cannot be renewed.';
  if (data.renewals.some((r) => r.loanId === loan.id && r.status === 'Pending'))
    return 'Renewal already requested.';

  const book = bookForLoan(loan, data.copies, data.books);

  if (book && data.requests.some((r) => r.bookId === book.id && r.status === 'Pending' && r.memberId !== loan.memberId))
    return 'Another member is waiting for this book.';

  return null;
}

export function renewalDaysError(extraDays) {
  if (!Number.isInteger(extraDays) || extraDays < 1 || extraDays > RULES.RENEW_MAX_DAYS)
    return 'Enter a whole number from 1 to 14.';
  return null;
}

// For active loan that is more than 30 days late
export function shouldSuspend(loan, today) {
  return loan.status === 'Active' && daysOverdue(loan, today) > RULES.SUSPEND_AFTER_DAYS;
}
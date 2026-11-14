import { createContext, useContext, useState } from 'react';
import { todayString, addDays } from '../utils/dates';
import { nextId } from '../utils/ids';
import {
  feeOwed, loanDaysFor, borrowBlockReason, renewalBlockReason, renewalDaysError, shouldSuspend,
} from '../utils/businessRules';
import {
  initialMembers, initialBooks, initialCopies, initialLoans,
  initialRequests, initialRenewalRequests,
} from '../data/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [members, setMembers] = useState(initialMembers);
  const [books, setBooks] = useState(initialBooks);
  const [copies, setCopies] = useState(initialCopies);
  const [loans, setLoans] = useState(initialLoans);
  const [requests, setRequests] = useState(initialRequests);
  const [renewals, setRenewals] = useState(initialRenewalRequests);

  // All lists in one object. The rule functions in utils/rules.js take this.
  const data = { members, books, copies, loans, requests, renewals };
  const nowText = () => new Date().toISOString().slice(0, 19);

  // --- Derived helpers
  function availableCopies(bookId) {
    return copies.filter((c) => c.bookId === bookId && c.status === 'Available');
  }

  function activeLoansForMember(memberId) {
    return loans.filter((l) => l.memberId === memberId && l.status === 'Active');
  }

  function hasUnpaidFees(memberId) {
    return loans.some((l) => l.memberId === memberId && feeOwed(l, todayString()) > 0);
  }

  function canBorrow(memberId) {
    // Business rules, extend with suspension check against members list
    return activeLoansForMember(memberId).length < 5 && !hasUnpaidFees(memberId);
  }

  // --- Actions 
  function borrowBook(memberId, bookId) {
    const reason = borrowBlockReason(data, memberId, bookId, todayString());

    if (reason) return { ok: false, reason };

    // The request is set to Pending
    setRequests((prev) => [...prev, {
      id: nextId('R', prev), memberId, bookId, requestedAt: nowText(),
      status: 'Pending', decidedBy: null, decidedAt: null,
    }]);

    return { ok: true };
  }

  function renewLoan(loanId, extraDays) {
    const reason = renewalBlockReason(data, loanId, todayString()) || renewalDaysError(extraDays);

    if (reason) return { ok: false, reason };

    const loan = loans.find((l) => l.id === loanId);

    // A renewal is a request and will not change the loan until the librarian approves
    setRenewals((prev) => [...prev, {
      id: nextId('RN', prev), loanId, requestedAt: nowText(),
      status: 'Pending', decidedBy: null, decidedAt: null,
      newReturnDate: addDays(loan.expectedReturnDate, extraDays),
    }]);

    return { ok: true };
  }

  function payFee(loanId) {
    const loan = loans.find((l) => l.id === loanId);

    if (!loan) return { ok: false, reason: 'Loan not found.' };

    const today = todayString();
    const amount = feeOwed(loan, today);

    if (amount === 0) return { ok: false, reason: 'Nothing to pay on this loan.' };

    // Freeze the amount since it is paid
    setLoans((prev) => prev.map((l) => (l.id === loanId
      ? { ...l, feeStatus: 'Paid', lateFee: amount, feePaidDate: today } : l)));

    return { ok: true, amount };
  }

  function addMember(member) { setMembers((prev) => [...prev, member]); }

  function suspendMember(memberId) {
    setMembers((prev) => prev.map((m) => (m.id === memberId
      ? { ...m, status: 'Suspended', suspendedAt: todayString() } : m)));
    return { ok: true };
  }

  function unsuspendMember(memberId) {
    const today = todayString();
    const owed = loans.filter((l) => l.memberId === memberId).reduce((sum, l) => sum + feeOwed(l, today), 0);

    if (owed > 0) return { ok: false, reason: 'Unpaid fee: $' + owed + '.00' };

    if (loans.some((l) => l.memberId === memberId && shouldSuspend(l, today)))
      return { ok: false, reason: 'A book is more than 30 days late.' };
    setMembers((prev) => prev.map((m) => (m.id === memberId
      ? { ...m, status: 'Active', suspendedAt: null } : m)));

    return { ok: true };
  }

  function addBook(book) { setBooks((prev) => [...prev, book]); }
  function removeBook(bookId) {
    // A book with a copy OnLoan cannot be removed per business rule
    if (copies.some((c) => c.bookId === bookId && c.status === 'OnLoan'))
      return { ok: false, reason: 'A copy is on loan.' };

    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    setCopies((prev) => prev.filter((c) => c.bookId !== bookId));

    return { ok: true };
  }

  function approveRequest(requestId, librarianId = 'L001') {
    const req = requests.find((r) => r.id === requestId);
    if (!req || req.status !== 'Pending') return { ok: false, reason: 'Request is not pending.' };

    const copy = availableCopies(req.bookId)[0];

    if (!copy) return { ok: false, reason: 'No copy is free yet.' };

    const book = books.find((b) => b.id === req.bookId);
    const today = todayString();

    setLoans((prev) => [...prev, {
      id: nextId('LN', prev), memberId: req.memberId, copyId: copy.id, requestId: req.id,
      loanDate: today, expectedReturnDate: addDays(today, loanDaysFor(book, today)),
      actualReturnDate: null, renewCount: 0, lateFee: 0, feeStatus: 'None',
      feePaidDate: null, status: 'Active',
    }]);

    setCopies((prev) => prev.map((c) => (c.id === copy.id ? { ...c, status: 'OnLoan' } : c)));

    setRequests((prev) => prev.map((r) => (r.id === req.id
      ? { ...r, status: 'Approved', decidedBy: librarianId, decidedAt: nowText() } : r)));

    return { ok: true };
  }

  function denyRequest(requestId) { /* TODO */ }
  function returnLoan(loanId) {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan || loan.status !== 'Active') return { ok: false, reason: 'Loan is not active.' };

    const today = todayString();
    const returned = { ...loan, actualReturnDate: today, status: 'Returned' };

    const fee = feeOwed(returned, today); // 0 if on time or already paid

    setLoans((prev) => prev.map((l) => (l.id === loanId
      ? { ...returned, ...(fee > 0 ? { feeStatus: 'Unpaid', lateFee: fee } : {}) } : l)));
    setCopies((prev) => prev.map((c) => (c.id === loan.copyId ? { ...c, status: 'Available' } : c)));

    return { ok: true };
  }

  const value = {
    members, books, copies, loans, requests, renewals,
    availableCopies, activeLoansForMember, hasUnpaidFees, canBorrow,
    borrowBook, renewLoan, payFee, suspendMember, unsuspendMember,
    addMember, addBook, removeBook,
    approveRequest, denyRequest, returnLoan,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() { return useContext(DataContext); }
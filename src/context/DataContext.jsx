import { createContext, useContext, useState } from 'react';
import {
  initialBooks, initialCopies, initialLoans,
  initialRequests, initialRenewalRequests,
} from '../data/mockData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [books, setBooks] = useState(initialBooks);
  const [copies, setCopies] = useState(initialCopies);
  const [loans, setLoans] = useState(initialLoans);
  const [requests, setRequests] = useState(initialRequests);
  const [renewals, setRenewals] = useState(initialRenewalRequests);

  // --- Derived helpers
  function availableCopies(bookId) {
    return copies.filter((c) => c.bookId === bookId && c.status === 'Available');
  }

  function activeLoansForMember(memberId) {
    return loans.filter((l) => l.memberId === memberId && l.status === 'Active');
  }

  function hasUnpaidFees(memberId) {
    return loans.some((l) => l.memberId === memberId && l.feeStatus === 'Unpaid');
  }

  function canBorrow(memberId) {
    // Business rules, extend with suspension check against members list
    return activeLoansForMember(memberId).length < 5 && !hasUnpaidFees(memberId);
  }

  // --- Actions 
  function borrowBook(memberId, bookId) {
    // TODO: check canBorrow, check availability, push a pending request
  }

  function renewLoan(loanId, extraDays) {
    // TODO: check renewCount < 1, not overdue, no pending request for book
  }

  function payFee(loanId) {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, feeStatus: 'Paid' } : l))
    );
  }

  function suspendMember(memberId) { /* TODO */ }
  function unsuspendMember(memberId) { /* TODO */ }

  function addBook(book) { setBooks((prev) => [...prev, book]); }
  function removeBook(bookId) {
    // TODO: reject if any copy of this book is OnLoan
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  }

  function approveRequest(requestId) { /* TODO */ }
  function denyRequest(requestId) { /* TODO */ }
  function returnLoan(loanId) { /* TODO: compute late fee */ }

  const value = {
    books, copies, loans, requests, renewals,
    availableCopies, activeLoansForMember, hasUnpaidFees, canBorrow,
    borrowBook, renewLoan, payFee, suspendMember, unsuspendMember,
    addBook, removeBook, approveRequest, denyRequest, returnLoan,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() { return useContext(DataContext); }
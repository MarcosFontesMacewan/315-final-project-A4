// Mock Library Members

export const initialMembers = [
  { id: 'M001', firstName: 'Jane', lastName: 'Doe', email: 'doe123@example.com',
    password: 'password', status: 'Active', suspendedAt: null, joinDate: '2026-10-31' },
  { id: 'M002', firstName: 'Sam', lastName: 'Smith', email: 'sam@example.com',
    password: 'password', status: 'Suspended', suspendedAt: '2026-11-01', joinDate: '2026-09-01' },
];

// Mock Librarians + Logins

export const initialLibrarians = [
  { id: 'L001', username: 'jdoe', password: 'admin', firstName: 'John', lastName: 'Doe' },
];

// Mock Books

export const initialBooks = [
  { id: 'B001', isbn: '9780441172719', title: 'Dune', author: 'Frank Herbert',
    genre: 'Science Fiction', language: 'English', publishDate: '1965-08-01',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780441172719-M.jpg' },
  { id: 'B002', isbn: '9780061120084', title: 'To Kill a Mockingbird', author: 'Harper Lee',
    genre: 'Classic', language: 'English', publishDate: '1960-07-11',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780061120084-M.jpg' },
  { id: 'B003', isbn: '9780451524935', title: '1984', author: 'George Orwell',
    genre: 'Dystopian', language: 'English', publishDate: '1949-06-08',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg' },
];

// Mock Book Statuses

export const initialCopies = [
  { id: 'C001001', bookId: 'B001', status: 'Available' },
  { id: 'C001002', bookId: 'B001', status: 'OnLoan' },
  { id: 'C002001', bookId: 'B002', status: 'Available' },
  { id: 'C003001', bookId: 'B003', status: 'Unavailable' },
];

// Mock Book Loans

export const initialLoans = [
  { id: 'LN0001', memberId: 'M001', copyId: 'C001002', requestId: 'R0001',
    loanDate: '2026-10-20', expectedReturnDate: '2026-11-10', actualReturnDate: null,
    renewCount: 0, lateFee: 0, feeStatus: 'None', feePaidDate: null, status: 'Active' },
];

// Mock Book Requests

export const initialRequests = [
  { id: 'R0001', memberId: 'M001', bookId: 'B001', requestedAt: '2026-10-31T11:23:00',
    status: 'Approved', decidedBy: 'L001', decidedAt: '2026-10-31T13:23:00' },
];

// Mock Renewal Requests

export const initialRenewalRequests = [];
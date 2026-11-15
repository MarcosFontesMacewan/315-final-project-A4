import { daysFromToday } from '../utils/dates.js';
// Mock Library Members

export const initialMembers = [
  { id: 'M001', firstName: 'Jane', lastName: 'Doe', email: 'doe123@example.com',
    password: 'password', status: 'Active', suspendedAt: null, joinDate: '2026-10-31' },
  { id: 'M002', firstName: 'Sam', lastName: 'Smith', email: 'sam@example.com',
    password: 'password', status: 'Suspended', suspendedAt: '2026-11-01', joinDate: '2026-09-01' },
  { id: 'M003', firstName: 'Will', lastName: 'Sonslade', email: 'slade@example.com',
    password: 'password', status: 'Active', suspendedAt: null, joinDate: '2026-11-15'},
  { id: 'M004', firstName: 'Raven', lastName: 'Roth', email: 'roth@example.com',
    password: 'password', status: 'Active', suspendedAt: null, joinDate: '2026-11-13'},
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
  { id: 'B004', isbn: '9780547928227', title: 'The Hobbit', author: 'J. R. R. Tolkien',
    genre: 'Fantasy', language: 'English', publishDate: '1937-09-21',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780547928227-M.jpg' },
  { id: 'B005', isbn: '9780141439518', title: 'Pride and Prejudice', author: 'Jane Austen',
    genre: 'Classic', language: 'English', publishDate: '1813-01-28',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg' },
  { id: 'B006', isbn: '9780062315007', title: 'The Alchemist', author: 'Paulo Coelho',
    genre: 'Fantasy', language: 'English', publishDate: '1993',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062315007-M.jpg' },
  { id: 'B007', isbn: '9782070612758', title: 'Le Petit Prince', author: 'Antoine de Saint-Exupéry',
    genre: 'Fiction', language: 'French', publishDate: '1943-04',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9782070612758-M.jpg' },
  { id: 'B008', isbn: '9780062316110', title: 'Sapiens', author: 'Yuval Noah Harari',
    genre: 'Non-Fiction', language: 'English', publishDate: '2014',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062316110-M.jpg' },
  { id: 'B009', isbn: '9780307474728', title: 'Cien anos de soledad', author: 'Gabriel José García Márquez',
    genre: 'Fiction', language: 'Spanish', publishDate: '1970',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780307474728-M.jpg' },
  { id: 'B010', isbn: '9780316595001', title: 'The Wolves of War', author: 'John Gwynne',
    genre: 'Fantasy', language: 'English', publishDate: daysFromToday(-12), // This way it will be new release book ot by the end of the term
    coverUrl: null }, // no cover in openLibrary yet
];

// Mock Book Statuses

export const initialCopies = [
  { id: 'C001001', bookId: 'B001', status: 'Available' },
  { id: 'C001002', bookId: 'B001', status: 'OnLoan' },
  { id: 'C002001', bookId: 'B002', status: 'Available' },
  { id: 'C003001', bookId: 'B003', status: 'Unavailable' },
  { id: 'C004001', bookId: 'B004', status: 'OnLoan' },
  { id: 'C005001', bookId: 'B005', status: 'OnLoan' },
  { id: 'C005002', bookId: 'B005', status: 'Available' },
  { id: 'C006001', bookId: 'B006', status: 'Available' },
  { id: 'C006002', bookId: 'B006', status: 'Available' },
  { id: 'C007001', bookId: 'B007', status: 'OnLoan' },
  { id: 'C008001', bookId: 'B008', status: 'OnLoan' },
  { id: 'C008002', bookId: 'B008', status: 'Available' },
  { id: 'C009001', bookId: 'B009', status: 'OnLoan' },
  { id: 'C010002', bookId: 'B010', status: 'Available' },
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
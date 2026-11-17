export function matchesQuery(book, query) {
    const q = (query ?? '').trim().toLowerCase();
    if (!q) return true;
  
    return (
      (book.title ?? '').toLowerCase().includes(q) ||
      (book.author ?? '').toLowerCase().includes(q) ||
      (book.isbn ?? '').toLowerCase().includes(q)
    );
  }
  
import { useState } from 'react';
import { useData } from '../../context/DataContext';
import BookCard from '../../components/ui/BookCard';
import SearchBar from '../../components/ui/SearchBar';
import FilterChips from '../../components/ui/FilterChips';

export default function Catalog() {
  const { books, availableCopies, borrowBook } = useData();
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState(null);
  const [language, setLanguage] = useState(null);

  const genres = [...new Set(books.map((b) => b.genre))];
  const languages = [...new Set(books.map((b) => b.language))];

  const filtered = books.filter((b) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.includes(q);
    return matchesQuery && (!genre || b.genre === genre) && (!language || b.language === language);
  });

  return (
    <div className="catalog-page">
      <h1>Catalog</h1>
      <div className="catalog-toolbar">
        <SearchBar value={query} onChange={setQuery} />
        <FilterChips label="Genre" options={genres} selected={genre} onSelect={setGenre} />
        <FilterChips label="Language" options={languages} selected={language} onSelect={setLanguage} />
      </div>
      <div className="book-grid">
        {filtered.map((b) => (
          <BookCard
            key={b.id}
            book={b}
            footer={
              availableCopies(b.id).length > 0
                ? <button onClick={() => borrowBook('M001', b.id)}>Borrow</button>
                : <span>Unavailable</span>
            }
          />
        ))}
        {filtered.length === 0 && <p>No books match your filters.</p>}
      </div>
    </div>
  );
}
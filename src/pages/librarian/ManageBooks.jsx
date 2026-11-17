import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { matchesQuery } from '../../utils/bookSearch';
import SearchBar from '../../components/ui/SearchBar';
import Button from '../../components/ui/Button';
import BookForm from './BookForm';
import CopyList from './CopyList';
import BookCard from '../../components/ui/BookCard';
import '../../styles/librarian.css';

export default function ManageBooks() {
  const { books, copies, addBook, updateBook, removeBook } = useData();

  const [query, setQuery] = useState('');
  const [formMode, setFormMode] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [notice, setNotice] = useState(null);

  const shown = useMemo(
    () => books.filter((book) => matchesQuery(book, query)),
    [books, query]
  );

  const editingBook = useMemo(
    () => (editingId ? books.find((b) => b.id === editingId) ?? null : null),
    [books, editingId]
  );

  function openAdd() {
    setFormMode('add');
    setEditingId(null);
  }

  function openEdit(book) {
    setFormMode('edit');
    setEditingId(book.id);
  }

  function closeForm() {
    setFormMode(null);
    setEditingId(null);
  }

  function handleSave(fields, copyCount) {
    const result =
      formMode === 'add'
        ? addBook(fields, copyCount)
        : updateBook(editingId, fields);

    if (!result.ok) {
      setNotice({ kind: 'error', text: result.reason });
    } else {
      const title = fields.title || editingBook?.title || '';
      setNotice({ kind: 'ok', text: `Saved "${title}".` });
      closeForm();
    }
  }

  function handleRemove(book) {
    const result = removeBook(book.id);
    setConfirmingId(null);
    setNotice(
      result.ok
        ? { kind: 'ok', text: `Removed "${book.title}".` }
        : { kind: 'error', text: result.reason }
    );
  }

  return (
    <div className="manage-books-page">
      <div className="manage-toolbar">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search title, author or ISBN"
        />
        <Button onClick={openAdd}>Add Entry</Button>
      </div>

      {notice && (
        <div className={`notice notice-${notice.kind}`} role="status">
          {notice.text}
        </div>
      )}

      {formMode && (
        <div className="manage-form-section">
          <BookForm
            key={editingId ?? 'new'}
            mode={formMode}
            initialBook={editingBook}
            onSave={handleSave}
            onCancel={closeForm}
          />
          {formMode === 'edit' && <CopyList bookId={editingId} />}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="empty-state">No books match your search.</p>
      ) : (
        <div className="book-grid">
          {shown.map((book) => {
            const bookCopies = copies.filter((c) => c.bookId === book.id);
            const totalCount = bookCopies.length;
            const availableCount = bookCopies.filter(
              (c) => c.status === 'Available'
            ).length;

            return (
              <BookCard
                key={book.id}
                book={book}
                footer={
                  <>
                    <p>
                      {availableCount} of {totalCount} copies available
                    </p>
                    {confirmingId === book.id ? (
                      <div className="card-actions">
                        <span>Remove?</span>
                        <Button onClick={() => handleRemove(book)}>Yes</Button>
                        <Button onClick={() => setConfirmingId(null)}>No</Button>
                      </div>
                    ) : (
                      <div className="card-actions">
                        <Button onClick={() => setConfirmingId(book.id)}>
                          Remove
                        </Button>
                        <Button onClick={() => openEdit(book)}>Edit</Button>
                      </div>
                    )}
                  </>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
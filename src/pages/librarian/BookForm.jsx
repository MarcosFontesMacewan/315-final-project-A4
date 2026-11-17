import { useState } from 'react';
import { validateBook } from '../../utils/validation';
import FormField from '../../components/forms/FormField';
import Button from '../../components/ui/Button';

export default function BookForm({ mode, book, books, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({
    isbn: mode === 'edit' && book ? book.isbn ?? '' : '',
    title: mode === 'edit' && book ? book.title ?? '' : '',
    author: mode === 'edit' && book ? book.author ?? '' : '',
    genre: mode === 'edit' && book ? book.genre ?? '' : '',
    language: mode === 'edit' && book ? book.language ?? '' : '',
    publishDate: mode === 'edit' && book ? book.publishDate ?? '' : '',
  }));

  const [copies, setCopies] = useState('1');
  const [errors, setErrors] = useState({});
  const [lookup, setLookup] = useState('idle'); // 'idle' | 'loading' | 'notfound'

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleLookUp() {
    const digits = form.isbn.replace(/\D/g, '');
    if (digits.length !== 10 && digits.length !== 13) {
      setErrors((prev) => ({ ...prev, isbn: 'Enter 10 or 13 digits.' }));
      return;
    }

    setErrors((prev) => ({ ...prev, isbn: undefined }));
    setLookup('loading');
  }

  function handleSubmit(event) {
    event.preventDefault();

    const found = validateBook(form, books, book?.id, mode);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    const digits = form.isbn.replace(/\D/g, '');
    const fields = {
      isbn: digits,
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      language: form.language.trim(),
      publishDate: form.publishDate.trim(),
      coverUrl: `https://openlibrary.org{digits}-M.jpg`,
    };

    onSave(fields, Number(copies));
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-row">
        <FormField
          label="ISBN"
          value={form.isbn}
          onChange={(val) => setField('isbn', val)}
          error={errors.isbn}
        />
        <Button type="button" onClick={handleLookUp}>
          Look Up
        </Button>
      </div>

      {lookup === 'loading' && <p>Looking up...</p>}
      {lookup === 'notfound' && <p>Book not found</p>}

      <FormField
        label="Title"
        value={form.title}
        onChange={(val) => setField('title', val)}
        error={errors.title}
      />
      <FormField
        label="Author"
        value={form.author}
        onChange={(val) => setField('author', val)}
        error={errors.author}
      />

      <div className="form-row">
        <FormField
          label="Genre"
          value={form.genre}
          onChange={(val) => setField('genre', val)}
          error={errors.genre}
        />
        <FormField
          label="Language"
          value={form.language}
          onChange={(val) => setField('language', val)}
          error={errors.language}
        />
      </div>

      <FormField
        label="Publish date (YYYY-MM-DD)"
        value={form.publishDate}
        onChange={(val) => setField('publishDate', val)}
        error={errors.publishDate}
      />

      {mode === 'add' && (
        <FormField
          label="Number of copies"
          type="number"
          min="1"
          value={copies}
          onChange={setCopies}
          error={errors.copies}
        />
      )}

      <div className="form-row">
        <Button type="submit">Save</Button>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

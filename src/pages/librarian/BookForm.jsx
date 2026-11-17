import { useState } from 'react';
import { validateBook } from '../../utils/validation';
import { lookUpIsbn } from '../../utils/openLibrary';
import FormField from '../../components/forms/FormField';
import Button from '../../components/ui/Button';
import '../../styles/forms.css';

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
    if (key === 'isbn') setLookup('idle');
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Fills the form from the ISBN
  async function handleLookUp() {
    const digits = form.isbn.replace(/[\s-]/g, '');
    if (!/^\d{9}[\dX]$|^\d{13}$/.test(digits)) {
      setErrors((prev) => ({ ...prev, isbn: 'Enter 10 or 13 digits.' }));
      return;
    }

    setErrors((prev) => ({ ...prev, isbn: undefined }));
    setLookup('loading');

    const found = await lookUpIsbn(digits);
    if (!found) {
      setLookup('notfound');
      return;
    }

    setForm((prev) => ({ ...prev, ...found }));
    setLookup('idle');
  }

  function handleSubmit(event) {
    event.preventDefault();

    const found = validateBook({ ...form, copies }, books, book?.id, mode);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    const digits = form.isbn.replace(/[\s-]/g, '');
    const fields = {
      isbn: digits,
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      language: form.language.trim(),
      publishDate: form.publishDate.trim(),
      coverUrl: mode === 'edit' && book.isbn === digits
        ? book.coverUrl
        : `https://covers.openlibrary.org/b/isbn/${digits}-M.jpg`,
    };

    onSave(fields, Number(copies));
  }

  // One text box with its label and its error message
  function textField(label, key) {
    return (
      <FormField label={label} error={errors[key]}>
        <input
          value={form[key]}
          onChange={(e) => setField(key, e.target.value)}
        />
      </FormField>
    );
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-row isbn-row">
        {textField('ISBN', 'isbn')}
        <Button type="button" onClick={handleLookUp}>
          Look Up
        </Button>
      </div>

      {lookup === 'loading' && <p>Looking up...</p>}
      {lookup === 'notfound' && <p>Book not found</p>}

      {textField('Title', 'title')}
      {textField('Author', 'author')}

      <div className="form-row">
        {textField('Genre', 'genre')}
        {textField('Language', 'language')}
      </div>

      {textField('Publish date (YYYY-MM-DD)', 'publishDate')}

      {mode === 'add' && (
        <FormField label="Number of copies" error={errors.copies}>
          <input
            type="number"
            min="1"
            max="10"
            value={copies}
            onChange={(e) => setCopies(e.target.value)}
          />
        </FormField>
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
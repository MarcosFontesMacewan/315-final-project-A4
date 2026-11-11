export default function BookCard({ book, footer }) {
  return (
    <article className="book-card">
      <div className="book-cover">
        {book.coverUrl
          ? <img src={book.coverUrl} alt={book.title} />
          : <div className="cover-placeholder" />}
      </div>
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">{book.author}</p>
      {footer && <div className="book-footer">{footer}</div>}
    </article>
  );
}
import { useState } from "react";

export default function AddBookModal({ onClose, onSubmit, book = null }) {
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [isbn, setIsbn] = useState(book?.isbn ?? "");
  const [totalCopies, setTotalCopies] = useState(book?.total_copies ?? 1);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !isbn.trim() || totalCopies < 1)
      return;

    setSubmitting(true);

    try {
      await onSubmit({
        id: book?.id,
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        total_copies: totalCopies,
      });
      onClose();
    } catch (err) {
      alert(err?.message || "Failed to save book");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{book ? "Edit Book" : "Add New Book"}</h3>

        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Author
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </label>

          <label>
            ISBN
            <input
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />
          </label>

          <label>
            Total Copies
            <input
              type="number"
              min="1"
              value={totalCopies}
              onChange={(e) => setTotalCopies(Number(e.target.value))}
              required
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting
                ? book
                  ? "Saving..."
                  : "Adding..."
                : book
                  ? "Save Book"
                  : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

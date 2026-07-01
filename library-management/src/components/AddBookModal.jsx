import { useState } from "react";

export default function AddBookModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [totalCopies, setTotalCopies] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || totalCopies < 1) return;

    setSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        totalCopies,
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <h3>Add a new book</h3>

      <form onSubmit={handleSubmit}>
        <label>
          Book Title
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
          Total_Copies
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
            {submitting ? "Adding..." : "Add Book"}
          </button>
        </div>
      </form>
    </div>
  );
}

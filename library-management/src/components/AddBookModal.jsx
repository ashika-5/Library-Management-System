import { useState } from "react";

export default function AddBookModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [totalCopies, setTotalCopies] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || totalCopies < 1) return;
    setSubmitting(true);
    await onSubmit({ name: name.trim(), totalCopies });
    setSubmitting(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Add a new book</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Book name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Total copies
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
              {submitting ? "Adding..." : "Add book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";

export default function BorrowModal({ onClose, onSubmit }) {
  const [borrowerName, setBorrowerName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!borrowerName.trim()) return;
    setSubmitting(true);
    await onSubmit(borrowerName.trim());
    setSubmitting(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Borrow this book</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Borrower name
            <input
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
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
              {submitting ? "Saving..." : "Confirm borrow"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

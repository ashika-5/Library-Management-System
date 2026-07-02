import { useState } from "react";

export default function BorrowModal({ onClose, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setSubmitting(true);

    try {
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Borrow Book</h3>

        <p>Are you sure you want to borrow this book?</p>

        <form onSubmit={handleSubmit}>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Borrowing..." : "Borrow"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getBook,
  getBorrowRecordsForBook,
  borrowBook,
  returnBook,
} from "../api/mockApi.js";

import BorrowModal from "../components/BorrowModal.jsx";

export default function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  async function loadData() {
    setLoading(true);

    try {
      const [bookData, recordData] = await Promise.all([
        getBook(bookId),
        getBorrowRecordsForBook(bookId),
      ]);

      setBook(bookData);
      setRecords(recordData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [bookId]);

  function openBorrowModal() {
    if (!localStorage.getItem("lbm_token")) {
      alert("Please log in before borrowing a book.");
      navigate("/login");
      return;
    }

    setShowBorrowModal(true);
  }

  async function handleBorrow() {
    if (!localStorage.getItem("lbm_token")) {
      alert("Please log in before borrowing a book.");
      navigate("/login");
      return;
    }

    try {
      await borrowBook({
        book_id: book.id,
      });

      setShowBorrowModal(false);

      loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleReturn(recordId) {
    try {
      await returnBook({
        record_id: recordId,
        book_id: book.id,
      });

      loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading...</p>;

  if (!book) return <p>Book not found.</p>;

  return (
    <div className="page">
      <Link to="/" className="back-link">
        ← Back
      </Link>

      <div className="book-summary">
        <h2>{book.title}</h2>

        <p>
          <strong>Author:</strong> {book.author}
        </p>

        <p>
          <strong>ISBN:</strong> {book.isbn}
        </p>

        <span
          className={
            book.available_copies === 0
              ? "badge badge-danger"
              : "badge badge-success"
          }
        >
          {book.available_copies} / {book.total_copies} Available
        </span>
      </div>

      <div className="page-header">
        <h3>Borrow History</h3>

        <button
          className="btn btn-primary"
          disabled={book.available_copies === 0}
          onClick={openBorrowModal}
        >
          {book.available_copies === 0 ? "No Copies Left" : "Borrow Book"}
        </button>
      </div>

      {records.length === 0 ? (
        <p>No borrow records.</p>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Borrowed At</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Return</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>

                <td>{new Date(r.borrowed_at).toLocaleString()}</td>

                <td>{new Date(r.due_date).toLocaleDateString()}</td>

                <td>{r.is_returned ? "Returned" : "Borrowed"}</td>

                <td>
                  {r.is_returned ? (
                    "✓"
                  ) : (
                    <button
                      className="btn btn-sm"
                      onClick={() => handleReturn(r.id)}
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showBorrowModal && (
        <BorrowModal
          onClose={() => setShowBorrowModal(false)}
          onSubmit={handleBorrow}
        />
      )}
    </div>
  );
}

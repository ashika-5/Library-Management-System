import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getBookById,
  getBorrowRecordsForBook,
  borrowBook,
  returnBook,
} from "../api/mockApi.js";
import BorrowModal from "../components/BorrowModal.jsx";

export default function BookDetail() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  async function loadData() {
    setLoading(true);
    const [bookData, recordData] = await Promise.all([
      getBookById(bookId),
      getBorrowRecordsForBook(bookId),
    ]);
    setBook(bookData);
    setRecords(recordData);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [bookId]);

  async function handleBorrow(borrowerName) {
    await borrowBook({ bookId: book.id, borrowerName });
    setShowBorrowModal(false);
    loadData();
  }

  async function handleReturn(recordId) {
    await returnBook(recordId);
    loadData();
  }

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="page">
      <Link to="/" className="back-link">
        ← Back to catalogue
      </Link>

      <div className="book-summary">
        <h2>{book.name}</h2>
        <span
          className={
            book.availableCopies === 0
              ? "badge badge-danger"
              : "badge badge-success"
          }
        >
          {book.availableCopies}/{book.totalCopies} available
        </span>
      </div>

      <div className="page-header">
        <h3>Logs</h3>
        <button
          className="btn btn-primary"
          disabled={book.availableCopies === 0}
          onClick={() => setShowBorrowModal(true)}
        >
          {book.availableCopies === 0 ? "No copies left" : "+ Add"}
        </button>
      </div>

      {records.length === 0 ? (
        <p>No one has borrowed this book yet.</p>
      ) : (
        <table className="book-table">
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.borrowerName}</td>
                <td>{r.borrowedDate}</td>
                <td>
                  {r.returnedDate ? (
                    <span className="returned-date">
                      Returned on {r.returnedDate}
                    </span>
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

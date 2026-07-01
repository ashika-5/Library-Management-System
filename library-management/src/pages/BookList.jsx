import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks, addBook } from "../api/mockApi.js";
import AddBookModal from "../components/AddBookModal.jsx";
import { useAuth } from "../context/AuthContext"; 

export default function BookList() {
  const { user } = useAuth(); 
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  async function loadBooks() {
    setLoading(true);
    setBooks(await getBooks());
    setLoading(false);
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function handleAddBook(formData) {
    await addBook(formData);
    setShowAddModal(false);
    loadBooks();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Book catalogue</h2>
        {
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add book
          </button>
        }
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Copies </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.id}>
                <td>{index + 1}</td>
                <td>{book.name}</td>
                <td>
                  <span
                    className={
                      book.availableCopies === 0
                        ? "badge badge-danger"
                        : "badge badge-success"
                    }
                  >
                    {book.availableCopies}/{book.totalCopies}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/books/${book.id}`}
                    className="icon-btn"
                    title="View details"
                  >
                    👁
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddModal && (
        <AddBookModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddBook}
        />
      )}
    </div>
  );
}

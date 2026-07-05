import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks, addBook, updateBook, deleteBook } from "../api/mockApi.js";
import AddBookModal from "../components/AddBookModal.jsx";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  async function loadBooks() {
    setLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function handleAddBook(formData) {
    try {
      await addBook(formData);
      alert("Book added successfully!");
      setShowAddModal(false);
      setEditingBook(null);
      loadBooks();
    } catch (err) {
      alert(err?.message || "Failed to add book");
    }
  }

  async function handleEditBook(book) {
    try {
      await updateBook(book.id, book);
      setEditingBook(null);
      setShowAddModal(false);
      loadBooks();
    } catch (err) {
      alert(err?.message || "Failed to update book");
    }
  }

  async function handleDeleteBook(id) {
    if (!window.confirm("Delete this book permanently?")) return;
    try {
      await deleteBook(id);
      loadBooks();
    } catch (err) {
      alert(err?.message || "Failed to delete book");
    }
  }

  return (
    <div className="page">
      {}
      <div className="page-header">
        <h2>Book Catalogue</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingBook(null);
            setShowAddModal(true);
          }}
        >
          + Add Book
        </button>
      </div>

      {}
      {loading ? (
        <div className="loading-state">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <span>📚</span>
          <p>No books in the catalogue yet. Add the first one!</p>
        </div>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Total</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>
                  <div className="book-cover-cell">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title}
                        className="book-list-cover"
                      />
                    ) : (
                      <div className="book-list-cover-placeholder">📖</div>
                    )}
                  </div>
                </td>

                <td style={{ color: "var(--ink-3)", fontSize: "13px" }}>
                  #{book.id}
                </td>

                <td>
                  <span style={{ fontWeight: 600, color: "var(--ink)" }}>
                    {book.title}
                  </span>
                </td>

                <td style={{ color: "var(--ink-2)" }}>{book.author}</td>

                <td
                  style={{
                    color: "var(--ink-3)",
                    fontSize: "13px",
                    fontFamily: "monospace",
                  }}
                >
                  {book.isbn}
                </td>

                <td style={{ textAlign: "center" }}>{book.total_copies}</td>

                <td>
                  <span
                    className={
                      book.available_copies === 0
                        ? "badge badge-danger"
                        : book.available_copies <= 2
                          ? "badge badge-warning"
                          : "badge badge-success"
                    }
                  >
                    {}
                    {book.available_copies === 0
                      ? "Out of stock"
                      : `${book.available_copies} left`}
                  </span>
                </td>

                <td>
                  <div className="action-cell">
                    {}
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        setEditingBook(book);
                        setShowAddModal(true);
                      }}
                    >
                      ✏ Edit
                    </button>

                    {}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteBook(book.id)}
                    >
                      🗑
                    </button>

                    {}
                    <Link
                      to={`/books/${book.id}`}
                      className="icon-btn"
                      title="View details & borrow history"
                    >
                      👁
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddModal && (
        <AddBookModal
          book={editingBook}
          onClose={() => {
            setShowAddModal(false);
            setEditingBook(null);
          }}
          onSubmit={editingBook ? handleEditBook : handleAddBook}
        />
      )}
    </div>
  );
}

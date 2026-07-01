import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooks, addBook, updateBook, deleteBook } from "../api/mockApi.js";
import AddBookModal from "../components/AddBookModal.jsx";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

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
    if (!window.confirm("Delete this book?")) return;

    try {
      await deleteBook(id);
      loadBooks();
    } catch (err) {
      alert(err?.message || "Failed to delete book");
    }
  }

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
      setShowAddModal(false);
      setEditingBook(null);
      loadBooks();
    } catch (err) {
      alert(err?.message || "Failed to add book");
    }
  }

  return (
    <div className="page">
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

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Total Copies</th>
              <th>Available Copies</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.total_copies}</td>

                <td>
                  <span
                    className={
                      book.available_copies === 0
                        ? "badge badge-danger"
                        : "badge badge-success"
                    }
                  >
                    {book.available_copies}
                  </span>
                </td>

                <td>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setEditingBook(book);
                      setShowAddModal(true);
                    }}
                  >
                    ✏ Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    🗑 Delete
                  </button>

                  <Link to={`/books/${book.id}`} className="icon-btn">
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

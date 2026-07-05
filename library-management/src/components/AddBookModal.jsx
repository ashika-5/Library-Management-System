import { useState } from "react";

export default function AddBookModal({ onClose, onSubmit, book = null }) {
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [isbn, setIsbn] = useState(book?.isbn ?? "");
  const [totalCopies, setTotalCopies] = useState(book?.total_copies ?? 1);
  const [submitting, setSubmitting] = useState(false);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file only (jpg, png, webp, etc.)");
      e.target.value = ""; 
      return;
    }

    setImage(file);

    setImagePreview(URL.createObjectURL(file));
  }

  

  function handleRemoveImage() {
    setImage(null);
    setImagePreview(null);
  }

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
        image: image,
      });
      onClose();
    } catch (err) {
      alert(err?.message || "Failed to save book");
    } finally {
      setSubmitting(false);
    }
  }

  const isEdit = Boolean(book);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {}
        <div className="modal-header">
          <h3>{isEdit ? "✏️ Edit Book" : "📖 Add New Book"}</h3>
        </div>

        {}
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <label>
              Title *
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Great Gatsby"
                required
              />
            </label>

            <label>
              Author *
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. F. Scott Fitzgerald"
                required
              />
            </label>

            <label>
              ISBN *
              <input
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="e.g. 978-3-16-148410-0"
                required
              />
            </label>

            <label>
              Total Copies *
              <input
                type="number"
                min="1"
                value={totalCopies}
                onChange={(e) => setTotalCopies(Number(e.target.value))}
                required
              />
            </label>

            {}
            <label>
              Image
              {}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            {}
            {isEdit && book?.image && !imagePreview && (
              <div className="image-preview-wrap">
                <p className="current-img-label">Current cover:</p>
                <img src={book.image} alt="current cover" />
              </div>
            )}

            {}
            {imagePreview && (
              <div className="image-preview-wrap">
                <img src={imagePreview} alt="new cover preview" />
                <button
                  type="button"
                  className="remove-img-btn"
                  onClick={handleRemoveImage}
                >
                  ✕ Remove image
                </button>
              </div>
            )}

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
                  ? isEdit
                    ? "Saving..."
                    : "Adding..."
                  : isEdit
                    ? "Save Changes"
                    : "Add Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

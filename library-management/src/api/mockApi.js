const API_BASE = "https://library-api-9h9j.onrender.com/api";

function getAuthHeader() {
  const token = localStorage.getItem("lbm_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function normalizeBorrowPayload(payload) {
  if (typeof payload === "object" && payload !== null) {
    return {
      book_id: payload.bookId ?? payload.book_id ?? payload.id,
      borrower_name: payload.borrowerName ?? payload.borrower_name,
    };
  }

  return { book_id: payload };
}

function normalizeReturnPayload(payload) {
  if (typeof payload === "object" && payload !== null) {
    return {
      record_id: payload.recordId ?? payload.record_id ?? payload.id,
      book_id: payload.bookId ?? payload.book_id,
    };
  }

  return { record_id: payload };
}

export async function getBooks() {
  const res = await fetch(`${API_BASE}/books/`);
  return await res.json();
}

export async function getBook(id) {
  const res = await fetch(`${API_BASE}/books/${id}/`);
  return await res.json();
}

export async function getBorrowRecordsForBook(id) {
  try {
    const res = await fetch(`${API_BASE}/borrow/?book_id=${id}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function addBook(bookData) {
  const normalizedBookData = {
    name: bookData.name ?? bookData.title,
    author: bookData.author,
    isbn: bookData.isbn,
    totalCopies: bookData.totalCopies ?? bookData.total_copies,
  };

  const res = await fetch(`${API_BASE}/books/`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(normalizedBookData),
  });
  if (!res.ok) throw new Error("Failed to add book");
  return await res.json();
}

export async function borrowBook(payload) {
  const res = await fetch(`${API_BASE}/borrow/`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(normalizeBorrowPayload(payload)),
  });
  if (!res.ok) throw new Error("Failed to borrow book");
  return await res.json();
}

export async function returnBook(payload) {
  const res = await fetch(`${API_BASE}/return/`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(normalizeReturnPayload(payload)),
  });
  if (!res.ok) throw new Error("Failed to return book");
  return await res.json();
}

export async function getMyBorrows() {
  const res = await fetch(`${API_BASE}/my-borrows/`, {
    headers: getAuthHeader(),
  });
  return await res.json();
}

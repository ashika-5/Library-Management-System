const API_BASE = "https://library-api-9h9j.onrender.com/api";

function getAuthHeader() {
  const token = localStorage.getItem("lbm_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function normalizeBookData(bookData) {
  return {
    title: bookData?.title ?? bookData?.name,
    author: bookData?.author ?? "",
    isbn: bookData?.isbn ?? "",
    total_copies: bookData?.total_copies ?? bookData?.totalCopies ?? 1,
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
  const normalizedBookData = normalizeBookData(bookData);

  const res = await fetch(`${API_BASE}/books/`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(normalizedBookData),
  });
  if (!res.ok) throw new Error("Failed to add book");
  return await res.json();
}

export async function updateBook(id, bookData) {
  const normalizedBookData = normalizeBookData(bookData);

  const res = await fetch(`${API_BASE}/books/${id}/`, {
    method: "PATCH",
    headers: getAuthHeader(),
    body: JSON.stringify(normalizedBookData),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update book");
  }

  return await res.json().catch(() => ({}));
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



export async function deleteBook(id) {
  console.log("Deleting book id:", id);

  const res = await fetch(`${API_BASE}/books/${id}/`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  console.log("DELETE URL:", `${API_BASE}/books/${id}/`);
  console.log("Status:", res.status);

  const data = await res.json().catch(() => ({}));
  console.log("Response:", data);

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete book");
  }
}
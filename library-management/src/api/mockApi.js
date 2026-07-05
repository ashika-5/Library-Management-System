const API_BASE = "https://library-api-9h9j.onrender.com/api";


function getAuthHeader() {
  const token = localStorage.getItem("lbm_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}


function getAuthHeaderFormData() {
  const token = localStorage.getItem("lbm_token");
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function getSignedInUserName() {
  const token = localStorage.getItem("lbm_token");
  if (!token) return "";
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.username || decoded.name || decoded.preferred_username || "";
  } catch {
    return "";
  }
}


function fixImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `https://library-api-9h9j.onrender.com${url}`;
}

function normalizeBorrowPayload(payload) {
  if (typeof payload === "object" && payload !== null) {
    return {
      book_id: payload.bookId ?? payload.book_id ?? payload.id,
      borrower_name:
        payload.borrowerName ?? payload.borrower_name ?? getSignedInUserName(),
    };
  }
  return { book_id: payload, borrower_name: getSignedInUserName() };
}

function normalizeReturnPayload(payload) {
  if (typeof payload === "object" && payload !== null) {
    return {
      record_id: payload.recordId ?? payload.record_id ?? payload.id,
      book_id: payload.bookId ?? payload.book_id,
      borrower_name:
        payload.borrowerName ?? payload.borrower_name ?? getSignedInUserName(),
    };
  }
  return { record_id: payload, borrower_name: getSignedInUserName() };
}

export async function getBook(id) {
  const res = await fetch(`${API_BASE}/books/${id}/`);
  const data = await res.json();
  return {
    ...data,
    image: data.image || null,  
  };
}

export async function getBook(id) {
  const res = await fetch(`${API_BASE}/books/${id}/`);
  const data = await res.json();
  
  return {
    ...data,
    image: fixImageUrl(data.image),
  };
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
  const form = new FormData();
  form.append("title", bookData.title ?? bookData.name ?? "");
  form.append("author", bookData.author ?? "");
  form.append("isbn", bookData.isbn ?? "");
  form.append(
    "total_copies",
    bookData.total_copies ?? bookData.totalCopies ?? 1,
  );

  
  if (bookData.image) {
    form.append("image", bookData.image);
  }

  const res = await fetch(`${API_BASE}/books/`, {
    method: "POST",
    headers: getAuthHeaderFormData(),
    body: form,
  });

  if (!res.ok) throw new Error("Failed to add book");
  const data = await res.json();
  console.log("ADD BOOK RESPONSE:", data); 
  return { ...data, image: fixImageUrl(data.image) };
}


export async function updateBook(id, bookData) {
  const form = new FormData();
  form.append("title", bookData.title ?? bookData.name ?? "");
  form.append("author", bookData.author ?? "");
  form.append("isbn", bookData.isbn ?? "");
  form.append(
    "total_copies",
    bookData.total_copies ?? bookData.totalCopies ?? 1,
  );

  
  if (bookData.image) {
    form.append("image", bookData.image);
  }

  const res = await fetch(`${API_BASE}/books/${id}/`, {
    method: "PATCH",
    headers: getAuthHeaderFormData(),
    body: form,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update book");
  }

  const data = await res.json().catch(() => ({}));
  return { ...data, image: fixImageUrl(data.image) };
}

export async function borrowBook(payload) {
  const token = localStorage.getItem("lbm_token");
  if (!token) throw new Error("Please log in before borrowing a book.");

  const res = await fetch(`${API_BASE}/borrow/`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(normalizeBorrowPayload(payload)),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.detail || data.message || data.error || "Failed to borrow book",
    );
  }
  return data;
}

export async function returnBook(payload) {
  const token = localStorage.getItem("lbm_token");
  if (!token) throw new Error("Please log in before returning a book.");

  const res = await fetch(`${API_BASE}/return/`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(normalizeReturnPayload(payload)),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.detail || data.message || data.error || "Failed to return book",
    );
  }
  return data;
}

export async function getMyBorrows() {
  const res = await fetch(`${API_BASE}/my-borrows/`, {
    headers: getAuthHeader(),
  });
  return await res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`${API_BASE}/books/${id}/`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete book");
  }
}

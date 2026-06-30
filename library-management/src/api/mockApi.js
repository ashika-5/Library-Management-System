const DB_KEYS = {
  BOOKS: "library_books",
  RECORDS: "library_borrow_records",
};

function readTable(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function writeTable(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function seed() {
  if (localStorage.getItem("library_seeded")) return;

  const books = [
    { id: 1, name: "OOP", totalCopies: 20, availableCopies: 19 },
    { id: 2, name: "Python ", totalCopies: 10, availableCopies: 6 },
  ];

  const records = [
    {
      id: 1,
      bookId: 1,
      borrowerName: "Sudeep",
      borrowedDate: "2026-06-10",
      returnedDate: null,
    },
    {
      id: 2,
      bookId: 1,
      borrowerName: "Pratik",
      borrowedDate: "2026-06-12",
      returnedDate: "2026-06-18",
    },
  ];

  const users = [
    { id: 1, username: "ram", password: "1234" },
    { id: 2, username: "sita", password: "5678" },
  ];

  writeTable(DB_KEYS.BOOKS, books);
  writeTable(DB_KEYS.RECORDS, records);
  localStorage.setItem("library_seeded", "true");
}

seed();

export async function getBooks() {
  return readTable(DB_KEYS.BOOKS);
}

export async function getBookById(bookId) {
  const books = readTable(DB_KEYS.BOOKS);

  const book = books.find((b) => b.id === Number(bookId));

  if (!book) {
    throw new Error("Book not found");
  }

  return book;
}

export async function addBook({ name, totalCopies }) {
  const books = readTable(DB_KEYS.BOOKS);

  const newBook = {
    id: books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1,
    name,
    totalCopies: Number(totalCopies),
    availableCopies: Number(totalCopies),
  };

  books.push(newBook);

  writeTable(DB_KEYS.BOOKS, books);

  return newBook;
}

export async function getBorrowRecordsForBook(bookId) {
  const records = readTable(DB_KEYS.RECORDS);

  return records
    .filter((r) => r.bookId === Number(bookId))
    .sort((a, b) => new Date(b.borrowedDate) - new Date(a.borrowedDate));
}

export async function borrowBook({ bookId, borrowerName }) {
  const books = readTable(DB_KEYS.BOOKS);
  const records = readTable(DB_KEYS.RECORDS);

  const book = books.find((b) => b.id === Number(bookId));

  if (!book) {
    throw new Error("Book not found");
  }

  if (book.availableCopies <= 0) {
    throw new Error("No copies available");
  }

  const newRecord = {
    id: records.length ? Math.max(...records.map((r) => r.id)) + 1 : 1,
    bookId: Number(bookId),
    borrowerName,
    borrowedDate: new Date().toISOString().split("T")[0],
    returnedDate: null,
  };

  records.push(newRecord);

  book.availableCopies -= 1;

  writeTable(DB_KEYS.RECORDS, records);
  writeTable(DB_KEYS.BOOKS, books);

  return newRecord;
}

export async function returnBook(recordId) {
  const records = readTable(DB_KEYS.RECORDS);
  const books = readTable(DB_KEYS.BOOKS);

  const record = records.find((r) => r.id === Number(recordId));

  if (!record) {
    throw new Error("Record not found");
  }

  if (record.returnedDate) {
    throw new Error("Already returned");
  }

  record.returnedDate = new Date().toISOString().split("T")[0];

  const book = books.find((b) => b.id === record.bookId);

  if (book) {
    book.availableCopies += 1;
  }

  writeTable(DB_KEYS.RECORDS, records);
  writeTable(DB_KEYS.BOOKS, books);

  return record;
}

import { Routes, Route } from "react-router-dom";
import BookList from "./pages/BookList.jsx";
import BookDetail from "./pages/BookDetail.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Library management system</h1>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books/:bookId" element={<BookDetail />} />
        </Routes>
      </main>
    </div>
  );
}

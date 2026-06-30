import { Routes, Route, Navigate } from "react-router-dom";
import BookList from "./pages/BookList.jsx";
import BookDetail from "./pages/BookDetail.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { GoogleOAuthProvider } from "@react-oauth/google";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="app-header">
      <h1>Library management system</h1>
      {user && <button onClick={logout}>Logout</button>}
    </header>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <BookList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/:bookId"
              element={
                <ProtectedRoute>
                  <BookDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

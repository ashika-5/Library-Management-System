import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import { handleGoogleToken } from "../services/googleAuthService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await loginUser(username.trim(), password);
      login(user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    try {
      const result = await handleGoogleToken(credentialResponse.credential);
      login(result);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-root">
      {}
      <div className="auth-left">
        <div className="auth-left-overlay" />
        <div className="auth-left-content">
          <p className="auth-left-eyebrow">Welcome to</p>
          <h1 className="auth-left-title">
            LIBRARY
            <br />
            MANAGEMENT
            <br />
            SYSTEM
          </h1>
          <div className="auth-left-line" />
          <p className="auth-left-tagline">Your gateway to knowledge</p>
        </div>
      </div>

      {}
      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-logo">📚</div>
          <h2 className="auth-title">Sign In</h2>
          <p className="auth-subtitle">Access the library catalogue</p>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoFocus
                required
              />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div className="auth-or">
            <span>or continue with</span>
          </div>

          <div className="auth-google">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed. Please try again.")}
            />
          </div>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

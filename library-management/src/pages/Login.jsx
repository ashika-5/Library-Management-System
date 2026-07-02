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
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const user = await loginUser(username.trim(), password);
      login(user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
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
    <div className="page auth-page">
      <h1>Login</h1>
      <form className="book-form" onSubmit={handleSubmit}>
        {error && <p className="error-text">{error}</p>}

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>

      <p style={{ textAlign: "center", margin: "12px 0" }}>or</p>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google login failed")}
        />
      </div>
    </div>
  );
}

export default Login;

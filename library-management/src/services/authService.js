const API_BASE = "https://library-api-9h9j.onrender.com/api";

export async function loginUser(username, password) {
  const res = await fetch(`${API_BASE}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.detail || data.message || "Invalid username or password",
    );
  }

  return { token: data.access };
}

export async function registerUser(username, email, password) {
  const res = await fetch(`${API_BASE}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.detail ||
        Object.values(data).flat().join(", ") ||
        "Registration failed",
    );
  }

  return data;
}

export async function logoutUser() {
  const token = localStorage.getItem("lbm_token");

  await fetch(`${API_BASE}/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getAuthHeader() {
  const token = localStorage.getItem("lbm_token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

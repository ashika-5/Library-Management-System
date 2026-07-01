const API_BASE = "https://library-api-9h9j.onrender.com/api";

export async function handleGoogleToken(credential) {
  const res = await fetch(`${API_BASE}/google-login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: credential }),
  });
  if (!res.ok) throw new Error("Google login failed");
  const data = await res.json();
  return { token: data.access };
}

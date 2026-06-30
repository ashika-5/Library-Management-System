const USERS_KEY = "library_users";

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return JSON.parse(raw);
  const defaults = [
    { id: 1, username: "ram", password: "1234", role: "admin" },
    { id: 2, username: "sita", password: "5678", role: "user" },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
  return defaults;
}


function createToken(user) {
  return btoa(
    JSON.stringify({ id: user.id, username: user.username, role: user.role }),
  );
}


export function readToken(token) {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
}


export async function loginUser(username, password) {
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user) throw new Error("Invalid username or password");

  const token = createToken(user);  
  return { token };
}

export async function registerUser(username, password) {
  const users = getUsers();
  if (users.find((u) => u.username === username)) {
    throw new Error("Username already taken");
  }
  const newUser = {
    id: users.length + 1,
    username,
    password,
    role: "user",
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const token = createToken(newUser);
  return { token };
}

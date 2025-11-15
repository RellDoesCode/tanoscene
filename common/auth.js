const USER_KEY = "ts_user_v1";
const USERS_KEY = "ts_users_v1";

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; }
}
function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
}
export function isAuthed() {
  return !!getUser();
}
export function logout() {
  localStorage.removeItem(USER_KEY);
}

export function signup({ username, email, password }) {
  const users = readUsers();
  if (!username || !email || !password) throw new Error("All fields required");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Invalid email");
  if (password.length < 6) throw new Error("Min 6 characters");
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) throw new Error("Email in use");
  const user = { id: crypto.randomUUID(), username, email, password };
  users.push(user);
  writeUsers(users);
  localStorage.setItem(USER_KEY, JSON.stringify({ id: user.id, username: user.username, email: user.email }));
}

export function login({ email, password }) {
  const users = readUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) throw new Error("Invalid credentials");
  localStorage.setItem(USER_KEY, JSON.stringify({ id: user.id, username: user.username, email: user.email }));
}

export function requireAuth() {
  if (!isAuthed()) {
    window.location.href = "./login.html";
  }
}
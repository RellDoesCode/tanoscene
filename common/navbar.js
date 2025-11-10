import { getUser, isAuthed, logout } from "./auth.js";

function createNavbar() {
  const navbar = document.createElement('nav');
  navbar.classList.add('navbar');

  const left = document.createElement('div');
  left.classList.add('navbar-left');
  const logo = document.createElement('a');
  logo.textContent = 'TanoScene';
  logo.href = 'index.html';
  left.appendChild(logo);

  const right = document.createElement('div');
  right.classList.add('navbar-right');
  const menuButton = document.createElement('button');
  menuButton.textContent = 'Menu';
  menuButton.classList.add('menu-button');

  const dropdown = document.createElement('div');
  dropdown.classList.add('dropdown-menu');

  const items = [
    { text: 'Profile', href: 'profile.html' },
    { text: 'Settings', href: 'settings.html' }
  ];

  items.forEach(i => {
    const a = document.createElement('a');
    a.textContent = i.text;
    a.href = i.href;
    dropdown.appendChild(a);
  });

  const authSlot = document.createElement('span');
  authSlot.classList.add('auth-slot');
  if (isAuthed()) {
    const u = getUser();
    authSlot.innerHTML = `<span class="hello">Hi, ${u.username}</span> <button id="logoutBtn">Logout</button>`;
  } else {
    authSlot.innerHTML = `<a href="login.html">Login</a> <a href="signup.html">Sign Up</a>`;
  }

  right.appendChild(menuButton);
  right.appendChild(dropdown);
  right.appendChild(authSlot);

  menuButton.addEventListener('click', (event) => {
    event.stopPropagation();
    dropdown.classList.toggle('show');
  });
  document.addEventListener('click', (event) => {
    if (!navbar.contains(event.target)) dropdown.classList.remove('show');
  });

  navbar.appendChild(left);
  navbar.appendChild(right);
  return navbar;
}

function addNavbar() {
  const body = document.body;
  const navbar = createNavbar();
  body.insertBefore(navbar, body.firstChild);
  const btn = document.getElementById("logoutBtn");
  if (btn) btn.onclick = () => { logout(); location.reload(); };
}

export default addNavbar;

function createNavbar() {
    const navbar = document.createElement('nav');
    navbar.classList.add('navbar');

    const left = document.createElement('div');
    left.classList.add('navbar-left');
    const logo = document.createElement('a');
    logo.textContent = 'TanoScene';
    logo.href = 'index.html';   //Link to Home Page
    left.appendChild(logo);

    const right = document.createElement('div');
    right.classList.add('navbar-right');
    const menuButton = document.createElement('button');
    menuButton.textContent = 'Menu';
    menuButton.classList.add('menu-button');

    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown-menu');

    const menuItems = [
        { text: 'Sign Up / Login', href: 'signup.html' },
        { text: 'Profile', href: 'profile.html' },
        { text: 'Settings', href: 'settings.html' },
        { text: 'FAQ', href: 'faq.html' },
        { text: 'About', href: 'about.html' }
    ];

    menuItems.forEach(item => {
        const menuItem = document.createElement('a');
        menuItem.textContent = item.text;
        menuItem.href = item.href;
        dropdown.appendChild(menuItem);
    });

    right.appendChild(menuButton);
    right.appendChild(dropdown);

    menuButton.addEventListener('click', () => {    //Toggle dropdown on menu button click
        event.stopPropagation(); //This prevents triggering the document click
        dropdown.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
        if (!navbar.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });

    navbar.appendChild(left);
    navbar.appendChild(right);

    return navbar;
}

function addNavbar() {
    console.log("addNavbar executed!"); //debug
    const body = document.body;
    const navbar = createNavbar();
    body.insertBefore(navbar, body.firstChild);
}

export default addNavbar;
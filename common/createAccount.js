var axios = require('axios');
parameters = new URLSearchParams(document.location.search);

username = parameters.get("username");
line1 = document.getElementById("lineOne");
line1.innerHTML = line1.innerHTML + username;

email = parameters.get("email");
line2 = document.getElementById("lineTwo");
line2.innerHTML = line2.innerHTML + email;

refCode = parameters.get("referral Code");
if (refCode == ""){
    line3 = document.getElementById("lineThree");
    line3.style.display = "none";
}
else{
    line3 = document.getElementById("lineThree");
    line3.innerHTML = line3.innerHTML + refCode + " (free meal)";
}

password = parameters.get("Password");
line4 = document.getElementById("lineFour");
line4.innerHTML = line4.innerHTML + password;

axios.post('https://jsonplaceholder.typicode.com/posts', {
    username: 'Test title',
    email: 'Test body',
    password: 'huh',
})
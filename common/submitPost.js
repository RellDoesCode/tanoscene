var axios = require('axios');

const post = document.getElementById("createPost")

post.addEventListener('submit', function createPost(event){
    event.preventDefault

    const postFormData = new FormData(post);
    console.log(postFormData);
})
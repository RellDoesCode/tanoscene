export function renderPosts(container, posts) {
    if (!container || !Array.isArray(posts)) {
        console.error("Invalid container or posts array");
        return;
    }

    container.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        // Create post header
        const postHeader = document.createElement('div');
        postHeader.classList.add('post-header');

        const usernameSpan = document.createElement('span');
        usernameSpan.classList.add('username');
        usernameSpan.textContent = post.username;

        const dateSpan = document.createElement('span');
        dateSpan.classList.add('date');
        dateSpan.textContent = post.date;

        // Header wrapper with avatar if present
        let headerWrapper;
        if (post.avatar) {
            const avatarImg = document.createElement('img');
            avatarImg.src = post.avatar;
            avatarImg.alt = `${post.username}'s avatar`;
            avatarImg.style.width = '50px';
            avatarImg.style.height = '50px';
            avatarImg.style.borderRadius = '50%';
            avatarImg.style.objectFit = 'cover';
            avatarImg.style.marginRight = '10px';

            headerWrapper = document.createElement('div');
            headerWrapper.style.display = 'flex';
            headerWrapper.style.alignItems = 'center';

            const textWrapper = document.createElement('div');
            textWrapper.style.display = 'flex';
            textWrapper.style.flexDirection = 'column';
            textWrapper.appendChild(usernameSpan);
            textWrapper.appendChild(dateSpan);

            headerWrapper.appendChild(avatarImg);
            headerWrapper.appendChild(textWrapper);
        } else {
            headerWrapper = postHeader;
            postHeader.appendChild(usernameSpan);
            postHeader.appendChild(dateSpan);
        }

        // Post content
        const postContent = document.createElement('div');
        postContent.classList.add('post-content');
        postContent.textContent = post.content;

        // Assemble post
        postDiv.appendChild(headerWrapper);
        postDiv.appendChild(postContent);

        container.appendChild(postDiv);
    });
}

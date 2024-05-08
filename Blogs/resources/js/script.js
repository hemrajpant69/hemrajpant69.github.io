document.addEventListener('DOMContentLoaded', function() {
    const blogPostsContainer = document.getElementById('blog-posts');

    // Fetch blog data from JSON file or initialize if not available
    let blogData = JSON.parse(localStorage.getItem('blogData'));
    if (!blogData) {
        blogData = {
            posts: []
        };
    }

    // Render blog posts
    blogData.posts.forEach((post, postIndex) => {
        const card = createCard(post, postIndex);
        blogPostsContainer.appendChild(card);
    });

    // Update likes
    document.querySelectorAll('.like-btn').forEach((button, index) => {
        button.addEventListener('click', function() {
            const userName = prompt('Enter your name:');
            if (userName) {
                const userLikedIndex = blogData.posts[index].likes.findIndex(like => like.name === userName);
                if (userLikedIndex === -1) {
                    blogData.posts[index].likes.push({ name: userName });
                } else {
                    blogData.posts[index].likes.splice(userLikedIndex, 1); // Remove like
                }
                updateLocalStorage(blogData);
                renderLikes(blogData.posts[index].likes, button.parentElement.querySelector('.likes'));
                renderLikesDropdown(blogData.posts[index].likes, button.parentElement.querySelector('.like-dropdown'));
                animateLike(button);
            }
        });
    });

    // Add reply functionality
    document.querySelectorAll('.reply-btn').forEach((button, postIndex) => {
        button.addEventListener('click', function() {
            const userName = prompt('Enter your name:');
            if (userName) {
                const input = button.parentElement.querySelector('.reply-input');
                input.style.display = 'block';
                input.focus();
                input.dataset.postIndex = postIndex;
                input.dataset.parentCommentIndex = button.dataset.commentIndex;
            }
        });
    });

    // Add event listener for reply input
    document.querySelectorAll('.reply-input').forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                const postIndex = parseInt(input.dataset.postIndex);
                const parentCommentIndex = parseInt(input.dataset.parentCommentIndex);
                const userName = prompt('Enter your name:');
                if (userName) {
                    const comment = input.value.trim();
                    if (comment !== '') {
                        if (!blogData.posts[postIndex].comments[parentCommentIndex].replies) {
                            blogData.posts[postIndex].comments[parentCommentIndex].replies = [];
                        }
                        blogData.posts[postIndex].comments[parentCommentIndex].replies.push({ name: userName, text: comment });
                        updateLocalStorage(blogData);
                        renderReplies(blogData.posts[postIndex].comments[parentCommentIndex].replies, input.parentElement.querySelector('.replies'));
                        input.value = '';
                    }
                }
                input.style.display = 'none';
            }
        });
    });

    // Add comment functionality
    document.querySelectorAll('.comment-btn').forEach((button, postIndex) => {
        button.addEventListener('click', function() {
            const userName = prompt('Enter your name:');
            if (userName) {
                const input = button.parentElement.querySelector('.comment-input');
                const comment = input.value.trim();
                if (comment !== '') {
                    if (!blogData.posts[postIndex].comments) {
                        blogData.posts[postIndex].comments = [];
                    }
                    blogData.posts[postIndex].comments.push({ name: userName, text: comment });
                    updateLocalStorage(blogData);
                    renderComments(blogData.posts[postIndex].comments, input.parentElement.querySelector('.comments'));
                    input.value = '';
                }
            }
        });
    });

});

// Function to create a card for each blog post
function createCard(post, postIndex) {
    const card = document.createElement('div');
    card.classList.add('card', 'mb-3');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = post.title;

    // Add image component
    const image = document.createElement('img');
    image.classList.add('card-img-top');
    image.src = post.imageSrc; // Replace 'post.imageSrc' with the image source from your data
    image.alt = ' image';

    const description = document.createElement('p');
    description.classList.add('card-text', 'description');
    const shortDescription = post.description.substring(0, 30) + '...';
    description.innerHTML = shortDescription;

    const readMoreLink = document.createElement('a');
    readMoreLink.href = '#';
    readMoreLink.classList.add('btn', 'btn-primary', 'read-more');
    readMoreLink.textContent = 'Read More';
    readMoreLink.addEventListener('click', function() {
        if (description.innerHTML === shortDescription) {
            description.innerHTML = post.description;
            readMoreLink.textContent = 'Read Less';
        } else {
            description.innerHTML = shortDescription;
            readMoreLink.textContent = 'Read More';
        }
    });

    const likesCount = document.createElement('span');
    likesCount.classList.add('badge', 'bg-primary', 'me-2', 'likes');
    renderLikes(post.likes, likesCount);

    const likeBtn = document.createElement('button');
    likeBtn.classList.add('btn', 'btn-primary', 'like-btn', 'me-2');
    likeBtn.innerHTML = '<i class="far fa-thumbs-up"></i>';
    likeBtn.setAttribute('aria-label', 'Like');
    likeBtn.dataset.bsToggle = 'dropdown';
    likeBtn.dataset.bsTarget = `#likeDropdown${postIndex}`;

    const likeDropdown = document.createElement('div');
    likeDropdown.classList.add('dropdown-menu', 'like-dropdown');
    likeDropdown.id = `likeDropdown${postIndex}`;
    renderLikesDropdown(post.likes, likeDropdown);

    const commentInput = document.createElement('input');
    commentInput.classList.add('form-control', 'me-2', 'comment-input');
    commentInput.type = 'text';
    commentInput.placeholder = 'Add a comment...';

    const commentBtn = document.createElement('button');
    commentBtn.classList.add('btn', 'btn-secondary', 'comment-btn');
    commentBtn.textContent = 'Comment';

    const commentsContainer = document.createElement('div');
    commentsContainer.classList.add('comments');
    renderComments(post.comments, commentsContainer);

    cardBody.appendChild(title);
    cardBody.appendChild(image); // Append image to the card body
    cardBody.appendChild(description);
    cardBody.appendChild(readMoreLink);
    cardBody.appendChild(document.createElement('br'));
    if (post.description.length > 30) {
        cardBody.appendChild(document.createElement('br')); // Add space if "Read More" button is present
    }
    cardBody.appendChild(likesCount);
    cardBody.appendChild(likeBtn);
    cardBody.appendChild(likeDropdown);
    cardBody.appendChild(document.createElement('br'));
    cardBody.appendChild(commentInput);
    cardBody.appendChild(commentBtn);
    cardBody.appendChild(commentsContainer);
    card.appendChild(cardBody);

    return card;
}



// Function to render likes
function renderLikes(likes, container) {
    container.textContent = `Likes: ${likes.length}`;
}

// Function to render likes dropdown
function renderLikesDropdown(likes, dropdown) {
    dropdown.innerHTML = ''; // Clear previous likes
    likes.forEach(like => {
        const listItem = document.createElement('li');
        listItem.textContent = like.name;
        dropdown.appendChild(listItem);
    });
}

// Function to render comments
function renderComments(comments, container) {
    container.innerHTML = ''; // Clear previous comments
    const maxCommentsToShow = 2;
    for (let i = 0; i < Math.min(comments.length, maxCommentsToShow); i++) {
        const comment = comments[i];
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <p class="comment-text">${comment.name}: ${comment.text}</p>
            <div class="comment-controls">
                <button class="btn btn-sm btn-outline-primary reply-btn" data-comment-index="${i}">Reply</button>
                <input type="text" class="form-control reply-input" style="display: none;" placeholder="Reply to ${comment.name}...">
                <div class="replies"></div>
            </div>
        `;
        container.appendChild(commentElement);
    }

    if (comments.length > maxCommentsToShow) {
        const seeMoreBtn = document.createElement('button');
        seeMoreBtn.classList.add('btn', 'btn-link', 'see-more-comments');
        seeMoreBtn.textContent = 'See more comments';
        seeMoreBtn.addEventListener('click', function() {
            renderAllComments(comments, container);
            seeMoreBtn.style.display = 'none';
            seeLessBtn.style.display = 'inline';
        });
        container.appendChild(seeMoreBtn);
    }
}

// Function to render all comments
function renderAllComments(comments, container) {
    container.innerHTML = ''; // Clear container
    comments.forEach((comment, commentIndex) => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <p class="comment-text">${comment.name}: ${comment.text}</p>
            <div class="comment-controls">
                <button class="btn btn-sm btn-outline-primary reply-btn" data-comment-index="${commentIndex}">Reply</button>
                <input type="text" class="form-control reply-input" style="display: none;" placeholder="Reply to ${comment.name}...">
                <div class="replies"></div>
            </div>
        `;
        container.appendChild(commentElement);
    });
}

// Function to render replies
function renderReplies(replies, container) {
    container.innerHTML = ''; // Clear previous replies
    replies.forEach(reply => {
        const replyElement = document.createElement('div');
        replyElement.classList.add('reply');
        replyElement.innerHTML = `<p class="reply-text">${reply.name}: ${reply.text}</p>`;
        container.appendChild(replyElement);
    });
}

// Function to animate like button
function animateLike(button) {
    button.classList.add('animate__animated', 'animate__rubberBand');
    setTimeout(() => {
        button.classList.remove('animate__animated', 'animate__rubberBand');
    }, 1000);
}

// Function to update localStorage with the latest blog data
function updateLocalStorage(data) {
    localStorage.setItem('blogData', JSON.stringify(data));
}

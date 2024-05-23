document.addEventListener('DOMContentLoaded', function() {
    const blogPostsContainer = document.getElementById('blog-posts');

    // Fetch blog data from JSON file
    fetch('resources/json/blogData.json')
        .then(response => response.json())
        .then(data => {
            renderBlogPosts(data.posts);
        });

    // Function to render existing blog posts
    function renderBlogPosts(posts) {
        blogPostsContainer.innerHTML = ''; // Clear previous posts
        posts.forEach((post, postIndex) => {
            const card = createCard(post, postIndex);
            blogPostsContainer.appendChild(card);
        });
    }

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
        image.src = post.imageSrc;
        image.alt = post.title;

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
        likeBtn.addEventListener('click', function() {
            const userName = prompt('Enter your name:');
            if (userName) {
                const userLikedIndex = post.likes.findIndex(like => like.name === userName);
                if (userLikedIndex === -1) {
                    post.likes.push({ name: userName });
                } else {
                    post.likes.splice(userLikedIndex, 1); // Remove like
                }
                renderLikes(post.likes, likesCount);
                animateLike(likeBtn);
            }
        });

        const shareBtn = document.createElement('button');
        shareBtn.classList.add('btn', 'btn-primary', 'share-btn', 'me-2');
        shareBtn.innerHTML = '<i class="fas fa-share"></i>';
        shareBtn.setAttribute('aria-label', 'Share');
        shareBtn.addEventListener('click', function() {
            sharePost(post);
        });

        const commentInput = document.createElement('input');
        commentInput.classList.add('form-control', 'me-2', 'comment-input');
        commentInput.type = 'text';
        commentInput.placeholder = 'Add a comment...';

        const commentBtn = document.createElement('button');
        commentBtn.classList.add('btn', 'btn-secondary', 'comment-btn');
        commentBtn.textContent = 'Comment';
        commentBtn.addEventListener('click', function() {
            const userName = prompt('Enter your name:');
            if (userName) {
                const commentText = commentInput.value.trim();
                if (commentText !== '') {
                    post.comments.push({ name: userName, text: commentText });
                    renderComments(post.comments, commentsContainer);
                    commentInput.value = ''; // Clear input field after adding comment
                }
            }
        });

        const commentsContainer = document.createElement('div');
        commentsContainer.classList.add('comments');
        renderComments(post.comments, commentsContainer);

        cardBody.appendChild(title);
        cardBody.appendChild(image);
        cardBody.appendChild(description);
        cardBody.appendChild(readMoreLink);
        cardBody.appendChild(document.createElement('br'));
        if (post.description.length > 30) {
            cardBody.appendChild(document.createElement('br'));
        }
        cardBody.appendChild(likesCount);
        cardBody.appendChild(likeBtn);
        cardBody.appendChild(shareBtn);
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

    // Function to render comments
    function renderComments(comments, container) {
        container.innerHTML = '';
        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');
            commentElement.innerHTML = `<p class="comment-text">${comment.name}: ${comment.text}</p>`;
            container.appendChild(commentElement);
        });
    }

    // Function to animate like button
    function animateLike(button) {
        button.classList.add('animate__animated', 'animate__rubberBand');
        setTimeout(() => {
            button.classList.remove('animate__animated', 'animate__rubberBand');
        }, 1000);
    }

    // Function to share post
    function sharePost(post) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(post.title);
        const description = encodeURIComponent(post.description);
        const image = encodeURIComponent(post.imageSrc);

        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&title=${title}&description=${description}&picture=${image}`;
        const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}`;

        // Open share dialogs
        window.open(facebookUrl, '_blank');
        window.open(twitterUrl, '_blank');
        window.open(linkedInUrl, '_blank');
    }
});

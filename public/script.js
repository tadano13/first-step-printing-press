// public/script.js

document.addEventListener('DOMContentLoaded', () => {
    
    feather.replace();

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- Flip Card for Touch Devices ---
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });
    });

    // --- Instagram Feed ---
    const feedContainer = document.getElementById('instagram-feed');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const loadingMessage = document.getElementById('feed-loading-message');
    let nextPaginationToken = null;

    async function fetchInstagramPosts(token = null) {
        if(token) {
            loadMoreBtn.textContent = 'Loading...';
            loadMoreBtn.disabled = true;
        }

        try {
            let apiUrl = '/api/instagram';
            if (token) {
                apiUrl += `?token=${token}`;
            }
            
            const response = await fetch(apiUrl);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            displayPosts(data.posts); 
            nextPaginationToken = data.nextToken;

            if (nextPaginationToken) {
                loadMoreBtn.classList.remove('hidden');
                loadMoreBtn.textContent = 'Load More';
                loadMoreBtn.disabled = false;
            } else {
                loadMoreBtn.classList.add('hidden');
            }

        } catch (error) {
            console.error('Error fetching Instagram posts:', error);
            if (!token) {
                feedContainer.innerHTML = `<p class="text-red-500 col-span-full">Could not load Instagram feed. ${error.message}</p>`;
            }
            loadMoreBtn.classList.add('hidden');
        }
    }

    function displayPosts(posts) {
        if (loadingMessage) {
            loadingMessage.remove();
        }
        
        if (!posts || posts.length === 0) {
            if(feedContainer.children.length === 0) {
               feedContainer.innerHTML = '<p class="text-gray-500 col-span-full">No posts to display.</p>';
            }
            return;
        }

        const fragment = document.createDocumentFragment();
        posts.forEach(post => {
            const postLink = document.createElement('a');
            postLink.href = post.permalink;
            postLink.target = '_blank';
            postLink.className = 'relative block overflow-hidden rounded-lg group aspect-square';
            postLink.innerHTML = `
                <img src="${post.media_url}" alt="Instagram Post" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" onerror="this.onerror=null;this.src='https://placehold.co/400x400/2D2E32/77ACC3?text=Image+Not+Found';">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <i data-feather="instagram" class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                </div>
            `;
            fragment.appendChild(postLink);
        });
        
        feedContainer.appendChild(fragment);
        feather.replace(); // Re-initialize icons
    }

    // Event listener for the "Load More" button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            if (nextPaginationToken) {
                fetchInstagramPosts(nextPaginationToken);
            }
        });
    }

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.textContent = 'Sending...';
            formStatus.className = 'text-accent';

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Something went wrong.');
                formStatus.textContent = result.success;
                formStatus.className = 'text-green-500';
                contactForm.reset();
            } catch (error) {
                console.error('Form submission error:', error);
                formStatus.textContent = `Error: ${error.message}`;
                formStatus.className = 'text-red-500';
            }
        });
    }

    // --- Initial Load ---
    fetchInstagramPosts();
});

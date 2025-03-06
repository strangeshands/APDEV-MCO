document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const suggestionsDiv = document.getElementById('searchSuggestions');
    
    if (!searchInput || !suggestionsDiv) {
        console.error('Search elements not found!');
        return;
    }

    let searchTimeout;

    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        const suggestionsDiv = document.getElementById('searchSuggestions');
        
        clearTimeout(searchTimeout);
        suggestionsDiv.innerHTML = '';
        
        if (query.length < 1) {
            suggestionsDiv.style.display = 'none';
            return;
        }

        searchTimeout = setTimeout(async () => {
            try {
                const response = await fetch(`/search/suggestions?q=${encodeURIComponent(query)}`);
                const { tags, authors } = await response.json();
                
                suggestionsDiv.innerHTML = '';
                
                if (tags.length === 0 && authors.length === 0) {
                    suggestionsDiv.style.display = 'none';
                    return;
                }

                // Show tag suggestions
                tags.forEach(tag => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.innerHTML = `
                        <span class="suggestion-type">Tag</span>
                        <span class="suggestion-text">${tag}</span>
                    `;
                    div.onclick = () => {
                        window.location.href = `/?q=${encodeURIComponent(tag)}`;
                    };
                    suggestionsDiv.appendChild(div);
                });

                // Show author suggestions
                authors.forEach(user => {
                    const div = document.createElement('div');
                    div.className = 'suggestion-item';
                    div.innerHTML = `
                        <span class="suggestion-type">User</span>
                        <span class="suggestion-text">@${user.username.replace('@', '')}</span>
                    `;
                    div.onclick = () => {
                        window.location.href = `/profile/${user.username}`;
                    };                    
                    suggestionsDiv.appendChild(div);
                });

                suggestionsDiv.style.display = 'block';
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                suggestionsDiv.style.display = 'none';
            }
        }, 300);
    });
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    const suggestionsDiv = document.getElementById('searchSuggestions');
    if (!e.target.closest('#searchContainer')) {
        suggestionsDiv.style.display = 'none';
    }
});

// Add this at the bottom of the file
document.getElementById('search').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const form = e.target.closest('form');
        if (form) {
            form.submit();
        }
    }
});
document.querySelectorAll('.viewRepliesButton').forEach(button => {
    button.addEventListener('click', function() {
        const nestedComments = this.closest('.nestedCommentsContainer').querySelector('.nestedComments');
        const isHidden = nestedComments.style.display === 'none';
        
        // Toggle the display
        nestedComments.style.display = isHidden ? 'block' : 'none';
        
        // Get the reply count from the current text
        const replyCount = this.textContent.match(/\d+/)[0];
        
        // Update the button text
        this.textContent = isHidden ? `Hide Replies (${replyCount})` : `View Replies (${replyCount})`;
    });
});
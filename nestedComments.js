document.querySelectorAll('.viewRepliesButton').forEach(button => {
     button.addEventListener('click', function() {
         const nestedComments = this.closest('.nestedCommentsContainer').querySelector('.nestedComments');
         nestedComments.style.display = nestedComments.style.display === 'none' ? 'block' : 'none';
     });
 });
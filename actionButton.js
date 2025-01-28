function iconClicked(button, iconType) {
     // Get the image within the button
     const img = button.querySelector('img');
     
     // Get the counter element if it exists
     const counter = button.querySelector('.counter');

     // Find the parent post or comment
     const post = button.closest('.post, .comment');
     
     // Path for different icon types
     const iconPaths = {
          'heart': {
          default: 'resources/Heart.svg',
          clicked: 'resources/Heart-Clicked.svg'
          },
          'heartCrack': {
          default: 'resources/HeartCrack.svg',
          clicked: 'resources/HeartCrack-Clicked.svg'
          },
          'bookmark': {
          default: 'resources/Bookmark.svg',
          clicked: 'resources/Bookmark-Clicked.svg'
          }
     };

     if (iconType === 'heart' || iconType === 'heartCrack') {
          // Find like and dislike buttons
          const likeButton = post.querySelector('.actionButton img[src*="Heart"]').closest('.actionButton');
          const dislikeButton = post.querySelector('.actionButton img[src*="HeartCrack"]').closest('.actionButton');
          
          // Get like and dislike counters
          const likeCounter = likeButton.querySelector('.counter');
          const dislikeCounter = dislikeButton.querySelector('.counter');

          // Determine current button details
          const currentButton = iconType === 'heart' ? likeButton : dislikeButton;
          const otherButton = iconType === 'heart' ? dislikeButton : likeButton;
          const currentImg = currentButton.querySelector('img');
          const otherImg = otherButton.querySelector('img');
          const currentCounter = iconType === 'heart' ? likeCounter : dislikeCounter;
          const otherCounter = iconType === 'heart' ? dislikeCounter : likeCounter;

          // Normalize the current image's src path to ensure comparison works
          const currentSrc = currentImg.src.split('/').pop(); // Extract only the filename
          const isCurrentlyClicked = currentSrc === iconPaths[iconType].clicked.split('/').pop();

          // Check the other button's state
          const otherSrc = otherImg.src.split('/').pop();
          const isOtherClicked = otherSrc === iconPaths[iconType === 'heart' ? 'heartCrack' : 'heart'].clicked.split('/').pop();

          // Toggle current button state
          if (isCurrentlyClicked) {
               // If already clicked, reset (unlike/undislike)
               currentImg.src = iconPaths[iconType].default;
               currentCounter.textContent = Math.max(0, parseInt(currentCounter.textContent) - 1);
          } else {
               // If not clicked, set current button to clicked state
               currentImg.src = iconPaths[iconType].clicked;
               currentCounter.textContent = parseInt(currentCounter.textContent) + 1;

               // If the other button was clicked, reset it
               if (isOtherClicked) {
                    otherImg.src = iconPaths[iconType === 'heart' ? 'heartCrack' : 'heart'].default;
                    otherCounter.textContent = Math.max(0, parseInt(otherCounter.textContent) - 1);
               }
          }
     } else if (iconType === 'bookmark') {
          // Bookmark button logic
          const currentSrc = img.src.split('/').pop(); // Extract only the filename
          const isCurrentlyBookmarked = currentSrc === iconPaths.bookmark.clicked.split('/').pop();

          // Toggle bookmark state
          if (isCurrentlyBookmarked) {
               img.src = iconPaths.bookmark.default;
          } else {
               img.src = iconPaths.bookmark.clicked;
          }
     }
}

// Add event listeners to all action buttons
document.addEventListener('DOMContentLoaded', () => {
     document.querySelectorAll('.actionButton').forEach(button => {
          button.addEventListener('click', function() {
          const img = this.querySelector('img');
          if (img.src.includes('Heart.svg') || img.src.includes('Heart-Clicked.svg')) {
               iconClicked(this, 'heart');
          } else if (img.src.includes('HeartCrack.svg') || img.src.includes('HeartCrack-Clicked.svg')) {
               iconClicked(this, 'heartCrack');
          } else if (img.src.includes('Bookmark.svg') || img.src.includes('Bookmark-Clicked.svg')) {
               iconClicked(this, 'bookmark');
          }
          });
     });
});
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.actionButton').forEach(button => {
         button.addEventListener('click', function () {
              const id = this.id; 
              iconClicked(this, id);
              console.log(id);
         });
    });
});

function iconClicked(button, iconType) {
    // Get the image within the button
    const img = button.querySelector('img');

    // Get the counter element if it exists
    const counter = button.querySelector('.counter');

    // Find the parent post or comment
    const post = button.closest('.postActions, .nestedComments, .comment');
    
    // Path for different icon types
    const iconPaths = {
         'heart': {
         default: '../resources/Heart.svg',
         clicked: '../resources/Heart-Clicked.svg'
         },
         'heartCrack': {
         default: '../resources/HeartCrack.svg',
         clicked: '../resources/HeartCrack-Clicked.svg'
         },
         'bookmark': {
         default: '../resources/Bookmark.svg',
         clicked: '../resources/Bookmark-Clicked.svg'
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

// Get modal elements
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const captionText = document.getElementById("caption");
const closeBtn = document.getElementsByClassName("close")[0];

// Function to open modal
function openModal(imgElement) {
  modal.style.display = "block";
  modalImg.src = imgElement.src;
  captionText.innerHTML = imgElement.alt || "";
}

// Close modal when clicking (X)
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// Close modal when clicking outside the image
modal.onclick = function(event) {
  if (event.target === modal) {
      modal.style.display = "none";
  }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === "Escape" && modal.style.display === "block") {
      modal.style.display = "none";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const storedReply = localStorage.getItem('selectedReply');
  if (storedReply) {
  const replyContentDiv = document.getElementById('textContent');
  if (replyContentDiv) {
      replyContentDiv.textContent = storedReply;
  }
  localStorage.removeItem('selectedReply');
  }
});
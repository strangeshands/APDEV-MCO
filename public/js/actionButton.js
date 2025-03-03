/**
 *   iconCliked manages the visuals and connection to backend whenever an action
 *        button is cliked
 * 
 *   @param {*} button The button item clicked
 *   @param {*} iconType The icon type (heart, hreat crack, bookmark)
 *   @param {*} postId  The postId attached to the button
 */
function iconClicked(button, iconType, postId) {    
     console.log(postId);

     // Get the image within the button
     const img = button.querySelector('img');

     // Get the counter element if it exists
     const counter = button.querySelector('.counter');

     // Find the parent post or comment
     const post = button.closest('.post, .postActions, .nestedComments, .comment');
     
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
               // ----- Visual ----- //
               // If already clicked, reset (unlike/undislike)
               currentImg.src = iconPaths[iconType].default;
               currentCounter.textContent = Math.max(0, parseInt(currentCounter.textContent) - 1);

               // ----- Connection to Node ----- //
               let action;
               if (iconType === 'heart')
                    action = 'unlike';
               else 
                    action = 'undislike';

               fetch('/update-like', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                         postId: postId,
                         action: action
                    })
                    })
               .then(response => response.json());
          } else {
               // If not clicked, set current button to clicked state
               currentImg.src = iconPaths[iconType].clicked;
               currentCounter.textContent = parseInt(currentCounter.textContent) + 1;

               // If the other button was clicked, reset it
               if (isOtherClicked) {
                    otherImg.src = iconPaths[iconType === 'heart' ? 'heartCrack' : 'heart'].default;
                    otherCounter.textContent = Math.max(0, parseInt(otherCounter.textContent) - 1);
               }

               let action;
               if (iconType === 'heart') {
                    action = 'like';
                    
                    if (isOtherClicked)
                         action = 'like+'
               }
               else if (iconType === 'heartCrack') {
                    action = 'dislike';

                    if (isOtherClicked)
                         action = 'dislike+'
               }

               fetch('/update-like', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                         postId: postId,
                         activeUserDetails,
                         action: action
                    })
                    })
               .then(response => response.json());
          }
     } else if (iconType === 'bookmark') {

          // ----- Visual ----- //
          // Bookmark button logic
          const currentSrc = img.src.split('/').pop(); // Extract only the filename
          const isCurrentlyBookmarked = currentSrc === iconPaths.bookmark.clicked.split('/').pop();

          // Toggle bookmark state
          if (isCurrentlyBookmarked) {
               img.src = iconPaths.bookmark.default;
          } else {
               img.src = iconPaths.bookmark.clicked;
          }

          // ----- Connection to Node ----- //
          fetch('/update-bookmark', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                   postId: postId,
                   activeUserDetails,
                   action: isCurrentlyBookmarked ? 'remove' : 'add'
               })
          })
          .then(response => response.json());
     }
}

/**
 * Checks if a post is liked
 */
function checkLiked(check) {
     if (activeLikes)
          return activeLikes.some(post => post._id === check._id);
     else
          return false;
 }
 
 /**
  * Checks if a post is bookmarked
  */
 function checkBookmarked(check) {
     if (activeBookmarks)
          return activeBookmarks.some(post => post._id === check._id);
     else 
          return false;
 }
 
 /**
  * Checks if a post is disliked
  */
 function checkDisliked(check) {
     if (activeDislikes)
          return activeDislikes.some(post => post._id === check._id);
     else
          return false;
 }
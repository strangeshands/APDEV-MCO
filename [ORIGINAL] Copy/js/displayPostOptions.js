const showPopupButtons = document.querySelectorAll('.optionsButton');
const hidePopupButtons = document.querySelectorAll('.activeOptionsButton');

showPopupButtons.forEach(button => {
     button.addEventListener('click', function() {
          console.log('Button clicked'); // Debugging line
          
          const popUpId = button.getAttribute('post-options-id');
          const popUpDiv = document.getElementById(popUpId);
          popUpDiv.style.display = 'block';

          // Increment the popUpCount
          const postId = button.closest('.post').id;  // Get the post ID (e.g., post1)
          const post = userPosts.find(post => post.id === postId);
          post.popUpCount += 1;
     });
});

hidePopupButtons.forEach(button => {
     button.addEventListener('click', function() {
          const popUpId = button.getAttribute('post-options-id');     
          const popUpDiv = document.getElementById(popUpId);
          popUpDiv.style.display = 'none';
     });
});


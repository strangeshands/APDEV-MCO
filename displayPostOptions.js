console.log('JavaScript file loaded');

const showPopupButtons = document.querySelectorAll('.optionsButton');
const hidePopupButtons = document.querySelectorAll('.activeOptionsButton');

showPopupButtons.forEach(button => {
     button.addEventListener('click', function() {
          console.log('Button clicked'); // Debugging line
          const popUpId = button.getAttribute('post-options-id');
          const popUpDiv = document.getElementById(popUpId);
          popUpDiv.style.display = 'block';
     });
});

hidePopupButtons.forEach(button => {
     button.addEventListener('click', function() {
          const popUpId = button.getAttribute('post-options-id');     
          const popUpDiv = document.getElementById(popUpId);
          popUpDiv.style.display = 'none';
     });
});


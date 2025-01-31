const showPopupButtons = document.querySelectorAll('.optionsButton');
const hidePopupButtons = document.querySelectorAll('.activeOptionsButton');

showPopupButtons.forEach(button => {
     const popUpId = button.getAttribute('post-options-id');
     const popUpDiv = document.getElementById(popUpId);

     button.addEventListener('click', function() {
          popUpDiv.style.display = 'block';
     });
});

hidePopupButtons.forEach(button => {
     const popUpId = button.getAttribute('post-options-id');
     const popUpDiv = document.getElementById(popUpId);

     button.addEventListener('click', function() {
          popUpDiv.style.display = 'none';
     });
});


/* --- OPTION POP UP --- */
let activePopup = null;

function togglePopup(contentType, postId, containerId) {
    console.log(`Menu clicked on post ${postId} in ${containerId}`);
     
    const popup = document.getElementById(`${contentType}-popup-${postId}`);
    const container = document.getElementById(containerId); 
 
    if (!popup.parentElement === container) {
        container.appendChild(popup);
    }

    if (activePopup && activePopup !== popup) {
        activePopup.classList.remove('show');
    }

    popup.classList.toggle('show');
    if (popup.classList.contains('show')) {
        activePopup = popup;
    } else {
        activePopup = null;
    }
}

document.addEventListener('click', (e) => {
    const optionsButtons = document.querySelectorAll('.optionsButton');
    const popups = document.querySelectorAll('.popUpOptions');

    if (![...optionsButtons].includes(e.target) && !e.target.closest('.popUpOptions') && !e.target.closest('.optionsButton')) {
        popups.forEach(popup => {
            popup.classList.remove('show');
        });
    }
}); 

/* --- GO TO POST --- */
function goToPost(title, postId) {
    console.log(`Going to post ${postId} -- ${title}`);
    /*window.location.href = 'postPage.html';*/
}
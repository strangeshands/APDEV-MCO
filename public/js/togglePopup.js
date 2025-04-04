/* --- OPTION POP UP --- */
let activePopup = null;

function togglePopup(contentType, postId, containerId) {
    console.log(`Menu clicked on post ${postId} in ${containerId}`);
    let popup = null;
     
    if (contentType != "none") {
        popup = document.getElementById(`${contentType}-popup-${postId}`);
    } else {
        popup = document.getElementById(`popUp${postId}`);
    }
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

/* --- COPY LINK OF POST --- */
function copyLink(postId) {
    const fullUrl = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(fullUrl);
}
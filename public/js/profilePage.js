document.addEventListener("DOMContentLoaded", () => {
     printBio(profileDetails.bio);
     printTags(profileDetails.tags);
});


/* ----- NECESSARY FUNCTIONS ----- */
/**
 *   TO DO: link tags --> edit onclick="" attribute
 */
function printTags (tags) {
    const tagListElement = document.getElementById("taglist");

    if (tags.length === 0) {
         tagListElement.innerHTML = '<p class="regulartext" id="no-tag-msg">No tags available</p>';
    } else {
         tagListElement.innerHTML = tags
              .map(tag => `<button class="usertags" onclick="">${tag}</button>`)
              .join("");
    }
}

function printBio (bio) {
    const bioElement = document.getElementById('bio');

    if (bio.length === 0) {
         bioElement.textContent = "Boring! No bio yet...";
         bioElement.classList.add('no-bio-msg');
    } else {
         bioElement.textContent = bio;
         bioElement.classList.remove('no-bio-msg');
    }
}

function openModal(image) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");

    console.log("Image source:", image.src);
    modal.style.display = "block";
    modalImg.src = image.src;

    modal.onclick = function () {
         modal.style.display = "none";
    };
}

function showContent(tabId, button) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
         content.style.display = 'none';
    });

    const tabButtons = document.querySelectorAll('.tab');
    tabButtons.forEach(tab => {
         tab.classList.remove('active');
    });

    const selectedTabContent = document.getElementById(tabId);
    if (selectedTabContent) {
         selectedTabContent.style.display = 'block';
    }

    button.classList.add('active');
}

document.addEventListener('DOMContentLoaded', (type) => {
    document.querySelectorAll('.actionButton').forEach(button => {
         button.addEventListener('click', function () {
              const id = this.id; 
              iconClicked(this, id);
         });
    });
});
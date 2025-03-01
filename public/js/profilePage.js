/* ----- LISTENER ----- */
document.addEventListener("DOMContentLoaded", () => {
     printBio(profileDetails.bio);
     printTags(profileDetails.tags);

     setButton(activeTab);
});

/* ----- NECESSARY FUNCTIONS ----- */
/**
 *   [TO DO]: link tags --> edit onclick="" attribute
 * 
 *   Prints the profile tags
 * 
 *   @param {*} tags The tags to print
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

/**
 *   Prints the profile bio
 * 
 *   @param {*} bio The bio to print
 */
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

/**
 *   Opens a modal whenever an image is clicked
 * 
 *   @param {*} image The image to open
 */
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

/**
 *   Updates the button depending on the active tab
 * 
 *   @param {*} activeId The active tab
 */
function setButton(activeId) {
     document.querySelectorAll(".tab").forEach(button => {
          if (button.dataset.id === activeId) {
              button.classList.add("active"); 
          } else {
              button.classList.remove("active"); 
          }
      });
}
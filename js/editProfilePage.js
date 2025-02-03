/* ---- LOADER ---- */
document.addEventListener("DOMContentLoaded", () => {
    const headerImage = document.querySelector("#profileHeader img");
    const pfpImage = document.querySelector("#pfpPic img");

    // set images
    headerImage.src = profile1.header;
    pfpImage.src = profile1.pfp;
});

/* ---- BIO COUNTER ---- */
document.addEventListener("DOMContentLoaded", () => {
    const bioTextarea = document.getElementById("bio");
    const feedbackLabel = document.getElementById("bio-feedback");
    const maxCharacters = 100;

    bioTextarea.addEventListener("input", () => {
         let currentText = bioTextarea.value;

         if (currentText.length > maxCharacters) {
              bioTextarea.value = currentText.slice(0, maxCharacters);
         }
         if (currentText.length >= 100) {
              feedbackLabel.style.color = "red";
         } else {
              feedbackLabel.style.color = "white";
         }

         feedbackLabel.textContent = `${bioTextarea.value.length}/${maxCharacters}`;
    });
});

const changeHeaderBtn = document.getElementById("change-header");
const changeProfilePicBtn = document.getElementById("change-pfp");
const imageInput = document.getElementById("image-input");
const cropModal = document.getElementById("crop-modal");
const cropImage = document.getElementById("crop-image");
const cropSaveBtn = document.getElementById("crop-save-btn");
const cropCancelBtn = document.getElementById("crop-cancel-btn");

let currentContext = "";
let cropper;

changeHeaderBtn.addEventListener("click", () => {
    currentContext = "header";
    imageInput.click(); 
});

changeProfilePicBtn.addEventListener("click", () => {
    currentContext = "profile";
    imageInput.click(); 
});

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
         const reader = new FileReader();
         reader.onload = () => {
              cropImage.src = reader.result;
              cropModal.style.display = "block"; 

              // Initialize or replace Cropper.js
              if (cropper) cropper.destroy();
              cropper = new Cropper(cropImage, {
                   aspectRatio: currentContext === "profile" ? 1 : 850 / 210,
                   viewMode: 1,
                   autoCropArea: 1,
              });
         };
         reader.readAsDataURL(file);
    }
});

/* ---- SAVE CROPPED IMAGE ---- */
cropSaveBtn.addEventListener("click", () => {
const canvas = cropper.getCroppedCanvas({
    width: currentContext === "profile" ? 200 : 1600,
    height: currentContext === "profile" ? 200 : 900,
});

/* ---- CONVERT CROPPED IMAGE TO URL ---- */
const croppedImageURL = canvas.toDataURL("image/png");

/* ---- REPLACE HEADER OR PROFILE PICTURE WITH THE CROPPED IMAGE ---- */
if (currentContext === "profile") {
    const pfpImage = document.querySelector("#pfpPic img");
    pfpImage.src = croppedImageURL; 

    // Update profile1
    profile1.pfp = croppedImageURL; 
} else if (currentContext === "header") {
    const headerImage = document.querySelector("#profileHeader img");
    headerImage.src = croppedImageURL; 

    // Update profile1
    profile1.header = croppedImageURL; 
}

/* ---- CLOSE MODAL ---- */
cropModal.style.display = "none";
    cropper.destroy();
    cropper = null;
    imageInput.value = "";
});

/* ---- CANCEL CROPPING ---- */
cropCancelBtn.addEventListener("click", () => {
    cropModal.style.display = "none";
    cropper.destroy();
    cropper = null;
    imageInput.value = "";
});
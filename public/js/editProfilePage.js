const headerImage = document.querySelector("#profileHeader img");
const pfpImage = document.querySelector("#pfpPic img");
const usernameholder = document.getElementById("username");
const displaynameholder = document.getElementById("display-name");
const bioholder = document.getElementById("bio");
const emailholder = document.getElementById("email");
const numholder = document.getElementById("tel-number");

window.onload = function() {
    document.getElementById('bio-feedback').textContent = '';
};

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
              change = false;
         } else {
              feedbackLabel.style.color = "white";
              change = true;
         }

         feedbackLabel.textContent = `${bioTextarea.value.length}/${maxCharacters}`;
    });
});

/* ---- CROPPER ---- */
const changeHeaderBtn = document.getElementById("change-header");
const changeProfilePicBtn = document.getElementById("change-pfp");
const imageInput = document.getElementById("image-input");
const cropModal = document.getElementById("crop-modal");
const cropImage = document.getElementById("crop-image");
const cropSaveBtn = document.getElementById("crop-save-btn");
const cropCancelBtn = document.getElementById("crop-cancel-btn");

let currentContext = "";
let cropper;

function imageChange(button) {
    if (button.id === "change-pfp") {
        currentContext = "profile";
    } else if (button.id === "change-header") {
        currentContext = "header";
    }

    const imageInput = document.getElementById("image-input");
    if (imageInput) {
        imageInput.click(); 
    }
}

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    console.log("File selected:", file);
    if (file) {
        const allowedTypes = ["image/jpeg", "image/png"];
        const isValidType = allowedTypes.includes(file.type);

        if (!isValidType) {
            alert("Invalid file type. Only JPG and PNG are allowed.");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            cropImage.src = reader.result;
            console.log("Opening crop modal...");
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
    const canvas = cropper.getCroppedCanvas({
        width: 200,
        height: 200,
    });

    canvas.toBlob((blob) => {
        if (!blob) 
            return;
        
        const formData = new FormData();
        formData.append("profilePic", blob, "cropped-image.png");

        fetch('/upload-profilepic', {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log("Image uploaded successfully:", data);
            cropModal.style.display = "none";
        })
        .catch((error) => {
            console.error("Upload failed:", error);
        });
    }, "image/png");

    pfpImage.src = croppedImageURL;
} else if (currentContext === "header") {    
    const canvas = cropper.getCroppedCanvas({
        width: 1600,
        height: 900,
    });

    canvas.toBlob((blob) => {
        if (!blob) return;
        
        const formData = new FormData();
        formData.append("headerPic", blob, "cropped-image.png");

        fetch(`/upload-headerpic`, {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log("Image uploaded successfully:", data);
            cropModal.style.display = "none";
        })
        .catch((error) => {
            console.error("Upload failed:", error);
        });
    }, "image/png");

    headerImage.src = croppedImageURL; 
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

// ----- EDIT PROFILE DETIALS ----- //

/**
 *  [DONE/DEBUGGED] allows saving of user details
 */
function saveUserDetails() {
    var change = true;

    const newUser = document.getElementById('username').value;
    const newDisplayName = document.getElementById('display-name').value;
    const newBio = document.getElementById('bio').value;

    /*if (newUser === activeUserDetails.username) {
        document.getElementById('username-feedback').textContent = "This is already your username.";
        change = false;
    }
    if (newDisplayName === activeUserDetails.displayname) {
        document.getElementById('dn-feedback').textContent = "This is already your display name.";
        change = false;
    }
    if (newBio === activeUserDetails.bio) {
        document.getElementById('bio-feedback').textContent = "This is already your bio.";
        change = false;
    }*/

    if (change) {
        /**
         *  [MCO P3]
         *  > remove activeUserDetails in the body
         */
        fetch(`/edit-profile/${activeUserDetails.username}/update-user-details`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                newUser, 
                newDisplayName,
                newBio,

                activeUserDetails
            })
        })
        .then(response => response.json())
        .then(data => {
            // This should reload the page if the username is changed
            if (data.newUserChanged) {
                activeUserDetails.username = data.newUser;
                window.location.href = `/edit-profile/${activeUserDetails.username}`;
            }

            document.getElementById('username-feedback').textContent = data.errorMessageUser;
            document.getElementById('dn-feedback').textContent = data.errorMessageDN;
            document.getElementById('bio-feedback').textContent = data.errorMessageBio;
            document.getElementById('save-changes-feedback').textContent = data.errorMessageButton;
        });
    }
}

/**
 *  [DONE/DEBUGGED] allows saving of account information
 */
function saveAccountInfo() {
    var change = true;
    
    var newEmail = document.getElementById('email').value;
    var newNum = document.getElementById('tel-number').value;
    newNum = newNum.replace(/\s+/g, '');

    if (newEmail === activeUserDetails.email) {
        document.getElementById('email-feedback').textContent = "This is already your registered email.";
        document.getElementById('update-acc-feedback').textContent = "Please check your entries.";
        change = false;
    }
    const phoneClean = activeUserDetails.phone.replace(/\s+/g, '');
    if (newNum === phoneClean) {
        document.getElementById('tel-feedback').textContent = "This is already your registered phone number.";
        document.getElementById('update-acc-feedback').textContent = "Please check your entries.";
        change = false;
    }

    if (change) {
        newNum = newNum.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");

        /**
         *  [MCO P3]
         *  > remove activeUserDetails in the body
         */
        fetch(`/edit-profile/${activeUserDetails.username}/update-acc-info`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                newEmail, 
                newNum,

                activeUserDetails
            })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('email-feedback').textContent = data.errorMessageEmail;
            document.getElementById('tel-feedback').textContent = data.errorMessageNum;
            document.getElementById('update-acc-feedback').textContent = data.errorMessageAccInfoButton;
        });
    }
}

/**
 *  [DONE/DEBUGGED] allows changing of passwords
 */
function changePassword() {
    var currentPass = document.getElementById('curr-password').value;
    var newPass = document.getElementById('password').value;
    var repeatPass = document.getElementById('confirm-password').value;

    let change = true;

    if (currentPass != activeUserDetails.password) {
        console.log(activeUserDetails.password);
        console.log(currentPass);
        document.getElementById('update-pw-feedback').textContent = "Your entry does not match your current password.";
        change = false;
    }

    if (newPass == activeUserDetails.password) {
        console.log(activeUserDetails.password);
        document.getElementById('update-pw-feedback').textContent = "Please choose a different password.";
        change = false;
    }

    if (newPass == repeatPass) {
        document.getElementById('cpw-feedback').textContent = "Your entries do not match.";
        document.getElementById('update-pw-feedback').textContent = "";
        change = false;
    }

    if (change) {
        /**
         *  [MCO P3]
         *  > remove activeUserDetails in the body
         */
        fetch(`/edit-profile/${activeUserDetails.username}/update-acc-info`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                newPass,
                activeUserDetails
            })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('update-pw-feedback').textContent = data.errorMessagePasswordButton;
        });
    }
}
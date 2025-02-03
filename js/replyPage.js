/* ---- REAL-TIME CHAR LIM ---- */
// Select elements
const postTextInput = document.getElementById("postTextInput");
const feedback = document.getElementById("char-counter");

postTextInput.addEventListener("input", function() {
    const currentLength = postTextInput.value.length;
    
    feedback.textContent = `${currentLength}/300`;

    if (currentLength >= 300) {
        feedback.style.color = "red";
    } else {
        feedback.style.color = "white";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("postTextInput").value = "";
});

/* ---- IMAGE UPLOAD ---- */
const imageUploadInput = document.getElementById("imageUploadInput");
const postContentContainer = document.getElementById("replyphotocontainer");
const addImageBtn = document.getElementById("addImageButton");

// We'll store the preview image URLs in this array
let images = [];

// Trigger the hidden file input when "Add Image" is clicked
addImageBtn.addEventListener("click", () => {
    imageUploadInput.click();
});

// Handle file selection
imageUploadInput.addEventListener("change", handleImageUpload);

/* ---- IMAGE UPLOAD ---- */
function handleImageUpload(event) {
    const selectedFiles = Array.from(event.target.files);

    // Limit total images to 4
    selectedFiles.forEach((file) => {
        if (images.length < 4) {
            const imageURL = URL.createObjectURL(file);
            images.push(imageURL);
        }
    });

    renderImages();
}

function removeImage(index) {
    images.splice(index, 1);
    renderImages();
}

/* ---- RENDER IMAGE IN CONTAINER ---- */
function renderImages() {
    // Clear previous previews
    postContentContainer.innerHTML = "";

    // Decide layout based on image count
    if (images.length === 1) {
        postContentContainer.classList.add("single-image");
        postContentContainer.classList.remove("multi-images");
    } else if (images.length > 1) {
        postContentContainer.classList.remove("single-image");
        postContentContainer.classList.add("multi-images");
    } else {
        // No images
        postContentContainer.classList.remove("single-image", "multi-images");
    }

    // Create an element for each image with a remove icon
    images.forEach((url, index) => {
        // Wrap each image + remove icon in a container
        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("imageWrapper");
        
        const img = document.createElement("img");
        img.src = url;

        
        img.classList.add("clickable-image");
        img.setAttribute("onclick", "openModal(this)");
        

        // Create a remove icon for each image
        const removeIcon = document.createElement("span");
        removeIcon.classList.add("remove-image-icon");
        removeIcon.innerHTML = "&times;";
        removeIcon.addEventListener("click", function() {
            
            removeImage(index);
            if (imageContainer.children.length === 0) {
                imageContainer.style.display = 'none';
            }
        });

        // Append them together
        imgWrapper.appendChild(img);
        imgWrapper.appendChild(removeIcon);
        postContentContainer.appendChild(imgWrapper);
    });
}

/* ---- OPEN MODAL ---- */
function openModal(image) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = image.src;

    modal.onclick = function () {
    modal.style.display = "none";
    };
}
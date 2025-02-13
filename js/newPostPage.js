/* ---- REAL-TIME CHAR LIMIT ---- */
const postTextInput = document.getElementById("postTextInput");
const charLim = document.querySelector(".charLim");

postTextInput.addEventListener("input", function() {
    const currentLength = postTextInput.value.length;
    charLim.textContent = `${currentLength}/300`;
});

/* ---- TOGGLE TAG INPUT VISIBILITY ---- */
const addTagButton = document.getElementById("addTagButton");
const tagsContainer = document.getElementById("tagsContainer");

addTagButton.addEventListener("click", function() {
    // Show/hide the tags container
    if (tagsContainer.style.display === "none") {
        tagsContainer.style.display = "block";
    } else {
        tagsContainer.style.display = "none";
    }
});

// Tags as Comma-Separated Chips
let tags = []; // We'll store the final list of tags here.
const tagsInput = document.getElementById("tagsInput");
const tagChips = document.getElementById("tagChips");

/* ---- RENDER TAGS TO CHIPS ---- */
function renderTags() {
    // Clear the chips container
    tagChips.innerHTML = "";

    tags.forEach((tag, index) => {
        // Create a "chip" element
        const chip = document.createElement("div");
        chip.className = "tag-chip";
        chip.innerText = tag;

        // Create a remove icon for each chip
        const removeIcon = document.createElement("span");
        removeIcon.className = "remove-icon";
        removeIcon.innerHTML = "&times;";
        removeIcon.addEventListener("click", () => removeTag(index));

        chip.appendChild(removeIcon);
        tagChips.appendChild(chip);
    });
}

/* ---- REMOVE A TAG ---- */
function removeTag(index) {
    tags.splice(index, 1);
    renderTags();
}

/* ---- COMMA, ENTER, OR BLUR FINALIZES TAG ---- */
tagsInput.addEventListener("keydown", function(event) {
    if (event.key === "," || event.key === "Enter") {
        event.preventDefault();
        addTagFromInput();
    }
});
tagsInput.addEventListener("blur", addTagFromInput);

/* ---- MOVE INPUT TEXT TO TAGS ARRAY ---- */
function addTagFromInput() {
    let newTag = tagsInput.value.trim();
    
    // Remove trailing comma if user typed it
    if (newTag.endsWith(",")) {
        newTag = newTag.slice(0, -1).trim();
    }
    
    // If non-empty, prepend "#" if missing
    if (newTag !== "") {
        if (!newTag.startsWith("#")) {
            newTag = "#" + newTag;
        }
        tags.push(newTag);
        renderTags();
        tagsInput.value = "";
    }
}

/* ---- IMAGE UPLOAD ---- */
const imageUploadInput = document.getElementById("imageUploadInput");
const postContentContainer = document.getElementById("postContentContainer");
const addImageBtn = document.getElementById("addImageButton");

// We'll store the preview image URLs in this array
let images = [];

// Trigger the hidden file input when "Add Image" is clicked
addImageBtn.addEventListener("click", () => {
    imageUploadInput.click();
});

// Handle file selection
imageUploadInput.addEventListener("change", handleImageUpload);

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

/* ---- REMOVE TAG FROM ARRAY ---- */
function removeImage(index) {
    images.splice(index, 1);
    renderImages();
}

/* ---- RENDER IMAGES IN CONTAINER ---- */
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
        removeIcon.addEventListener("click", () => removeImage(index));

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
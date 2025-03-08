// Character counter
const textarea = document.getElementById('postTextInput');
const charCounter = document.getElementById('char-counter');

textarea.addEventListener('input', () => {
    const currentLength = textarea.value.length;
    charCounter.textContent = `${currentLength}/300`;
});

// Image upload handling
const addImageButton = document.getElementById('addImageButton');
const imageUploadInput = document.getElementById('imageUploadInput');
const imageContainer = document.getElementById('replyphotocontainer');

// Records the amount of times the add image button is pressed
let uploadCounter = 0;

// Store the preview image URLs in this array
let images = [];

// Store all uploaded files
let allFiles = [];

// Trigger the file input when the custom button is clicked
addImageButton.addEventListener('click', () => {
    imageUploadInput.click();
});

// Handle file selection
imageUploadInput.addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const selectedFiles = Array.from(event.target.files);
    
    // Limit total images to 4
    selectedFiles.forEach((file) => {
        if (images.length < 4) {
            const imageURL = URL.createObjectURL(file);
            images.push(imageURL);
        }
    });
    
    uploadCounter++;
    
    const currentFiles = Array.from(imageUploadInput.files);
    
    if (uploadCounter == 1) {
        // Gets the currently selected files in the file input
        allFiles = Array.from(imageUploadInput.files);
    } else {
        // Combines the newly selected files with the already selected ones
        allFiles = [...allFiles, ...currentFiles];
    }
    
    // Sets the combined files to the input's file list (simulating appending files)
    const dataTransfer = new DataTransfer();
    allFiles.forEach(file => dataTransfer.items.add(file));
    
    // Updates the input's file list
    imageUploadInput.files = dataTransfer.files;
    
    if (currentFiles.length > 4 && (allFiles.length - currentFiles.length) == 0) {
        // Too many files selected at once
        imageUploadInput.value = '';
        allFiles = [];
        images = [];
    } else if (allFiles.length > 4) {
        // Total files exceeded limit
        for (let i = allFiles.length - 1; i >= 4; i--) {
            removeFileFromInput(i);
        }
        renderImages();
    } else {
        renderImages();
    }
}

// Removes a file by its index
function removeFileFromInput(index) {
    const currentFiles = Array.from(imageUploadInput.files);
    const newFiles = currentFiles.filter((_, i) => i !== index);
    
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    imageUploadInput.files = dataTransfer.files;
    
    allFiles = Array.from(imageUploadInput.files);
}

// Remove image from array
function removeImage(index) {
    removeFileFromInput(index);
    images.splice(index, 1);
    renderImages();
}

// Render images in container
function renderImages() {
    // Show container if we have images
    if (images.length > 0) {
        imageContainer.style.display = 'flex';
    } else {
        imageContainer.style.display = 'none';
        return;
    }
    
    // Clear previous previews
    imageContainer.innerHTML = "";
    
    // Create an element for each image with a remove icon
    images.forEach((url, index) => {
        // Wrap each image + remove icon in a container
        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("imageWrapper");
        
        const img = document.createElement("img");
        img.src = url;
        img.classList.add("preview-image", "clickable-image");
        img.onclick = function() { openModal(this); };
        
        // Create a remove icon for each image
        const removeIcon = document.createElement("span");
        removeIcon.classList.add("remove-image-icon");
        removeIcon.innerHTML = "&times;";
        removeIcon.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent opening modal when clicking remove
            removeImage(index);
        });
        
        // Append them together
        imgWrapper.appendChild(img);
        imgWrapper.appendChild(removeIcon);
        imageContainer.appendChild(imgWrapper);
    });
}

// Image modal functionality
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const captionText = document.getElementById("caption");
const closeBtn = document.getElementsByClassName("close")[0];

/* ---- OPEN MODAL ---- */
function openModal(imgElement) {
    modal.style.display = "block";
    modalImg.src = imgElement.src;
    captionText.innerHTML = imgElement.alt || "";
}

/* ---- CLOSE MODAL WHEN X CLICKED ---- */
closeBtn.onclick = function() {
    modal.style.display = "none";
}

/* ---- CLOSE MODAL WHEN OUTSIDE CLICKED ---- */
modal.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

/* ---- CLOSE MODAL WITH ESCAPE KEY ---- */
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape" && modal.style.display === "block") {
        modal.style.display = "none";
    }
});
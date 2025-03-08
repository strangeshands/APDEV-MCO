/* ---- SET VARIABLES ---- */
window.onload = function () {
    if (mainPost) {
        if (!mainPost.parentPost) {
            tags = mainPost.tags; // Load existing tags into the tags array
            if (tags.length > 0)
                tagsContainer.style.display = "block";
            renderTags();      // Render the tags as chips
        }   

        document.getElementById("postTitleInput").value = mainPost.title;

        document.getElementById("postTextInput").value = mainPost.content;
        const currentLength =  mainPost.content.length;
        charLim.textContent = `${currentLength}/300`;

        images = mainPost.images;
        uploadCounter = images.length;
        if (images.length > 0)
            document.getElementById("postContentContainer").style.display = "flex";
        handleImageUpload();
        renderImages();
    }

    console.log(mainPost.parentPost);
    if (mainPost.parentPost) {
        const tagButton = document.getElementById("addTagButton");
        tagButton.style.display = "none";

        const titleRow = document.getElementById("titleRow");
        titleRow.style.display = "none";
    }

    const postForm = document.getElementById("postForm");
    postForm.setAttribute("action", directory);
    console.log("Form action set to:", postForm.action); // Debugging output
};


/* ---- REAL-TIME CHAR LIMIT ---- */
const postTextInput = document.getElementById("postTextInput");
const charLim = document.querySelector(".charLim");

postTextInput.addEventListener("input", function() {
    const currentLength = postTextInput.value.length;
    charLim.textContent = `${currentLength}/300`;

    if (currentLength >= 300) {
        feedback.style.color = "red";
    } else {
        feedback.style.color = "white";
    }
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

/* ---- EXPRESS FILE UPLOAD ---- */
// Records the amount of times the add image button is pressed
let uploadCounter = 0;

// We'll store the preview image URLs in this array
let images = [];

let allFiles = [];

const fileUploadInput = document.getElementById('fileUpload');
const customFileButton = document.getElementById('addImageButton');

// Ensure the file input allows multiple files
fileUploadInput.setAttribute('multiple', 'multiple');

// Trigger the file input when the custom button is clicked
customFileButton.addEventListener('click', function() {
    fileUploadInput.click();
});
fileUploadInput.addEventListener("change", handleImageUpload);

let postButton = document.getElementById("postButton");
postButton.addEventListener('click', function(e) {
    tagsInput.style.textTransform = 'none';
    tagsInput.style.color = 'transparent';

    if (tags.length > 0) {
        tagsInput.value = tags.join(',');
        console.log("Tags added = " + tagsInput.value);
    } else {
        console.log("No tags added");
    }

    document.querySelector('form').submit();
});

function handleImageUpload(event = null) {
    const selectedFiles = event ? Array.from(event.target.files) : [];
    const formData = new FormData();

    if (!event) {
        // Convert existing image paths to File objects
        const promises = images.map(async (imagePath, index) => {
            const response = await fetch(imagePath);
            const blob = await response.blob();
            const fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
            return new File([blob], fileName, { type: blob.type });
        });

        Promise.all(promises).then(files => {
            files.forEach(file => {
                allFiles.push(file);
                formData.append("images[]", file);
            });
            fileUploadInput.files = createFileList(allFiles);
            renderImages();
        });

        return;
    }

    // Limit total images to 4
    selectedFiles.forEach((file) => {
        if (images.length < 4) {
            const imageURL = URL.createObjectURL(file);
            images.push(imageURL);
        }
    });

    uploadCounter++;

    const currentFiles = Array.from(fileUploadInput.files);

    if (uploadCounter == 1) {
        // Gets the currently selected files in the file input
        allFiles = Array.from(fileUploadInput.files);
    } else {
        // Combines the newly selected files with the already selected ones
        allFiles = [...allFiles, ...currentFiles];
    }

    // Sets the combined files to the input's file list (simulating appending files)
    const dataTransfer = new DataTransfer();
    allFiles.forEach(file => dataTransfer.items.add(file));

    // Updates the input's file list
    fileUploadInput.files = dataTransfer.files;

    if (currentFiles.length > 4 && (allFiles.length - currentFiles.length) == 0) {
        
        // TODO: Display invalid: cannot upload more than 4 files

        fileUploadInput.value = '';
        allFiles = [];
        images = [];
        
    } else if (allFiles.length > 4) {

        // TODO: Display invalid: cannot upload more than 4 files

        for (let i = allFiles.length - 1; i >= 4; i--) {
            removeFileFromInput(fileUploadInput.files[i]);
        }
        renderImages();
    } else {
        renderImages();
    }
}

function createFileList(files) {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    return dataTransfer.files;
}

// Removes a file by its index or file reference
function removeFileFromInput(fileToRemove) {
    const currentFiles = Array.from(fileUploadInput.files); // Converts FileList to array
    const newFiles = currentFiles.filter(file => file !== fileToRemove); // Filters out the file to remove

    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    fileUploadInput.files = dataTransfer.files;

    allFiles = Array.from(fileUploadInput.files);
}

/* ---- REMOVE IMAGE FROM ARRAY ---- */
function removeImage(index) {
    removeFileFromInput(fileUploadInput.files[index]);
    images.splice(index, 1);
    renderImages();
}

/* ---- RENDER IMAGES IN CONTAINER ---- */
function renderImages() {
    // Clear previous previews
    postContentContainer.innerHTML = "";

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
        removeIcon.addEventListener("click", () => {
            removeImage(index);
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

    modal.style.display = "block";
    modalImg.src = image.src;

    modal.onclick = function () {
    modal.style.display = "none";
    };
}
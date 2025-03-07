document.addEventListener('DOMContentLoaded', () => {
    // Event Delegation for "View Replies" buttons
    document.querySelectorAll('.viewRepliesLink').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default link behavior
            const replyId = this.getAttribute('data-post-id');
            storeReplyData(replyId);
            // Redirect to postPage.html which will read the new reply data from localStorage
            window.location.href = "../html/postPage.html";
        });
    });
});

// Get modal elements
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
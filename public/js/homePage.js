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
// Get content from localStorage and display it
const contentData = JSON.parse(localStorage.getItem('postData'));

if (contentData) {

     // If there is replyTo info, display it 
     if (contentData.replyTo) {
        const container = document.getElementById("replyToContainer");
        const postElement = document.createElement("div");
        postElement.innerHTML = `
            <div id="reply-to-msg" onclick="window.location.href='postPage.html';">
                Replied to ${contentData.replyTo}
            </div>
        `;
        container.appendChild(postElement);
     }

     // Only add the title if one exists (for posts, not for replies)
     if (contentData.postTitle && contentData.postTitle.trim() !== "") {
        const container = document.getElementById("postTitleContainer");
        const postElement = document.createElement("div");
        postElement.id = "postTitle";
        postElement.innerHTML = contentData.postTitle;
        container.appendChild(postElement);
     } else {
        // Hide or remove the title container if no title exists
        document.getElementById("postTitleContainer").style.display = "none";
     }

     // Always set the main text (content of post/reply)
     document.getElementById('postText').innerText = contentData.postText;

     // Display images, if any
     if (contentData.postImage) {
          const container = document.getElementById('photo-container');
          container.id = "userphotocontainer";
          container.innerHTML = 
            contentData.postImage.length > 0 ? 
            contentData.postImage.map(img => 
                `<img class="clickable-image" src="${img}" onclick="openModal(this)">`
            ).join("") : "";
     }

     // Set user info, time, etc.
     if (contentData.userProfilePic) {
          document.getElementById('postAvatar').innerHTML = `<img src="${contentData.userProfilePic}" id="postProfilePic">`;
     }
     document.getElementById('postDisplayName').innerText = contentData.displayName;
     document.getElementById('postTime').innerText = `${contentData.username} | ${contentData.timePosted}`;

     document.getElementById('postLikeCounter').innerText = contentData.postLikeCounter;
     document.getElementById('postDislikeCounter').innerText = contentData.postDislikeCounter;

     // Render the tags if available
     if (contentData.postTags && contentData.postTags.length > 0) {
          const tagContainer = document.getElementById('tagContainer');
          const tagsDiv = document.createElement('div');
          tagsDiv.id = "tags";
          contentData.postTags.forEach(tag => {
               const tagElement = document.createElement('a');
               tagElement.href = tag;
               tagElement.innerText = tag;
               tagsDiv.appendChild(tagElement);
          });
          tagContainer.appendChild(tagsDiv);
     } else {
          document.getElementById('tagContainer').style.display = "none";
     }
} else {
     document.getElementById('post').innerText = "Post Not Found";
     document.getElementById('comments').innerText = " ";
}



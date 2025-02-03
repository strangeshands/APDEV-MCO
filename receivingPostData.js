// Get content from localStorage and display it
const contentData = JSON.parse(localStorage.getItem('postData'));
const replyId = localStorage.getItem('replyId'); // Retrieve stored reply ID

if (contentData) {

     if (contentData.replyTo) {
        const container = document.getElementById("replyToContainer");
        const postElement = document.createElement("div");

        postContent = `
            <!-- REPLY USER -->
            <!-- TO CHANGE: href link -->
            <div id="reply-to-msg" onclick="window.location.href='postPage.html';">
                Replied to ${contentData.replyTo}
            </div>
        `
        postElement.innerHTML = postContent;
          container.appendChild(postElement);
     }

     if (contentData.postTitle) {
        const container = document.getElementById("postTitleContainer");
        const postElement = document.createElement("div");
        postElement.id = "postTitle";

        postElement.innerHTML = `${contentData.postTitle}`;

        container.appendChild(postElement);
     }

     document.getElementById('postText').innerText = `${contentData.postText}`;

     if (contentData.postImage) {
          const container = document.getElementById('photo-container');
          container.id = "userphotocontainer";
          container.innerHTML = 
            contentData.postImage.length > 0 ? 
            `
                ${contentData.postImage.map(function(img) { 
                    return '<img class="clickable-image" src="' + img + '" onclick="openModal(this)">';
                }).join("")}
            `
            : "";
     }

     if (contentData.userProfilePic) {
          document.getElementById('postAvatar').innerHTML = `<img src="${contentData.userProfilePic}" id="postProfilePic">`;
     }

     document.getElementById('postDisplayName').innerText = `${contentData.displayName}`;
     document.getElementById('postTime').innerText = `${contentData.username} | ${contentData.timePosted}`;

     document.getElementById('postLikeCounter').innerText = `${contentData.postLikeCounter}`;
     document.getElementById('postDislikeCounter').innerText = `${contentData.postDislikeCounter}`;
     
     const repliedUser = document.getElementById('repliedUser');
     const REPusername = document.getElementById('REPusername');
     const currentUsername = document.getElementById('currentUsername');
     const REPavatar = document.getElementById('REPavatar'); 

     if (repliedUser) {
        document.getElementById('repliedUser').innerText = `${contentData.username}`;
     }

     if (REPusername) {
        document.getElementById('REPusername').innerText = `${contentData.currentUserDisplayName}`;
     }

     if (currentUsername) {
        document.getElementById('currentUsername').innerText = `${contentData.currentUserUsername}`;

     }

     if (contentData.currentUserProfilePic && REPavatar) {
        document.getElementById('REPavatar').innerHTML = `<img src="${contentData.currentUserProfilePic}" id="currentUserProfilePic">`;
     }

     // Display tags as individual <a> elements
     if (contentData.postTags && contentData.postTags.length > 0) {
          const container = document.getElementById('tagContainer');
          const postElement = document.createElement("div");
          postElement.id = "tags";
          
          contentData.postTags.forEach(tag => {
               const tagElement = document.createElement('a');
               tagElement.href = `${tag}`;  
               tagElement.innerText = `${tag}`;  

               postElement.appendChild(tagElement);
          });

          container.appendChild(postElement);
     }

          // If contentData.replyTo is empty, it's a post, so clear replyId
     if (!contentData.replyTo || contentData.replyTo.length === 0) {
               console.log("Detected a post. Clearing replyId.");
               localStorage.removeItem('replyId');
          }

          // Determine whether to show main comments or replies
          const commentThread = document.querySelector('.comment-thread');

          if (replyId && contentData.replyTo && contentData.replyTo.length > 0) {
               // If a reply was clicked, find the correct comment and show its replies
               const commentIndex = parseInt(replyId.replace("sampleComment", ""), 10) - 1;

               if (commentIndex >= 0 && commentIndex < sampleComments.length) {
               const selectedComment = sampleComments[commentIndex];

               if (selectedComment.comments.length > 0) {
                    console.log("Rendering replies for:", selectedComment);
                    renderComments(selectedComment.comments, commentThread);
               } else {
                    console.log("No replies available for this comment.");
               }
               } else {
               console.error("Invalid comment index:", commentIndex);
               }
          } else {
               // Default case: Render all top-level comments (meaning it's a post)
               console.log("Rendering top-level comments as this is a post.");
               renderComments(sampleComments, commentThread);
          }

} else {
     document.getElementById('post').innerText = "Post Not Found";
     document.getElementById('comments').innerText = " ";
}
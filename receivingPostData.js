// Get content from localStorage and display it
const contentData = JSON.parse(localStorage.getItem('postData'));

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

} else {
     document.getElementById('post').innerText = "Post Not Found";
     document.getElementById('comments').innerText = " ";
}
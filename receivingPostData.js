// Get content from localStorage and display it
const contentData = JSON.parse(localStorage.getItem('postData'));

if (contentData) {
     document.getElementById('postTitle').innerText = `${contentData.postTitle}`;
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

     // Display tags as individual <a> elements
     if (contentData.postTags && contentData.postTags.length > 0) {
          const tagsContainer = document.getElementById('tags');
          contentData.postTags.forEach(tag => {
               const tagElement = document.createElement('a');
               tagElement.href = `${tag}`;  
               tagElement.innerText = `${tag}`;  
               tagsContainer.appendChild(tagElement);  
          });
     }

} else {
     document.getElementById('post').innerText = "Post Not Found";
     document.getElementById('comments').innerText = " ";
}
// Get content from localStorage and display it
const contentData = JSON.parse(localStorage.getItem('postData'));

if (contentData) {
     document.getElementById('postTitle').innerText = `${contentData.postTitle}`;
     document.getElementById('postText').innerText = `${contentData.postText}`;

     if (contentData.postImage) {
          const container = document.getElementById('photo-container');
          container.id = "userphotocontainer";
          container.innerHTML = 
          `<img class="clickable-image" src="${contentData.postImage}" onclick="openModal(this)">
          <img class="clickable-image" src="${contentData.postImage}" onclick="openModal(this)">
          <img class="clickable-image" src="${contentData.postImage}" onclick="openModal(this)">`;
     }

     if (contentData.userProfilePic) {
          document.getElementById('postAvatar').innerHTML = `<img src="${contentData.userProfilePic}" id="postProfilePic">`;
     }

     document.getElementById('postUsername').innerText = `${contentData.username}`;
     document.getElementById('postTime').innerText = `${contentData.timePosted}`;

     document.getElementById('postLikeCounter').innerText = `${contentData.postLikeCounter}`;
     document.getElementById('postDislikeCounter').innerText = `${contentData.postDislikeCounter}`;

     // Display tags as individual <a> elements
     if (contentData.postTags && contentData.postTags.length > 0) {
          const tagsContainer = document.getElementById('tags');
          contentData.postTags.forEach(tag => {
               const tagElement = document.createElement('a');
               tagElement.href = `${tag}`;  // Set href (you can change this to a proper URL if needed)
               tagElement.innerText = `${tag}`;  // Display the tag with a '#' symbol
               tagsContainer.appendChild(tagElement);  // Append each tag as an individual <a> tag
          });
     }

} else {
     document.getElementById('post').innerText = "Post Not Found";
     document.getElementById('comments').innerText = " ";
}
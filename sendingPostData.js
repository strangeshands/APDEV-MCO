function storePostData(postId) {
     const postTitle = document.getElementById(postId).querySelector('.postTitle').innerText;
     const postText = document.getElementById(postId).querySelector('.postText').innerText;
     
     // Get all the tags and join them as a string (or an array if preferred)
     const postTagsElements = document.getElementById(postId).querySelectorAll('.posttags a');
     const postTags = Array.from(postTagsElements).map(tag => tag.innerText);  // Join tags as a comma-separated string

     // Check if there's an image in the post
     const postImageElement = document.getElementById(postId).querySelector('.postImageContainer img');
     const postImage = postImageElement ? postImageElement.getAttribute('src') : ''; // If no image, set empty string
     
     // Check if there's an image in the profile pic
     const userProfilePicElement = document.getElementById(postId).querySelector('.profilePic img');
     const userProfilePic = userProfilePicElement ? userProfilePicElement.getAttribute('src') : ''; // If no image, set empty string
     
     const username = document.getElementById(postId).querySelector('.username').innerText;
     const timePosted = document.getElementById(postId).querySelector('.timePosted').innerText;

     const postLikeCounter = document.getElementById(postId).querySelector('.postLikeCounter').innerText;
     const postDislikeCounter = document.getElementById(postId).querySelector('.postDislikeCounter').innerText;

     // Create an object to hold all the content
     const contentObj = {
          postTitle: postTitle,
          postText: postText,
          postTags: postTags,
          postImage: postImage,
          userProfilePic: userProfilePic,
          username: username,
          timePosted: timePosted,
          postLikeCounter: postLikeCounter,
          postDislikeCounter: postDislikeCounter
     };

     // Save the object as a JSON string in localStorage
     localStorage.setItem('postData', JSON.stringify(contentObj));
}

// Loop through all the post links and add event listeners dynamically
const postLinks = document.querySelectorAll('.postLink');
postLinks.forEach( link => {
     // Get the post ID from the data attribute
     const postId = link.getAttribute('data-post-id');

     // Add an event listener to each link
     link.addEventListener('click', function () {
          storePostData(postId);
     });
});
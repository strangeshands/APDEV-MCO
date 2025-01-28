function storePostData(postId) {

     const postTitle = document.getElementById(postId).querySelector('.postTitle, .userPostTitle').innerText;
     
     const postTextElement = document.getElementById(postId).querySelector('.postText');
     const postText = postTextElement ? postTextElement.innerText : '';
     
     // Get all the tags and join them as a string (or an array if preferred)
     const postTagsElements = document.getElementById(postId).querySelectorAll('.posttags a');
     const postTags = Array.from(postTagsElements).map(tag => tag.innerText);  // Join tags as a comma-separated string

     // Check if there's an image in the post
     const postImageElement = document.getElementById(postId).querySelector('.postImageContainer img, .userPost img');
     const postImage = postImageElement && postImageElement.getAttribute('src') !== "resources/Image Holder.svg" ? postImageElement.getAttribute('src') : ''; // If no image, set empty string
     
     // Check if there's an image in the profile pic
     const userProfilePicElement = document.getElementById(postId).querySelector('.profilePic img, #userAvatar img');
     const userProfilePic = userProfilePicElement ? userProfilePicElement.getAttribute('src') : document.getElementById('userAvatar').querySelector('img').getAttribute('src'); // If no image, set as user avatar
     
     // Get the username and time posted, with fallbacks in case not found
     const usernameElement = document.getElementById(postId).querySelector('.username');
     const username = usernameElement ? usernameElement.innerText : document.getElementById('profileUsername').innerText;
     const timePostedElement = document.getElementById(postId).querySelector('.timePosted');
     const timePosted = timePostedElement ? timePostedElement.innerText : 'time posted';

     const postLikeCounterElement = document.getElementById(postId).querySelector('.postLikeCounter');
     const postLikeCounter = postLikeCounterElement ? postLikeCounterElement.innerText : '0'; // Default to 0 if not found
     const postDislikeCounterElement = document.getElementById(postId).querySelector('.postDislikeCounter');
     const postDislikeCounter = postDislikeCounterElement ? postDislikeCounterElement.innerText : '0'; // Default to 0 if not found

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
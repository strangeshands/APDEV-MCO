function storePostData(postId) {

    let index;
    let postReference;

    if (postId.startsWith("post")) {
        index = parseInt(postId.replace("post", ""));

        postReference = timelinePosts;

    } else if (postId.startsWith("userPost")) {
        index = parseInt(postId.replace("userPost", ""));

        postReference = userPosts;

    } else if (postId.startsWith("userComment")) {
        index = parseInt(postId.replace("userComment", ""));

        postReference = userComments;
        
    }

    index = index - 1;

     const replyTo = postReference[index].replyTo.length > 0 ? postReference[index].replyTo : '';

     const postTitle = postReference[index].title;
     const postText = postReference[index].caption;

     const postTags = postReference[index].tags.length > 0 ? postReference[index].tags : '';
     const postImage = postReference[index].images.length > 0 ? postReference[index].images : '';

     const userProfilePic = postReference[index].pfp;
     const displayName = postReference[index].displayName;
     const username = postReference[index].username;
     const timePosted = postReference[index].time;

     const postLikeCounter = postReference[index].likes;
     const postDislikeCounter = postReference[index].dislikes;

     const currentUserDisplayName = userPosts[index].displayName;
     const currentUserUsername = userPosts[index].username;
     const currentUserProfilePic = userPosts[index].pfp;

     // Create an object to hold all the content
     const contentObj = {
          replyTo: replyTo,
          postTitle: postTitle,
          postText: postText,
          postTags: postTags,
          postImage: postImage,
          userProfilePic: userProfilePic,
          displayName: displayName,
          username: username,
          timePosted: timePosted,
          postLikeCounter: postLikeCounter,
          postDislikeCounter: postDislikeCounter,
          currentUserDisplayName: currentUserDisplayName,
          currentUserUsername: currentUserUsername,
          currentUserProfilePic: currentUserProfilePic
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
     link.addEventListener('click', function (event) {

          const target = event.target;
        
          if (!target.closest('.actionButton') && !target.closest('.clickable-image') && !target.closest('.optionsButton') && !target.closest('.activeOptionsButton')) {
               storePostData(postId);
               window.location.href = "postPage.html";
          } else if (target.closest('.commentButton')) {
               storePostData(postId);
          } 

     });
});
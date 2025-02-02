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

     // NEW: Get the comments for this post (or an empty array if none)
     const comments = postReference[index].comments ? postReference[index].comments : [];


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

function storeReplyData(replyId) {
     let index;
     let replyReference;
     
     if (replyId.startsWith("sampleComment")) {
          index = parseInt(replyId.replace("sampleComment", ""));
          replyReference = sampleComments;  
     }
     index = index - 1;
     
     // For a reply, we do not want to show a title or tags.
     const replyTo = replyReference[index].replyTo.length > 0 ? replyReference[index].replyTo : '';
     const postTitle = "";  
     const postText = replyReference[index].caption;
     const postTags = "";   
     const postImage = replyReference[index].images.length > 0 ? replyReference[index].images : '';
     const userProfilePic = replyReference[index].pfp;
     const displayName = replyReference[index].displayName;
     const username = replyReference[index].username;
     const timePosted = replyReference[index].time;
     const postLikeCounter = replyReference[index].likes;
     const postDislikeCounter = replyReference[index].dislikes;
     
     // Create the content object for the reply
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
          postDislikeCounter: postDislikeCounter
     };
     
     // Overwrite the "postData" key with reply data
     localStorage.setItem('postData', JSON.stringify(contentObj));
 }
 

// Add event listeners to view replies links
const viewRepliesLinks = document.querySelectorAll('.viewRepliesLink');
viewRepliesLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default link behavior
        const replyId = this.getAttribute('data-post-id');
        storeReplyData(replyId);
        // Now redirect to the post page which reads localStorage
        window.location.href = "postPage.html";
    });
});

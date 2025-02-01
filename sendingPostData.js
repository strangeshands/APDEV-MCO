/* ---- HARD CODED DATA ---- */

/* ---- USER POSTS ---- */
const userPosts = [
    {
         replyTo: "",

         displayName: "DARNA",
         username: "@AkoSiDarna",
         pfp: "resources/pfpSample.jpg",
         tags: ["#AnotherTagHere", "#TagHere", "#ProbablyAnotherTagHere"],
         caption: "Life is a journey, and every step we take brings us closer...",
         images: ["resources/hamster.jpg", "resources/monkey.jpg"],
         title: "JOURNEY",

         time: "4 minutes ago",

         popUpCount: 0,
         likes: 3,
         dislikes: 0,

         liked: false,
         disliked: false,
         bookmark: false,
         own: true
    },
    {
         replyTo: "",

         displayName: "DARNA",
         username: "@AkoSiDarna",
         pfp: "resources/pfpSample.jpg",
         tags: ["#Movies"],
         caption: "I am vengeance. I am the night. I am Batman!",
         images: [],
         title: "THE NIGHT",

         time: "10 hours ago",

         popUpCount: 0,
         likes: 3,
         dislikes: 0,

         liked: false,
         disliked: false,
         bookmark: false,
         own: true
    },
    {
         replyTo: "",

         displayName: "DARNA",
         username: "@AkoSiDarna",
         pfp: "resources/pfpSample.jpg",
         tags: ["#TagHere"],
         caption: "sorry guys i don't have a photo but guess who just got a new iphone 16 pro max 256g " +
                   "fully paid no installment (not me)",
         images: [],
         title: "iPhone 16",

         time: "4 minutes ago",

         popUpCount: 0,
         likes: 3,
         dislikes: 0,

         liked: false,
         disliked: false,
         bookmark: false,
         own: true
    }
];

/* ---- USER COMMENTS ---- */
const userComments = [
    {
         replyTo: "@TheDarkKnight",

         displayName: "DARNA",
         username: "@AkoSiDarna",
         pfp: "resources/pfpSample.jpg",
         tags: [],
         caption: "I SAW U EARLIER HOLY MACARONI he's hot irl",
         images: ["resources/batman.jpg"],
         title: "",

         time: "4 minutes ago",

         likes: 100,
         dislikes: 3,

         liked: false,
         disliked: true,
         bookmark: true,
         own: true
    },

    {
         replyTo: "@BuckBarnes",

         displayName: "DARNA",
         username: "@AkoSiDarna",
         pfp: "resources/pfpSample.jpg",
         tags: [],
         title: "",
         caption: "sometimes i just wonder how's it like being a metal arm...",
         images: ["resources/metal-arm.jpg"],

         time: "4 minutes ago",

         likes: 1000,
         dislikes: 0,

         liked: true,
         disliked: false,
         bookmark: false,
         own: true
    },
];

/* ---- TIMELINE POSTS ---- */
const timelinePosts = [
    {
         displayName: "bartholomewThe5th",
         username: "@catlover420",
         pfp: "resources/cat.jpg",
         tags: ["#funny", "#life", "#school", "#dolphin", "#rainbow", "#ocean", "#morning", "#depression"],
         caption: "philippines, gising na",
         images: ["resources/dolphin.jpg"],
         title: "good morning",

         time: "4 minutes ago",

         likes: 42,
         dislikes: 7,

         liked: true,
         disliked: false,
         bookmark: false,
         own: false
    },
    {
         displayName: "slaysianDivaOfLA",
         username: "@dontforgettheella",
         pfp: "resources/joella.jpg",
         tags: ["#mug", "#drag", "#lanaSucks", "#joellaDynasty"],
         caption: "- Joella",
         images: [],
         title: "fix ur mug",

         time: "7 hours ago",

         likes: 2,
         dislikes: 75,

         liked: false,
         disliked: true,
         bookmark: false,
         own: false
    },
    {
         displayName: "carbonaraEater",
         username: "@jabeedabee",
         pfp: "resources/jabee.jpg",
         tags: ["#TagHere"],
         caption: "hamster",
         images: ["resources/hamster.jpg"],
         title: "hehe",

         time: "5 days ago",

         likes: 134,
         dislikes: 12,

         liked: false,
         disliked: false,
         bookmark: true,
         own: false
    }
];

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
     const timePosted = timePostedElement ? timePostedElement.innerText : '1 minute ago';

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
     link.addEventListener('click', function (event) {

          const target = event.target;
        
          if (!target.closest('.actionButton') && !target.closest('.optionsButton') && !target.closest('.activeOptionsButton')) {
               storePostData(postId);
               window.location.href = "postPage.html";
          } else if (target.closest('.commentButton')) {
               storePostData(postId);
          }

     });
});
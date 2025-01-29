
/* ----- HARD CODE DATA -----*/
const userPosts = [
     {
          displayName: "DARNA",
          username: "@AkoSiDarna",
          pfp: "resources/pfpSample.jpg",
          tags: ["#AnotherTagHere", "#TagHere", "#ProbablyAnotherTagHere"],
          title: "JOURNEY",
          caption: "Life is a journey, and every step we take brings us closer...",
          images: ["resources/hamster.jpg", "resources/monkey.jpg"],
          likes: 3,
          dislikes: 0,
     },
     {
          displayName: "DARNA",
          username: "@AkoSiDarna",
          pfp: "resources/pfpSample.jpg",
          tags: ["#Movies"],
          title: "THE NIGHT",
          caption: "I am vengeance. I am the night. I am Batman!",
          images: [],
          likes: 3,
          dislikes: 0,
     },
     {
          displayName: "DARNA",
          username: "@AkoSiDarna",
          pfp: "resources/pfpSample.jpg",
          tags: ["#TagHere"],
          title: "iPhone 16",
          caption: "sorry guys i don't have a photo but guess who just got a new iphone 16 pro max 256g " +
                    "fully paid no installment (not me)",
          images: [],
          likes: 3,
          dislikes: 0,
     },
];

/* ---- CODE FUNCTION ---- */
function loadUserPosts() {
     const container = document.getElementById("userPostContainer");

     if (!userPosts || userPosts.length === 0) {
          container.innerHTML = `
               <p class="no-post-msg">Boohoo! No posts yet...</p>
               <a id="create-first-link" href="newPostPage.html">
                    <p id="create-first" class="no-post-msg">Create your first post</p>
               </a>
          `;
          return;
     }

     userPosts.forEach(post => {
          const postElement = document.createElement("div");
          postElement.classList.add("USERPOST");
          postElement.innerHTML = `
               <!-- USER DETAILS -->
               <div id="pfpuserrow">
                    <div id="userandpfp">
                         <div class="pfpPost">
                         <img src="${post.pfp}" />
                         </div>
                         <div id="pfpnames">
                         <span class="pfpdisplayname">${post.displayName}</span>
                         <span class="pfpusername">${post.username}</span>
                         </div>
                    </div>
                    <button class="smallbutton">
                         <img src="resources/Options Button.svg"/>
                    </button>
               </div>

               <!-- POST TAGS HERE -->
               <!-- TO CHANGE: href link -->
               <div id="posttags">
                    ${post.tags.map(tag => `<a href="">${tag}</a>`).join(" ")}
               </div>

               <!-- POST TITLE HERE -->
               <!-- TO CHANGE: href link -->
               <div id="posttile" onclick="window.location.href='postPage.html';">
                    <h2>${post.title}</h2>
               </div>

               <!-- POST CAPTION HERE -->
               <!-- TO CHANGE: href link -->
               <div id="usercaption" onclick="window.location.href='postPage.html';">${post.caption}</div>

               <!-- POST PHOTO/S HERE -->
               ${post.images.length > 0 ? `
                    <div id="userphoto">
                        <div id="userphotocontainer">
                            ${post.images.map(function(img) { 
                                return '<img src="' + img + '" class="clickable-image" onclick="openModal(this)">';
                            }).join("")}
                        </div>
                    </div>
               ` : ""}

               <!-- POST OPTIONS -->
               <div id="postoptionrow">
                    <button class="postoptionbutton actionButton" id="heart" onclick="iconClicked(this, 'heart')">
                         <img src="resources/Heart.svg"/>
                         <span class="counter">${post.likes}</span>
                    </button>
                    <img src="resources/Line.svg" alt="Line">
                    <button class="postoptionbutton actionButton" id="heartCrack" onclick="iconClicked(this, 'heartCrack')">
                         <img src="resources/HeartCrack.svg"/>
                         <span class="counter">${post.dislikes}</span>
                    </button>
                    <button class="postoptionbutton actionButton">
                              <img src="resources/Comments.svg"/>
                    </button>
                    <button class="postoptionbutton actionButton" id="bookmark" onclick="iconClicked(this, 'bookmark')">
                         <img src="resources/bookmark.svg"/>
                    </button>
               </div>

               <div class="post-break"></div>
          `;

          container.appendChild(postElement);
     });
}

/* ---- BUTTON ACTIONS ---- */
function iconClicked(button, iconType) {
     // Get the image within the button
     const img = button.querySelector('img');
 
     // Get the counter element if it exists
     const counter = button.querySelector('.counter');
 
     // Find the parent post or comment
     const post = button.closest('.USERPOST');
     
     // Path for different icon types
     const iconPaths = {
         'heart': {
             default: 'resources/Heart.svg',
             clicked: 'resources/Heart-Clicked.svg'
         },
         'heartCrack': {
             default: 'resources/HeartCrack.svg',
             clicked: 'resources/HeartCrack-Clicked.svg'
         },
         'bookmark': {
             default: 'resources/Bookmark.svg',
             clicked: 'resources/Bookmark-Clicked.svg'
         }
     };
 
     if (iconType === 'heart' || iconType === 'heartCrack') {
         // Find like and dislike buttons
         const likeButton = post.querySelector('#heart');
         const dislikeButton = post.querySelector('#heartCrack');
         
         // Get like and dislike counters
         const likeCounter = likeButton.querySelector('.counter');
         const dislikeCounter = dislikeButton.querySelector('.counter');
 
         // Determine current button details
         const currentButton = iconType === 'heart' ? likeButton : dislikeButton;
         const otherButton = iconType === 'heart' ? dislikeButton : likeButton;
         const currentImg = currentButton.querySelector('img');
         const otherImg = otherButton.querySelector('img');
         const currentCounter = iconType === 'heart' ? likeCounter : dislikeCounter;
         const otherCounter = iconType === 'heart' ? dislikeCounter : likeCounter;
 
         // Toggle current button state
         const currentSrc = currentImg.src.split('/').pop(); // Extract only the filename
         const isCurrentlyClicked = currentSrc === iconPaths[iconType].clicked.split('/').pop();
 
         // Check the other button's state
         const otherSrc = otherImg.src.split('/').pop();
         const isOtherClicked = otherSrc === iconPaths[iconType === 'heart' ? 'heartCrack' : 'heart'].clicked.split('/').pop();
 
         // Toggle current button state
         if (isCurrentlyClicked) {
             currentImg.src = iconPaths[iconType].default;
             currentCounter.textContent = Math.max(0, parseInt(currentCounter.textContent) - 1);
         } else {
             currentImg.src = iconPaths[iconType].clicked;
             currentCounter.textContent = parseInt(currentCounter.textContent) + 1;
 
             // If the other button was clicked, reset it
             if (isOtherClicked) {
                 otherImg.src = iconPaths[iconType === 'heart' ? 'heartCrack' : 'heart'].default;
                 otherCounter.textContent = Math.max(0, parseInt(otherCounter.textContent) - 1);
             }
         }
     } else if (iconType === 'bookmark') {
         // Bookmark button logic
         const currentSrc = img.src.split('/').pop(); // Extract only the filename
         const isCurrentlyBookmarked = currentSrc === iconPaths.bookmark.clicked.split('/').pop();
 
         // Toggle bookmark state
         if (isCurrentlyBookmarked) {
             img.src = iconPaths.bookmark.default;
         } else {
             img.src = iconPaths.bookmark.clicked;
         }
     }
 }
 
 document.addEventListener('DOMContentLoaded', () => {
     document.querySelectorAll('.actionButton').forEach(button => {
         button.addEventListener('click', function () {
             const id = this.id; 
             iconClicked(this, id);
         });
     });
}); 
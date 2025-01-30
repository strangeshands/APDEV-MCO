/* ---- HARD CODED DATA ---- */
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

          likes: 3,
          dislikes: 0,

          liked: false,
          disliked: false,
          bookmark: false,
          own: true
     }
];

/* ---- CODE FUNCTION ---- */
function loadUserPosts() {
     const container = document.getElementById("userPostsContainer");

     if (!userPosts || userPosts.length === 0) {
          container.innerHTML = `
               <p class="no-post-msg">Boohoo! No posts yet</p>
               <a id="create-first-link" href="homePage.html">
                    <p id="create-first" class="no-post-msg">Create your first post</p>
               </a>
          `;
          return;
     }

     userPosts.forEach(post => {
          const postElement = document.createElement("div");
          postElement.classList.add(post.replyTo.length > 0 ? "comment" : "post");
          let postContent = "";

          if (post.replyTo.length > 0) {
               postContent += `
                    <!-- REPLY USER -->
                    <!-- TO CHANGE: href link -->
                    <div id="reply-to-msg" onclick="window.location.href='postPage.html';">
                         Replied to ${post.replyTo}
                    </div>
               `
          }

          postContent += `
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
                    
                    ${post.own ? `
                         <button class="smallbutton" onclick="toggleMenu(event, this)">
                              <img src="resources/Options Button.svg"/>
                         </button>
                         <div class="options-menu hidden">
                              <button class="edit-post">Edit Post</button>
                              <button class="delete-post">Delete Post</button>
                         </div>
                    ` : "" }
               </div>

               <!-- POST TAGS HERE -->
               <!-- TO CHANGE: href link -->
               <div id="posttags">
                    ${post.tags.map(tag => `<a href="">${tag}</a>`).join(" ")}
               </div>

               <!-- POST TITLE HERE -->
               ${post.title.length > 0 ? `
                    <div id="posttile" onclick="window.location.href='postPage.html';">
                        <h2>${post.title}</h2>
                    </div>
                ` : "" }

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
                    <!-- HEART FEATURE: RED IF BOOKMARKED -->
                    <button class="postoptionbutton actionButton" id="heart" onclick="iconClicked(this, 'heart')">
                         <img src="${post.liked ? 'resources/Heart-Clicked.svg' : 'resources/Heart.svg'}"/>
                         <span class="counter">${post.likes}</span>
                    </button>

                    <img src="resources/Line.svg" alt="Line">
                    <button class="postoptionbutton actionButton" id="heartCrack" onclick="iconClicked(this, 'heartCrack')">
                         <img src="${post.disliked ? 'resources/HeartCrack-Clicked.svg' : 'resources/HeartCrack.svg'}"/>
                         <span class="counter">${post.dislikes}</span>
                    </button>

                    <button class="postoptionbutton actionButton">
                              <img src="resources/Comments.svg"/>
                    </button>

                    <!-- BOOKMARK FEATURE: YELLOW IF BOOKMARKED -->
                    <button class="postoptionbutton actionButton" id="bookmark" onclick="iconClicked(this, 'bookmark')">
                         <img src="${post.bookmark ? 'resources/Bookmark-Clicked.svg' : 'resources/bookmark.svg'}"/>
                    </button>
               </div>

               <div class="post-break"></div>
          `;

          postElement.innerHTML = postContent;
          container.appendChild(postElement);
     });
}

function toggleMenu(event, button) {
     event.stopPropagation(); // Prevent click from bubbling up
 
     const menu = button.nextElementSibling; // The div with class "options-menu"
     console.log("Button clicked, toggling menu.");
 
     if (menu) {
         // Toggle the visibility of the menu
         if (!menu.classList.contains("hidden")) {
               // Instead of toggling hidden, directly set display
               menu.style.display = 'block'; // Show the menu
          } else {
               menu.style.display = 'none'; // Hide the menu
          }
         
         if (!menu.classList.contains("hidden")) {
             // Menu is visible, position it near the button
             const buttonRect = button.getBoundingClientRect();
             console.log("Menu position: ", buttonRect.left, buttonRect.top);
             menu.style.left = `${buttonRect.left - menu.offsetWidth}px`; // Align left of the button
             menu.style.top = `${buttonRect.top + buttonRect.height}px`; // Align below the button
             console.log("Menu visible and positioned.");
         } else {
             console.log("Menu hidden.");
         }
     } else {
         console.log("No menu found!");
     }
 
     // Close the menu if clicked outside
     document.addEventListener("click", function (e) {
         if (!button.contains(e.target) && !menu.contains(e.target)) {
             menu.classList.add("hidden");
             console.log("Menu closed from outside click.");
         }
     }, { once: true });
 }
 
/* ----- HARD CODE DATA -----*/
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

/* ---- CODE FUNCTION ---- */
function loadUserComments() {
     const container = document.getElementById("userCommentContainer");

     if (!userComments || userComments.length === 0) {
          container.innerHTML = `
               <p class="no-post-msg">No comments yet. Go interact with others...</p>
               <a id="create-first-link" href="homePage.html">
                    <p id="create-first" class="no-post-msg">Go back to home page</p>
               </a>
          `;
          return;
     }

     userComments.forEach((post, index) => {
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
               <div class="pfpuserrow" id="pfpuserrow-${index}">
                    <div id="userandpfp">
                         <div class="pfpPost">
                         <img src="${post.pfp}" />
                         </div>
                         <div id="pfpnames">
                         <span class="pfpdisplayname">${post.displayName}</span>
                         <span class="pfpusername">${post.username} | ${post.time}</span>
                         </div>
                    </div>
                    
                    ${post.own ? `
                         <!-- POST OPTIONS -->
                         <button class="optionsButton" onclick="togglePopupComment(this, '${index}')">
                              <img src="resources/Options Button.svg" alt="">
                         </button>


                         <!-- POST OPTIONS POPUP -->
                         <div class="popUpOptions" id="comment-popup-${index}">
                              <div class="postOptionsContent">
                                   <button class="editButton" onclick="goToPost('${post.title}', ${index})">View Post</button>
                                   <button class="editButton" onclick="window.location.href = 'newPostPage.html';">Edit Post</button>
                                   <button class="editButton">Copy Link</button>
                                   <button class="deleteButton">Delete Post</button>
                              </div>
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

                    <button class="postoptionbutton actionButton" onclick="window.location.href='replyPage.html'">
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

/* --- OPTION POP UP --- */
let activePopup = null;

function togglePopupComment(button, postId) {
    console.log(`Menu clicked on post ${postId}`);
    
    const popup = document.getElementById(`comment-popup-${postId}`);
    
    if (activePopup && activePopup !== popup) {
        activePopup.classList.remove('show');
    }
    
    popup.classList.toggle('show');
    
    if (popup.classList.contains('show')) {
        activePopup = popup;
    } else {
        activePopup = null;
    }
}

document.addEventListener('click', (e) => {
     const optionsButtons = document.querySelectorAll('.optionsButton');
     const popups = document.querySelectorAll('.popUpOptions');
  
     if (![...optionsButtons].includes(e.target) && !e.target.closest('.popUpOptions') && !e.target.closest('.optionsButton')) {
         popups.forEach(popup => {
             popup.classList.remove('show');
         });
     }
}); 

/* --- GO TO POST --- */
function goToPost(title, postId) {
     console.log(`Going to post ${postId} -- ${title}`);
     /*window.location.href = 'postPage.html';*/
}
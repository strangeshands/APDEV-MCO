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
                         <span class="pfpusername">${post.username} | ${post.time}</span>
                         </div>
                    </div>
                    
                    <!-- POST OPTIONS -->
                    <div class="popUpOptions" id=${post.popUpCount}>
                    <div class="postOptionsContent">
                              <button class="activeOptionsButton" post-options-id=${post.popUpCount}>
                                   <img src="resources/Options Button.svg" alt="">
                              </button>
                              <a href="postPage.html" class="postLink postOptionsButton" data-post-id="post2"><button class="viewButton">View Post</button></a>
                              <a href="newPostPage.html" class="postLink postOptionsButton" data-post-id="post2"><button class="editButton">Edit Post</button></a>
                              <a href="" class="postLink postOptionsButton" data-post-id="post2"><button class="deleteButton">Delete Post</button></a>
                         </div>
                    </div>

                    <button class="optionsButton" post-options-id=${post.popUpCount}>
                    <img src="resources/Options Button.svg" alt="">
                    </button>
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
                                return '<img src="${img}" class="clickable-image" onclick="openModal(this)">';
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

          const script = document.createElement("script");
          script.src = "displayPostOptions.js";
          document.body.appendChild(script);
     });
}
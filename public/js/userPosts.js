/* ---- CODE FUNCTION ---- */
function loadUserPosts(type) {
     console.log(userPosts);
     const container = document.getElementById("userPostsContainer");

     var own;
     /**
      *   TO DO: fix time and date depending on the discussed format
      */
     var date = {
          month: 'short', 
          day: '2-digit', 
          year: 'numeric', 
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
     };

     if (!userPosts || userPosts.length === 0) {
          container.innerHTML = `
               <p class="no-post-msg">Boohoo! No posts yet...</p>
               <a id="create-first-link" href="../html/homePage.html">
                    <p id="create-first" class="no-post-msg">Create your first post</p>
               </a>
          `;
          return;
     }

     /**
      *   TO DO:
      *        > fix time and date 
      * 
      *        > fix tags href
      *        > fix reply to href
      *        > fix go to href
      *        > fix title href
      *        > fix caption href
      *        
      *        > fix buttons
      */
     userPosts.forEach((post, index) => {
          // check if own post
          own = post.author.username === profileDetails.username;
          // set date
          date = new Date(post.createdAt).toLocaleString();

          const postElement = document.createElement("div");
          postElement.classList.add(post.parentPost != null ? "comment" : "post");
          let postContent = "";

          if (post.parentPost != null) {
               postContent += `
                    <!-- REPLY USER -->
                    <!-- TO CHANGE: href link -->
                    <div id="reply-to-msg" onclick="window.location.href='../html/postPage.html';">
                         Replied to ${post.parentPost}
                    </div>
               `
          }

          postContent += `
               <!-- USER DETAILS -->
               <div class="pfpuserrow" id="${type}-pfpuserrow-${index}">
                    <div id="userandpfp">
                         <div class="pfpPost">
                         <img src="${post.author.profilepic}" />
                         </div>
                         <div id="pfpnames">
                         <span class="pfpdisplayname">${post.author.displayname}</span>
                         <span class="pfpusername">${post.author.username} | ${date}</span>
                         </div>
                    </div>
                    
                    <button class="optionsButton" onclick="togglePopup('${type}', '${index}', '${container.id}')">
                         <img src="../resources/Options Button.svg"/>
                    </button>

                    <!-- POST OPTIONS POPUP -->
                    <div class="popUpOptions" id="${type}-popup-${index}">
                         <div class="postOptionsContent">
                              <button class="optionsButton option-exit" onclick="togglePopup('${type}', '${index}', '${container.id}')">
                                   <img src="../resources/Options Button.svg"/>
                              </button>
                              <button class="editButton" onclick="goToPost('${post.title}', ${index})">View Post</button>
                              <button class="editButton">Copy Link</button>

                              ${own ? `
                                   <button class="editButton" onclick="window.location.href = '../html/newPostPage.html';">Edit Post</button>
                                   <button class="deleteButton">Delete Post</button>
                              ` : ""}
                         </div>
                    </div>
               </div>

               <!-- POST TAGS HERE -->
               <!-- TO CHANGE: href link -->
               <div class="tagContainer" id="posttags">
                    ${post.tags.map(tag => `<a href="">${tag}</a>`).join(" ")}
               </div>

               <!-- POST TITLE HERE -->
               ${post.title.length > 0 ? `
                    <div id="posttile" onclick="window.location.href='../html/postPage.html';">
                        <h2>${post.title}</h2>
                    </div>
                ` : "" }

               <!-- POST CAPTION HERE -->
               <!-- TO CHANGE: href link -->
               <div id="usercaption" onclick="window.location.href='../html/postPage.html';">${post.content}</div>

               <!-- POST PHOTO/S HERE -->
               ${post.images != null ? `
                    <div id="userphoto">
                        <div id="userphotocontainer">
                            ${post.images.map(function(img) { 
                                return '<img src="' + img + '" class="clickable-image" onclick="openModal(this)">';
                            }).join("")}
                        </div>
                    </div>
               ` : ""}

               <!-- POST OPTIONS -->
               <div class="postActions" id="postoptionrow">
                    <!-- HEART FEATURE: RED IF BOOKMARKED -->
                    <button class="postoptionbutton actionButton" id="heart" onclick="iconClicked(this, 'heart')">
                         <img src="${post.liked ? '../resources/Heart-Clicked.svg' : '../resources/Heart.svg'}"/>
                         <span class="counter">${post.likeCount}</span>
                    </button>

                    <img src="../resources/Line.svg" alt="Line">
                    <button class="postoptionbutton actionButton" id="heartCrack" onclick="iconClicked(this, 'heartCrack')">
                         <img src="${post.disliked ? '../resources/HeartCrack-Clicked.svg' : '../resources/HeartCrack.svg'}"/>
                         <span class="counter">${post.dislikeCount}</span>
                    </button>

                    <button class="postoptionbutton actionButton" onclick="window.location.href='../html/replyPage.html'">
                              <img src="../resources/Comments.svg"/>
                    </button>

                    <!-- BOOKMARK FEATURE: YELLOW IF BOOKMARKED -->
                    <button class="postoptionbutton actionButton" id="bookmark" onclick="iconClicked(this, 'bookmark')">
                         <img src="${post.bookmark ? '../resources/Bookmark-Clicked.svg' : '../resources/bookmark.svg'}"/>
                    </button>
               </div>

               <div class="post-break"></div>
          `;

          postElement.innerHTML = postContent;
          container.appendChild(postElement);
     });
}
/* ---- CODE FUNCTION ---- */
function loadPosts(type) {
     var tab;
     var noMessage = '';
     var postsArray = userPosts;
     switch (type) {
          case "comments":
               tab = "userPostsContainer";
               noMessage = 'Boohoo! No comments yet...';
               postsArray = userComments;
          break;

          case "bookmarks":
               tab = "userBookmarksContainer"
               noMessage = 'Boohoo! No bookmarks yet...';
               postsArray = userBookmarks;
          break;

          case "likes":
               tab = "userLikesContainer";
               noMessage = 'Boohoo! No likes yet...';
               postsArray = userLikes;
          break;

          case "dislikes":
               tab = "userDislikesContainer";
               noMessage = 'Boohoo! No dislikes yet...';
               postsArray = userDislikes;
          break;

          default: 
               tab = "userPostsContainer";
               noMessage = 'Boohoo! No posts yet...';
               postsArray = userPosts;
     };

     const container = document.getElementById("postsContainer");

     if (!postsArray || postsArray.length === 0) {
          container.innerHTML = `
               <p class="no-post-msg">${noMessage}</p>
               <a id="create-first-link" href="/">
                    <p id="create-first" class="no-post-msg">Go back to home page</p>
               </a>
          `;
          return;
     }

     let userCheck = '';
     let activeId = '';
     if (activeUserDetails) {
          userCheck = activeUserDetails.username;
          activeId = activeUserDetails._id;
     }

     /**
      *   TO DO:
      *        > fix tags href
      *        > fix reply to href
      *        
      *        > fix buttons
      */
     postsArray.forEach((post, index) => {
          // check if own post
          own = post.author.username === userCheck;
          // check if liked post
          liked = !!checkLiked(post);
          // check if bookmarked post
          bookmarked = !!checkBookmarked(post);
          // check if disliked post
          disliked = !!checkDisliked(post);

          // set date
          date = post.postDate;

          const postElement = document.createElement("div");
          postElement.classList.add(post.parentPost != null ? "comment" : "post");
          let postContent = "";

          console.log("POST #", index, post);

          if (post.parentPost != null || userComments) {
               if (post.parentPost == null) {
                    postContent += `
                         <!-- REPLY USER -->
                         <!-- TO CHANGE: href link -->
                         <div id="reply-to-msg" style="margin-left: 0px;">
                              This is a reply to a deleted post or user.
                         </div>
                    `
               } else {
                    postContent += `
                         <!-- REPLY USER -->
                         <!-- TO CHANGE: href link -->
                         <div id="reply-to-msg" onclick="window.location.href='/posts/${post.parentPost._id}';">
                              Replied to ${post.parentPost.author.username}
                         </div>
                    `
               }
          }

          postContent += `
               <!-- USER DETAILS -->
               <div class="pfpuserrow" id="${type}-pfpuserrow-${index}">
                    <div id="userandpfp" onclick="window.location.href='/profile/${post.author.username}?userId=${activeId}'" style="cursor: pointer;">
                         <div class="pfpPost">
                         <img src="${post.author.profilepic}" />
                         </div>
                         <div id="pfpnames">
                         <span class="pfpdisplayname">${post.author.displayname}</span>
                         <span class="pfpusername">${post.author.username} | ${date}</span>
                         </div>
                    </div>
                    
                    <button class="optionsButton" onclick="togglePopup('${type}', '${index}', '${tab}')">
                         <img src="/resources/Options Button.svg"/>
                    </button>

                    <!-- POST OPTIONS POPUP -->
                    <div class="popUpOptions" id="${type}-popup-${index}">
                         <div class="postOptionsContent">
                              <button class="optionsButton option-exit" onclick="togglePopup('${type}', '${index}', '${tab}')">
                                   <img src="/resources/Options Button.svg"/>
                              </button>
                              <button class="editButton" onclick="window.location.href='/posts/${post._id}';">View Post</button>
                              <button class="editButton" onclick="copyLink('${post._id}');">Copy Link</button>

                              ${own ? `
                                   <button class="editButton" onclick="window.location.href = '/posts/edit/${post._id}';">Edit Post</button>
                                   <button class="deleteButton" onclick="window.location.href='/posts/delete/${post._id}?userId=${activeId}'">Delete Post</button>
                               ` : ""}
                         </div>
                    </div>
               </div>

               <!-- POST TAGS HERE -->
               <!-- TO CHANGE: href link -->
               <div class="tagContainer" id="posttags">
                    ${post.tags.map(tag => `
                         <a href="/?q=${encodeURIComponent(tag)}&userId=${activeId}" 
                         style="cursor: pointer; text-decoration: none;">
                         ${tag}
                         </a>
                    `).join(" ")}
               </div>

               <!-- POST TITLE HERE -->
               ${post.title.length > 0 ? `
                    <div id="posttile" onclick="window.location.href='/posts/${post._id}?from=profile';"
                    style="cursor: pointer; text-decoration: none;">
                        <h2>${post.title}</h2>
                    </div>
                ` : "" }

               <!-- POST CAPTION HERE -->
               <!-- TO CHANGE: href link -->
               <div id="usercaption" onclick="window.location.href='/posts/${post._id}?from=profile';">${post.content}</div>

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
               <div class="postActions" id="postoptionrow">
                    ${activeUserDetails ? `
                         <!-- HEART FEATURE: RED IF BOOKMARKED -->
                         <button class="postoptionbutton actionButton" id="heart" onclick="iconClicked(this, 'heart', '${post._id}')">
                              <img src="${liked ? '/resources/Heart-Clicked.svg' : '/resources/Heart.svg'}"/>
                              <span class="counter">${post.likeCount}</span>
                         </button>

                         <img src="/resources/Line.svg" alt="Line">
                         <button class="postoptionbutton actionButton" id="heartCrack" onclick="iconClicked(this, 'heartCrack', '${post._id}')">
                              <img src="${disliked ? '/resources/HeartCrack-Clicked.svg' : '/resources/HeartCrack.svg'}"/>
                              <span class="counter">${post.dislikeCount}</span>
                         </button>

                         <button class="postoptionbutton actionButton" onclick="window.location.href='/posts/reply/${post._id}'">
                                   <img src="/resources/Comments.svg"/>
                         </button>

                         <!-- BOOKMARK FEATURE: YELLOW IF BOOKMARKED -->
                         <button class="postoptionbutton actionButton" id="bookmark" onclick="iconClicked(this, 'bookmark', '${post._id}')">
                              <img src="${bookmarked ? '/resources/Bookmark-Clicked.svg' : '/resources/bookmark.svg'}"/>
                         </button>
                         
                    ` : ""}
               </div>

               <div class="post-break"></div>
          `;

          postElement.innerHTML = postContent;
          container.appendChild(postElement);
     });
}
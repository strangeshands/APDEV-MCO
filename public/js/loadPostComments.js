/* ---- CODE FUNCTION ---- */
function loadPost() {
    const container = document.getElementById("post");

    if (!mainPost) {
         container.innerHTML = `
                <br>
                <p class="no-post-msg">Seems like the post is missing. Sorry!</p>
         `;
         return;
    }

    let userCheck = '';
    let activeId = '';
    if (activeUserDetails) {
         userCheck = activeUserDetails.username;
         activeId = activeUserDetails._id;
    }

    // check if own post
    own = mainPost.author.username === userCheck;
    // check if liked post
    liked = !!checkLiked(mainPost);
    // check if bookmarked post
    bookmarked = !!checkBookmarked(mainPost);
    // check if disliked post
    disliked = !!checkDisliked(mainPost);

    // set date
    date = mainPost.postDate;

    const postElement = document.createElement("div");
    postElement.classList.add("post");
    let postContent = "";

    if (mainPost.parentPost != null) {
        console.log(mainPost.parentPost);
        postContent += `
             <!-- REPLY USER -->
             <!-- TO CHANGE: href link -->
             <div id="reply-to-msg" onclick="window.location.href='/posts/${mainPost.parentPost._id}';">
                  Replied to ${mainPost.parentPost.author.username}
             </div>
        `
    }

    postContent += `
        <!-- USER DETAILS -->
        <div class="pfpuserrow" id="comment-pfpuserrow-00">
            <div id="userandpfp" onclick="window.location.href='/profile/${mainPost.author.username}?userId=${activeId}'" style="cursor: pointer;">
                <div class="pfpPost">
                <img src="${mainPost.author.profilepic}" />
                </div>
                <div id="pfpnames">
                <span class="pfpdisplayname">${mainPost.author.displayname}</span>
                <span class="pfpusername">${mainPost.author.username} | ${date}</span>
                </div>
            </div>
            
            <button class="optionsButton" onclick="togglePopup('none', '00', '${container.id}')">
                <img src="/resources/Options Button.svg"/>
            </button>

            <!-- POST OPTIONS POPUP -->
            <div class="popUpOptions" id="popUp00">
                <div class="postOptionsContent">
                        <button class="optionsButton option-exit" onclick="togglePopup('none', '00', '${container.id}')">
                            <img src="/resources/Options Button.svg"/>
                        </button>
                        <button class="editButton" onclick="window.location.href='/posts/${mainPost._id}';">View Post</button>
                        <button class="editButton" onclick="copyLink('${mainPost._id}');">Copy Link</button>

                        ${own ? `
                            <button class="editButton" onclick="window.location.href = '../html/newPostPage.html';">Edit Post</button>
                            <button class="deleteButton" onclick="window.location.href='/posts/delete/${mainPost._id}?userId=${activeId}&from=profile'">Delete Post</button>
                        ` : ""}
                </div>
            </div>
        </div>

        <!-- POST TAGS HERE -->
        <!-- TO CHANGE: href link -->
        <div class="tagContainer" id="posttags">
            ${mainPost.tags.map(tag => `<a href="">${tag}</a>`).join(" ")}
        </div>

        <!-- POST TITLE HERE -->
        ${mainPost.title.length > 0 ? `
            <div id="posttile" onclick="window.location.href='/posts/${mainPost._id}';">
                <h2>${mainPost.title}</h2>
            </div>
        ` : "" }

        <!-- POST CAPTION HERE -->
        <!-- TO CHANGE: href link -->
        <div id="usercaption" onclick="window.location.href='/posts/${mainPost._id}';">${mainPost.content}</div>

        <!-- POST PHOTO/S HERE -->
        ${mainPost.images.length > 0 ? `
            <div id="userphoto">
                <div id="userphotocontainer">
                    ${mainPost.images.map(function(img) { 
                        return '<img src="' + img + '" class="clickable-image" onclick="openModal(this)">';
                    }).join("")}
                </div>
            </div>
        ` : ""}

        <!-- POST OPTIONS -->
        <div class="postActions" id="postoptionrow">
            ${activeUserDetails ? `
                <!-- HEART FEATURE: RED IF BOOKMARKED -->
                <button class="postoptionbutton actionButton" id="heart" onclick="iconClicked(this, 'heart', '${mainPost._id}')">
                        <img src="${liked ? '/resources/Heart-Clicked.svg' : '/resources/Heart.svg'}"/>
                        <span class="counter">${mainPost.likeCount}</span>
                </button>

                <img src="/resources/Line.svg" alt="Line">
                <button class="postoptionbutton actionButton" id="heartCrack" onclick="iconClicked(this, 'heartCrack', '${mainPost._id}')">
                        <img src="${disliked ? '/resources/HeartCrack-Clicked.svg' : '/resources/HeartCrack.svg'}"/>
                        <span class="counter">${mainPost.dislikeCount}</span>
                </button>

                <button class="postoptionbutton actionButton" onclick="window.location.href='../html/replyPage.html'">
                            <img src="/resources/Comments.svg"/>
                </button>

                <!-- BOOKMARK FEATURE: YELLOW IF BOOKMARKED -->
                <button class="postoptionbutton actionButton" id="bookmark" onclick="iconClicked(this, 'bookmark', '${mainPost._id}')">
                        <img src="${bookmarked ? '/resources/Bookmark-Clicked.svg' : '/resources/bookmark.svg'}"/>
                </button>
                
            ` : ""}
        </div>
    `;

    postElement.innerHTML = postContent;
    container.appendChild(postElement);
}

function loadComments() {
    const container = document.getElementById("comments-container");

    if (!postsArray || postsArray.length === 0) {
         container.innerHTML = `
                <br>
                <p class="no-post-msg">No comments yet for this post.</p>
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
        postElement.classList.add("post");
        let postContent = "";

        postContent += `
            <br>
            <!-- USER DETAILS -->
            <div class="pfpuserrow" id="comment-pfpuserrow-${index}">
                <div id="userandpfp" onclick="window.location.href='/profile/${post.author.username}?userId=${activeId}'" style="cursor: pointer;">
                    <div class="pfpPost">
                    <img src="${post.author.profilepic}" />
                    </div>
                    <div id="pfpnames">
                    <span class="pfpdisplayname">${post.author.displayname}</span>
                    <span class="pfpusername">${post.author.username} | ${date}</span>
                    </div>
                </div>
                
                <button class="optionsButton" onclick="togglePopup('none', '${index}', '${container.id}')">
                    <img src="/resources/Options Button.svg"/>
                </button>

                <!-- POST OPTIONS POPUP -->
                <div class="popUpOptions" id="popUp${index}">
                    <div class="postOptionsContent">
                            <button class="optionsButton option-exit" onclick="togglePopup('none', '${index}', '${container.id}')">
                                <img src="/resources/Options Button.svg"/>
                            </button>
                            <button class="editButton" onclick="window.location.href='/posts/${post._id}';">View Post</button>
                            <button class="editButton" onclick="copyLink('${post._id}');">Copy Link</button>

                            ${own ? `
                                <button class="editButton" onclick="window.location.href = '../html/newPostPage.html';">Edit Post</button>
                                <button class="deleteButton" onclick="window.location.href='/posts/delete/${post._id}?userId=${activeId}&from=profile'">Delete Post</button>
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
                <div id="posttile" onclick="window.location.href='/posts/${post._id}';">
                    <h2>${post.title}</h2>
                </div>
            ` : "" }

            <!-- POST CAPTION HERE -->
            <!-- TO CHANGE: href link -->
            <div id="usercaption" onclick="window.location.href='/posts/${post._id}';">${post.content}</div>

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

                    <button class="postoptionbutton actionButton" onclick="window.location.href='../html/replyPage.html'">
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
/* ---- CODE FUNCTION ---- */
function loadTimelinePosts() {
    const container = document.getElementById("postFeed");

    let userCheck = '';
    let activeId = '';
    if (activeUserDetails) {
        userCheck = activeUserDetails.username;
        activeId = activeUserDetails._id;
    }

    if (!timelinePosts || timelinePosts.length === 0) {
         container.innerHTML += `
            <!-- IF POST FEED IS EMPTY-->
            <div class="emptyTimeline">
                <p id="emptyFeed">Wow, such empty</p>
            </div> 
         `;
         return;
    }

    let postCounter = 1;

    timelinePosts.forEach(post => {
        // set date
        date = post.postDate;
        /**
         *  timeLinePost is an array of an array
         *  the actual post is nested on timeLinePost[index]
         * 
         *  for visualization:
         *      timelinePost[0] -
         *          post[0] - 
         *              actual post
         */
        post = post.post;

        const postElement = document.createElement("div");
        postElement.classList.add("postLink");
        postElement.classList.add(post.parentPost != null ? "comment" : "post");
        postElement.id = `post${postCounter}`;
        postElement.setAttribute("data-post-id", `post${postCounter}`);

        own = post.author.username === userCheck;
        // check if liked post
        liked = !!checkLiked(post);
        // check if bookmarked post
        bookmarked = !!checkBookmarked(post);
        // check if disliked post
        disliked = !!checkDisliked(post);
        
        let postContent = "";

        // only show posts and not comments
        if (post.parentPost != null) 
            return;

        postContent += `
            <!-- POST USER -->
            <div class="postUser">
                <div class="profilePic" onclick="window.location.href='/profile/${post.author.username}?userId=${activeId}'" style="cursor: pointer;">
                    <img src="${post.author.profilepic}" alt="userProfilePicture" class="userProfilePic">
                </div>

                <div class="usernameAndTime" onclick="window.location.href='/profile/${post.author.username}?userId=${activeId}'" style="cursor: pointer;">
                    <p class="username">${post.author.displayname}</p>
                    <p class="timePosted">${post.author.username} | ${date}</p>
                </div>

                <!-- IF USER IS LOGGED IN -->
                <button class="optionsButton" post-options-id="popUp${postCounter}" onclick="togglePopup('none', '${postCounter}', '${container.id}')">
                    <img src="../resources/Options Button.svg" alt="">
                </button>

                <!-- POST OPTIONS -->
                <div class="popUpOptions" id="popUp${postCounter}">
                    <div class="postOptionsContent">
                        <button class="optionsButton option-exit" onclick="togglePopup('', '${postCounter}', '')">
                                   <img src="/resources/Options Button.svg"/>
                        </button>
                        <button class="editButton" onclick="window.location.href='/posts/${post._id}';">View Post</button>
                        <button class="editButton" onclick="copyLink('${post._id}');">Copy Link</button>

                        ${own ? `
                            <button class="editButton" onclick="window.location.href = '../html/newPostPage.html';">Edit Post</button>
                            <button class="deleteButton" onclick="window.location.href='/posts/delete/${post._id}?userId=${activeId}'">Delete Post</button>
                        ` : ""}
                    </div>
                </div>

            </div>

            <!-- POST CONTENT -->
            <div class="postContent">
                    <!-- TAGS -->
                    <div class="posttags">
                        ${post.tags.map(tag => `<a href="">${tag}</a>`).join(" ")}
                    </div>

                    <div id="posttile" onclick="window.location.href='/posts/${post._id}';">
                        <h2>${post.title}</h2>
                    </div>

                    <!-- POST CAPTION HERE -->
                    <div id="usercaption" onclick="window.location.href='/posts/${post._id}';">${post.content}</div>

                    ${post.images.length > 0 ? `
                        <div id="userphotocontainer">
                            ${post.images.map(function(img) { 
                                return `<img src="${img}" class="clickable-image" onclick="openModal(this)">`;
                            }).join("")}
                        </div>
                    ` : ""}
                </div>
            </div>
        
            <!-- ACTION BUTTONS -->
            <div class="postActions">
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
            </div>

            <div class="postDivider"></div>
        `;

        postElement.innerHTML += postContent;
        container.appendChild(postElement);
        
        postCounter += 1;
    });
}
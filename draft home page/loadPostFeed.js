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
        postElement.classList.add("post");
        postElement.classList.add("postLink");
        postElement.id = `post${postCounter}`;
        postElement.setAttribute("data-post-id", `post${postCounter}`);

        own = post.author.username === userCheck;
        // check if liked post
        liked = !!checkLiked(post);
        // check if bookmarked post
        bookmarked = !!checkBookmarked(post);
        // check if disliked post
        disliked = !!checkDisliked(post);

        // set date
        date = post.postDate;
        
        let postContent = "";

        postContent += `
            <!-- POST USER -->
            <div class="postUser">

                <div class="profilePic">
                    <img src="${post.profilepic}" alt="userProfilePicture" class="userProfilePic">
                </div>

                <div class="usernameAndTime">
                    <p class="username">${post.displayname}</p>
                    <p class="timePosted">${post.username} | ${date}</p>
                </div>

                <!-- IF USER IS LOGGED IN -->
                <button class="optionsButton" post-options-id="popUp${postCounter}" onclick="togglePopup('none', '${postCounter}', '${container.id}')">
                    <img src="../resources/Options Button.svg" alt="">
                </button>

                <!-- POST OPTIONS -->
                <div class="popUpOptions" id="popUp${postCounter}">
                    <div class="postOptionsContent">
                        <button class="activeOptionsButton" post-options-id="popUp${postCounter}" onclick="togglePopup('none', '${postCounter}', '${container.id}')">
                            <img src="../resources/Options Button.svg" alt="">
                        </button>
                            <a href="../html/postPage.html" class="postLink postOptionsButton" data-post-id="post-${postCounter}"><button class="viewButton">View Post</button></a>
                            <a href="../html/newPostPage.html" class="postLink postOptionsButton" data-post-id="post-${postCounter}"><button class="editButton">Copy Link</button></a>

                        ${post.own ? `
                            <a href="../html/newPostPage.html" class="postLink postOptionsButton" data-post-id="post-${postCounter}"><button class="editButton">Edit Post</button></a>
                            <a href="" class="postLink postOptionsButton" data-post-id="post-${postCounter}"><button class="deleteButton">Delete Post</button></a>
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
                    <!--<p class="postTitle">${post.title}</p>-->

                    <div id="posttile" onclick="window.location.href='../html/postPage.html';">
                        <h2>${post.title}</h2>
                    </div>

                    <!-- POST CAPTION HERE -->
                    <!-- TO CHANGE: href link -->
                    <div id="usercaption" onclick="window.location.href='../html/postPage.html';">${post.content}</div>

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
                    <button id="heart" class="actionButton">
                        <img src="${liked ? '../resources/Heart-Clicked.svg' : '../resources/Heart.svg'}"/>
                         <span class="counter">${post.likeCount}</span>
                    </button>
                    <img src="../resources/Line.svg" alt="Line">
                    <button id="heartCrack" class="actionButton">
                        <img src="${disliked ? '../resources/HeartCrack-Clicked.svg' : '../resources/HeartCrack.svg'}"/>
                         <span class="counter">${post.dislikeCount}</span>
                    </button>
                    <a href="../html/replyPage.html" class="postLink" data-post-id="post${postCounter}">
                        <button class="actionButton commentButton">
                            <img src="../resources/Comments.svg"/>
                        </button>
                    </a>
                    <button id="bookmark" class="actionButton">
                        <img src="${bookmarked ? '../resources/Bookmark-Clicked.svg' : '../resources/bookmark.svg'}"/>
                    </button>
                </div>

                <div class="postDivider"></div>
            `;

            postElement.innerHTML += postContent;
            container.appendChild(postElement);
            
            postCounter += 1;
        });
}
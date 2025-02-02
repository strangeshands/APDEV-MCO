/* ---- HARD CODED DATA ---- */
const timelinePosts = [
    {
         replyTo: "",

         displayName: "bartholomewThe5th",
         username: "@catlover420",
         pfp: "resources/cat.jpg",
         tags: ["#funny", "#life", "#school", "#dolphin", "#rainbow", "#ocean", "#morning", "#depression"],
         caption: "everything is ok",
         images: ["resources/dolphin.jpg", "resources/sad-hamster.jpg", "resources/dog.jpg"],
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
         replyTo: "",
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
         replyTo: "",
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

/* ---- CODE FUNCTION ---- */
function loadTimelinePosts() {

    const container = document.getElementById("postFeed");

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

        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.classList.add("postLink");
        postElement.id = `post${postCounter}`;
        postElement.setAttribute("data-post-id", `post${postCounter}`);
        
        let postContent = "";

        postContent += `
            <!-- POST USER -->
            <div class="postUser">

                <div class="profilePic">
                    <img src="${post.pfp}" alt="userProfilePicture" class="userProfilePic">
                </div>

                <div class="usernameAndTime">
                    <p class="username">${post.displayName}</p>
                    <p class="timePosted">${post.username} | ${post.time}</p>
                </div>

                <!-- IF USER IS LOGGED IN -->

                <!-- POST OPTIONS -->
                <div class="popUpOptions" id="popUp${postCounter}">
                    <div class="postOptionsContent">
                            <button class="activeOptionsButton" post-options-id="popUp${postCounter}">
                                <img src="resources/Options Button.svg" alt="">
                            </button>
                            <a href="postPage.html" class="postLink postOptionsButton" data-post-id="post2"><button class="viewButton">View Post</button></a>
                            <a href="newPostPage.html" class="postLink postOptionsButton" data-post-id="post2"><button class="editButton">Edit Post</button></a>
                            <a href="newPostPage.html" class="postLink postOptionsButton" data-post-id="post2"><button class="editButton">Copy Link</button></a>
                            <a href="" class="postLink postOptionsButton" data-post-id="post2"><button class="deleteButton">Delete Post</button></a>
                        </div>
                </div>

                <button class="optionsButton" post-options-id="popUp${postCounter}">
                    <img src="resources/Options Button.svg" alt="">
                </button>

            </div>

            <!-- POST CONTENT -->
            <div class="postContent">

                    <!-- TAGS -->
                    <div class="posttags">
                        ${post.tags.map(tag => `<a href="">${tag}</a>`).join(" ")}
                    </div>
                    <!--<p class="postTitle">${post.title}</p>-->

                    <div id="posttile" onclick="window.location.href='postPage.html';">
                        <h2>${post.title}</h2>
                    </div>

                    <!-- POST CAPTION HERE -->
                    <!-- TO CHANGE: href link -->
                    <div id="usercaption" onclick="window.location.href='postPage.html';">${post.caption}</div>

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
                        <img src="${post.liked ? 'resources/Heart-Clicked.svg' : 'resources/Heart.svg'}"/>
                         <span class="counter">${post.likes}</span>
                    </button>
                    <img src="resources/Line.svg" alt="Line">
                    <button id="heartCrack" class="actionButton">
                        <img src="${post.disliked ? 'resources/HeartCrack-Clicked.svg' : 'resources/HeartCrack.svg'}"/>
                         <span class="counter">${post.dislikes}</span>
                    </button>
                    <a href="replyPage.html" class="postLink" data-post-id="post${postCounter}">
                        <button class="actionButton commentButton">
                            <img src="resources/Comments.svg"/>
                        </button>
                    </a>
                    <button id="bookmark" class="actionButton">
                        <img src="${post.bookmark ? 'resources/Bookmark-Clicked.svg' : 'resources/bookmark.svg'}"/>
                    </button>
                </div>

                <div class="postDivider"></div>
            `;

            postElement.innerHTML += postContent;
            container.appendChild(postElement);
            
            postCounter += 1;
        });

    const sendingPostsDataScript = document.createElement("script");
    sendingPostsDataScript.src = "sendingPostData.js";
    document.body.appendChild(sendingPostsDataScript);

    const displayOptionsScript = document.createElement("script");
    displayOptionsScript.src = "displayPostOptions.js";
    document.body.appendChild(displayOptionsScript);
}
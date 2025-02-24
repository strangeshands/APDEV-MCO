/* ---- HARD CODED DATA ---- */
const userComments = [
    {
         replyTo: "@TheDarkKnight",

         displayName: "DARNA",
         username: "@AkoSiDarna",
         pfp: "../resources/pfpSample.jpg",
         tags: [],
         caption: "I SAW U EARLIER HOLY MACARONI he's hot irl",
         images: ["../resources/batman.jpg"],
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
         pfp: "../resources/pfpSample.jpg",
         tags: [],
         title: "",
         caption: "sometimes i just wonder how's it like being a metal arm...",
         images: ["../resources/metal-arm.jpg"],

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
function loadNavComments() {
    const container = document.getElementById("userCommentsContent");

    if (!userPosts || userPosts.length === 0) {
        container.innerHTML = `
            <!-- IF USER HAS NOT MADE ANY COMMENTS YET -->    
            <div class="noPostsOrComments">No Comments Available</div>           
        `;
         return;
    }

    let postCounter = 1;

    userComments.forEach(post => {
         const postElement = document.createElement("a");
         postElement.classList.add("postLink");
         postElement.classList.add("userPostLink");
         postElement.setAttribute("data-post-id", `userComment${postCounter}`);
         postElement.setAttribute("href", "../html/postpage.html");
         
         let postContent = "";

         postContent += `
            <button class="userPost" id="userComment${postCounter}">
                <img class="userPostImage" src="../resources/Arrow Curve Up Right.svg" alt="User Post Image">
                <p class="userComment">${post.caption}</p>
            </button>
         `;

         postElement.innerHTML = postContent;
         container.appendChild(postElement);
         postCounter += 1;
    });

}
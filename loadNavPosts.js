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
function loadNavPosts() {
    const container = document.getElementById("userPostsContent");

    if (!userPosts || userPosts.length === 0) {
        container.innerHTML = `
            <!-- IF USER HAS NOT MADE ANY POSTS YET -->    
            <div class="noPostsOrComments">No Posts Available</div>           
        `;
         return;
    }

    let postCounter = 1;

    userPosts.forEach(post => {
         const postElement = document.createElement("a");
         postElement.classList.add("postLink");
         postElement.classList.add("userPostLink");
         postElement.setAttribute("data-post-id", `userPost${postCounter}`);
         postElement.setAttribute("href", "postpage.html");
         
         let postContent = "";

         postContent += `
            <button class="userPost" id="userPost${postCounter}">
                ${post.images.length > 0 ? `
                    <img class="userPostImage" src="${post.images[0]}" alt="User Post Image">
                ` : `<img class="userPostImage" src="resources/Image Holder.svg" alt="User Post Image">`}
                <p class="userPostTitle">${post.title}</p>
            </button>
            
         `;

         postElement.innerHTML = postContent;
         container.appendChild(postElement);
    });

    
}
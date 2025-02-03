function renderComments(comments, container) {
    comments.forEach(comment => {
        // Create a container for the comment
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');

        // Build the HTML for this comment.
        commentDiv.innerHTML = `
            <div class="postHeader">
                <div class="userInfo">
                    <div class="avatar" id="postAvatar">
                        <img src="${comment.pfp}" alt="${comment.displayName}">
                    </div>
                    <div class="username-and-time">
                        <div class="displayName" id="postDisplayName">${comment.displayName}</div>
                        <div class="time" id="postTime">${comment.username} | ${comment.time}</div>
                    </div>
                </div>
                <!-- IF POST BELONGS TO USER
                <button class="optionsButton" id="postOptions">
                    <img src="resources/Options Button.svg" alt="Options">
                </button> -->
            </div>
            <div class="commentText">
                ${comment.caption}
            </div>
            <div class="commentActions">
                <button class="actionButton" id="heart">
                    <img src="resources/Heart.svg"/>
                    <span class="counter">${comment.likes}</span>
                </button>
                <img src="resources/Line.svg" alt="Line">
                <button class="actionButton" id="heartCrack">
                    <img src="resources/HeartCrack.svg"/>
                    <span class="counter">${comment.dislikes}</span>
                </button>
                <button class="actionButton" onclick="window.location.href='replyPage.html'">
                    <img src="resources/Comments.svg"/>
                </button>
                <button class="actionButton" id="bookmark">
                    <img src="resources/bookmark.svg"/>
                </button>
            </div>
            ${ comment.comments && comment.comments.length > 0 ? `
                <a href="#" class="viewRepliesLink" data-post-id="sampleComment${comment.id}">
                    <div class="replyIndicator">
                        <div class="replyLine"></div>
                        <span class="replyCount">View replies (${comment.comments.length})</span>
                    </div>
                </a>
            ` : "" }
        `;

        // Append the comment to the main container
        container.appendChild(commentDiv);
    });
}

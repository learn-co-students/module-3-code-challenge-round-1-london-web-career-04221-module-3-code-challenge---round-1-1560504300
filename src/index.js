document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderPage();
});
//////////////////////////////////
let imageId = 2833;
const imageURL = `https://randopic.herokuapp.com/images/${imageId}`;
const likeURL = `https://randopic.herokuapp.com/likes/`;
const commentsURL = `https://randopic.herokuapp.com/comments/`;
const image = document.querySelector("#image");
const imageName = document.querySelector("#name");
const likes = document.querySelector("#likes");
const likeBtn = document.querySelector("#like_button");
const form = document.querySelector("#comment_form");
const ul = document.querySelector("#comments");

//////////////////////////////////
function fetchPicture() {
  return fetch(imageURL).then(response => response.json());
}
//////////////////////////////////
function renderPage(json) {
  ul.innerHTML = "";
  image.src = json.url;
  imageName.innerText = json.name;
  likes.innerText = json.like_count;

  json.comments.forEach(function(comment) {
    const li = document.createElement("li");
    li.innerText = comment.content;
    let deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteBtn";
    deleteBtn.innerText = "Delete";
    li.appendChild(deleteBtn);
    ul.appendChild(li);
    deleteBtn.addEventListener("click", () => deleteComment(comment));
  });
}
//////////////////////////////////
function fetchAndRenderPage() {
  fetchPicture().then(renderPage);
}
//////////////////////////////////
likeBtn.addEventListener("click", addANewLikeToPage);
//////////////////////////////////
function addANewLikeToPage() {
  event.preventDefault();

  likes.innerText = Number(likes.innerText) + 1;

  const newLikes = {
    like_count: likes.innerText,
    image_id: imageId
  };

  updateLikesToServer(newLikes).then(fetchAndRenderPage);
}
//////////////////////////////////
function updateLikesToServer(newLikes) {
  return fetch(likeURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify(newLikes)
  });
}
//////////////////////////////////
form.addEventListener("submit", addNewCommentToThePage);
//////////////////////////////////
function addNewCommentToThePage() {
  event.preventDefault();

  const newComment = {
    content: event.target[0].value,
    image_id: imageId
  };

  addCommentToServer(newComment).then(fetchAndRenderPage);

  event.target.reset();
}
//////////////////////////////////
function addCommentToServer(newComment) {
  return fetch(commentsURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newComment)
  });
}
//////////////////////////////////
function deleteComment(comment) {
  const parent = event.target.parentElement;
  deleteCommentFromServer(comment.id).then(() => parent.remove());
}
//////////////////////////////////
function deleteCommentFromServer(id) {
  return fetch(commentsURL + id, {
    method: "DELETE"
  });
}
//////////////////////////////////

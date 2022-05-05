const socket = io.connect();

socket.on("toClient", (msg) => {
  console.log(msg);
});
socket.emit("toServer", "client side at home page respond to backend server");

//----------------get content data from server, and post to main page content preview-------------

let postsContainer = document.querySelector("#all-post-container");

async function getPost() {
  let res = await fetch("/post");
  let result = await res.json();
  console.log(result);
  let posts = result.posts;
  for (let post of posts) {
    console.log("adding post...");
    postsContainer.innerHTML += `<div class="content-box cnt${post.id}">
    <div class="inner-upper-content">
      <i class="upper-content-top-icon fa-solid fa-eye"></i>
      <img class="content-img"
        src="https://docs.microsoft.com/en-us/shows/hello-world/media/helloworld_383x215.png">
      <i class="upper-content-bottom-icon fa-solid fa-heart"></i>
    </div>
    <div class="inner-center-content">${post.title}
      <div class="content-tag">hashtag</div>
      <p class="content">${post.content}</p>
    </div>
    <div class="inner-bottom-content">
      <img class="user-pic"
        src="https://dvg5hr78c8hf1.cloudfront.net/2016/06/21/15/37/47/4b0b2595-20dc-40bc-a963-e8e53b2fd5bf/1*2cAvoDuXZp_dy49WqNVVrA.jpeg">
      <div class="userid-postdate">${post.created_at}</div>
    </div>
  </div>`;
  }
}

getPost();

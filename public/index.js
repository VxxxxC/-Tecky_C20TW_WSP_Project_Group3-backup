
// socket.on("toClient", (msg) => {
//   console.log(msg);
// });
// socket.emit("toServer", "client side at home page respond to backend server");

//----------------get content data from server, and post to main page content preview-------------
let contentIndex = 0;

let postsContainer = document.querySelector("#all-post-container");

async function getPost() {
  postsContainer.innerHTML = "";

  console.log("getting posts...");
  let res = await fetch("/main", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ contentIndex }),
  });

  let result = await res.json();
  let posts = result.posts;
  console.log(posts);
  for (let post of posts) {
    postsContainer.innerHTML += `<div class="content-box cnt${post.id}">
    <div class="inner-upper-content">
      <i class="upper-content-top-icon fa-solid fa-eye"></i>
      <img class="content-img"
        src="${"/img/" + post.image}">
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
    <a href="/content-page.html?id=${post.id}">more detail</a>
  </div>`;
  }
}
getPost();

<<<<<<< HEAD




=======
//-----------------FIXME: pagination----------------------------

// async function pagination() {
//   let pageBtn = document.querySelector(".pagebutton.page");
//   let preBtn = document.querySelector(".previous-page");
//   let nextBtn = document.querySelector(".next-page");

//   let pageNumber = 1;
//   let totalPage = 0;

//   let res = await fetch("/post");
//   let result = await res.json();
//   let posts = result.posts;
//   for (let post of posts) {
//     // console.log(post.id);

//     function createPageButton() {
//       if (post.id % 8 === 0) {
//         totalPage += post.id / 8;
//         for (let i = 1; i < totalPage; i++) {
//           console.log({ i: i });
//           let pagebutton = document.querySelector(".pagebutton.page");

//           let page = document.createElement("div");
//           page.setAttribute("class", "page");
//           page.textContent += i;
//           pagebutton.appendChild(page);
//         }
//       }
//     }
//     createPageButton();
//   }
// }

// pagination();

//---------------choosing page data from database-----------
let selectPage = document
  .querySelector(".pagebutton.page")
  .addEventListener("click", (event) => {
    console.log(event.target.innerHTML);

    contentIndex = (event.target.innerText - 1) * 8;

    async function changePage() {
      postsContainer.innerHTML = "";

      let res = await fetch("/main", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentIndex }),
      });

      let result = await res.json();
      let posts = result.posts;
      for (let post of posts) {
        postsContainer.innerHTML += `<div class="content-box cnt${post.id}">
    <div class="inner-upper-content">
      <i class="upper-content-top-icon fa-solid fa-eye"></i>
      <img class="content-img"
        src="${"/img/" + post.image}">
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
    changePage();
  });
>>>>>>> 1787499b809002ad4c9fbf96766362cb28f324f7

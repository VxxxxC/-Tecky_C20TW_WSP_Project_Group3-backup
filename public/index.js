//----------------Socket.IO client side--------------------
const socket = io.connect();

socket.on("toClient", (msg) => {
  console.log(msg);
});
socket.emit("toServer", "client side at home page respond to backend server");

//---------querySelector area-----------------
let pageBtn = document.querySelector("#page");
let pageNumber = pageBtn.textContent;
let preBtn = document.querySelector(".previous-page");
let nextBtn = document.querySelector(".next-page");

//----------------check current page function-------------

function equalOfPage(pageNum, contentInd) {
  if (pageNum % 1 === 0 && contentInd % 8 === 0) {
    return true;
  } else {
    return false;
  }
}

function checkCurrentPage() {
  if (equalOfPage(pageNumber, contentIndex) === true) {
    pageBtn.style.background = "rgba(40, 40, 40, 0.8)";
    pageBtn.style.color = "white";
  }
}

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
    postsContainer.innerHTML += `<a href="/content-page.html?id=${
      post.id
    }" style="text-decoration:none; color:black">
    <div class="content-box cnt${post.id}">
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
  </div>
  </a>`;
  }
  checkCurrentPage();  // FIXME: 功能正常，但還有判斷不足
}
getPost();

//-----------------FIXME: pagination----------------------------

// async function pagination() {

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
//         }
//       }
//     }
//     createPageButton();
//   }
// }

// pagination();

//---------------choosing page data from database-----------
let selectPage = document
  .querySelector("#page")
  .addEventListener("click", (event) => {
    console.log(event.target.innerHTML);

    contentIndex = (event.target.innerText - 1) * 8;
    console.log({ contentIndex: contentIndex });

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
        postsContainer.innerHTML += `<a href="/content-page.html?id=${
          post.id
        }" style="text-decoration:none; color:black">
        <div class="content-box cnt${post.id}">
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
  </div>
  </a>`;
      }
    }
    checkCurrentPage(); // FIXME: 功能正常，但還有判斷不足
    changePage();
  });

// let pageBtn = document.querySelector("#page");
// let newPage = pageBtn.cloneNode(true);
// newPage.textContent = 3;
// pageBtn.insertAdjacentElement("beforeend", newPage);

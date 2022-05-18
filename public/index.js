// const { RESERVED_EVENTS } = require("socket.io/dist/socket");
let posts;

//----------------Socket.IO client side--------------------
const socket = io.connect();

socket.on("toClient", (msg) => {
  console.log(msg);
});
socket.emit(
  "toServer",
  "SocketIO on !! Home page listening to backend server..."
);

//---------querySelector area-----------------
let buttonList = document.querySelector(".button-list");
let pageNumber = document.querySelector("#page-number");
let pageNumberText = pageNumber.innerHTML;
let preBtn = document.querySelector(".previous-page");
let nextBtn = document.querySelector(".next-page");

//---------------- FIXME: check current page function-------------

// function equalOfPage(pageNum, contentInd) {
//   if (pageNum % 1 === 0 && contentInd % 8 === 0) {
//     return true;
//   } else {
//     return false;
//   }
// }

// function checkCurrentPage() {
//   if (equalOfPage(pageNumberText, contentIndex) === false) {
//     console.log({ equalOfPage: false });
//     return;
//   } else {
//     console.log({ equalOfPage: true });
//     pageNumber.style.background = "rgba(40, 40, 40, 0.8)";
//     pageNumber.style.color = "white";
//   }
// }

//---------------render post---------------------------

function renderPage(posts) {
  postsContainer.innerHTML = "";
  for (let post of posts) {
    if (post.image == null) {
      postsContainer.innerHTML += `
      <div class="content-box cnt${post.id}">
      <a href="/content-page.html?id=${
        post.id
      }" style="text-decoration:none; color:black">
      <div class="inner-upper-content">
        <i class="upper-content-top-icon fa-solid fa-eye"></i>
        <div class="content-img" style="color: rgba(128, 128, 128, 0.5);">user have not upload image of this post😢</div>
        <i class="upper-content-bottom-icon fa-solid fa-heart"></i>
      </div>
      <div class="inner-center-content">${post.title}
      <div id="content-tag-${post.id}">
      <div class="content-tag"></div>
        </div>
        <p class="content">${post.content}</p>
      </div>
      </a>
      <div class="inner-bottom-content">
      <div class="user-pic"></div>
        <div class="userid-postdate">${moment(post.created_at).format(
          "LL"
        )}</div>
        <button class="delete-btn" id=btn${post.id}>delete</button>
      </div>
    </div>
  `;
      getHashtag(post.id);
    } else {
      postsContainer.innerHTML += `
    <div class="content-box cnt${post.id}">
    <a href="/content-page.html?id=${
      post.id
    }" style="text-decoration:none; color:black">
    <div class="inner-upper-content">
      <i class="upper-content-top-icon fa-solid fa-eye"></i>
      <img class="content-img"
        src="${"/img/" + post.image}">
      <i class="upper-content-bottom-icon fa-solid fa-heart"></i>
    </div>
    <div class="inner-center-content">${post.title}
    <div id="content-tag-${post.id}">
    <div class="content-tag"></div>
      </div>
      <p class="content">${post.content}</p>
    </div>
    </a>
    <div class="inner-bottom-content">
    <div class="user-pic"></div>
      <div class="userid-postdate">${moment(post.created_at).format("LL")}</div>
      <button class="delete-btn" id=btn${post.id}>delete</button>
    </div>
  </div>
  `;
      getHashtag(post.id);
    }
  }
}

//--------------------fetch each post hashtag---------------------

async function getHashtag(id) {
  let result = await fetch(`tags/${id}`);
  let res = await result.json();
  let contentTagContainer = document.querySelector(`#content-tag-${id}`);
  contentTagContainer.style.display = "flex";
  contentTagContainer.style.flexWrap = "wrap";

  let newTagTemplate = contentTagContainer.querySelector(".content-tag");
  newTagTemplate.remove();

  for (let tag of res) {
    let newTag = newTagTemplate.cloneNode(true);
    newTag.innerHTML = tag.name;
    contentTagContainer.appendChild(newTag);
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
  console.log({ posts });

  renderPage(posts);

  let deleteBtnList = document.querySelectorAll(".delete-btn");
  let contentBox = document.querySelector(".contentBox");

  deleteBtnList.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", () => {
      // console.log("delete post");
      let postId = deleteBtn.id.replace("btn", "");
      Swal.fire({
        title: "Confirm to delete memo?",
        text: `You are going to delete?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#333",
        confirmButtonText: "Confirm to delete",
        cancelButtonText: "Do not delete",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`/post/` + postId, { method: "DELETE" }) //reminder
            .then((res) => res.json())
            .catch((err) => ({ error: String(err) }))
            .then((json) => {
              if (json.error) {
                Swal.fire("Cannot Delete", json.error, "error");
              } else {
                Swal.fire("Deleted!", "The post is deleted.", "success");
                contentBox.remove();
              }
            });
        }
      });
    });
  });

  pagination();
}
getPost();

// async function loadButton(){}

//-----------------pagination----------------------------

async function pagination() {
  buttonList.removeChild(pageNumber);

  let res = await fetch("/main");
  let result = await res.json();
  posts = result.posts;
  console.log("pagination:", posts);
  let postLength = posts.length; // 9
  let pageLength = 1; // 0
  while (postLength >= 0) {
    let newPageButton = pageNumber.cloneNode(true);
    newPageButton.className = "Page-" + pageLength;
    newPageButton.innerHTML += pageLength;

    buttonList.appendChild(newPageButton);

    postLength -= 8;
    pageLength += 1;
  }
}

//---------------choosing page data from database-----------

buttonList.addEventListener("click", async(event) => {
  // console.log(event.target.innerHTML);

  contentIndex = (event.target.innerText - 1) * 8;
  // console.log({ contentIndex: contentIndex });

  async function clickPage() {
    postsContainer.innerHTML = "";

    let res = await fetch("/main", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contentIndex }),
    });

    let result = await res.json();
    posts = result.posts;
    renderPage(posts);
    let deleteBtnList = document.querySelectorAll(".delete-btn");
    let contentBox = document.querySelector(".contentBox");

    deleteBtnList.forEach((deleteBtn) => {
      deleteBtn.addEventListener("click", () => {
        // console.log("delete post");
        let postId = deleteBtn.id.replace("btn", "");
        let deleteBox = document.querySelector(`.cnt${postId}`);

        Swal.fire({
          title: "Confirm to delete memo?",
          text: `You are going to delete?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#333",
          confirmButtonText: "Confirm to delete",
          cancelButtonText: "Do not delete",
        }).then((result) => {
          if (result.isConfirmed) {
            fetch(`/post/` + postId, { method: "DELETE" }) //reminder
              .then((res) => res.json())
              .catch((err) => ({ error: String(err) }))
              .then((json) => {
                if (json.error) {
                  Swal.fire("Cannot Delete", json.error, "error");
                } else {
                  Swal.fire("Deleted!", "The post is deleted.", "success");
                  deleteBox.remove();
                }
              });
          }
        });
      });
    });
  }
  await clickPage();
  
});

// let pageBtn = document.querySelector("#page");
// let newPage = pageBtn.cloneNode(true);
// newPage.textContent = 3;
// pageBtn.insertAdjacentElement("beforeend", newPage);

// get what role is the user:normal user or admin

//----------------check login status---------------------
fetch("/is_admin")
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((json) => {
    let adminEl = document.querySelector(".admin");
    if (json.role) {
      adminEl.textContent = json.role === "admin" ? "Admin" : "Member";
    } else {
      adminEl.textContent = "Guess";
    }
  })
  .catch((error) => ({ error: String(error) }));

//-----------------logout form----------------------------
let logoutForm = document.querySelector("#logout-form");
logoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("/logout", {
    method: "POST",
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      Swal.fire({
        icon: "success",
        title: "Logout",
        text: "Already logout!",
        footer: '<a href="login.html">Log in</a>',
      }).then(function () {
        window.location = "/";
      });
    })
    .catch((error) => ({ error: String(error) }));
});

//-------------seesion check User login----------

fetch("/session").then((res) =>
  res
    .json()
    .then((json) => {
      console.log(json);

      let loginBtn = document.querySelector(".right-selection.login");
      let logoutBtn = document.querySelector("#logout-form");

      if (json.id == null) {
        console.log(`please login`);
        loginBtn.classList.add("show");
        logoutBtn.classList.add("hidden");
      } else {
        console.log(`welcome!!`);
        loginBtn.classList.add("hidden");
        logoutBtn.classList.add("show");
      }
    })
    .catch((error) => ({ error: String(error) }))
);

//---------------navbar hashtag searching--------------

fetch("/search").then((res) => {
  res.json().then((json) => {
    let result = json.result;
    console.log("rank result: ", result);
    let hashtagList = document.querySelector(".navbar-button");
    let hashtag = document.querySelector(".nav-hashtag");
    hashtagList.remove();
    hashtag.remove();

    for (let tag of result.rows) {
      console.log(tag);
      let newTag = hashtagList.cloneNode(true);
      let tagname = hashtag.cloneNode(true);
      tagname.classList.add(`rank-${tag.rank}`);
      tagname.innerHTML = tag.name;
      tagname.addEventListener("click", (event) => {
        let tag = event.currentTarget.textContent;
        console.log(posts);
        console.log(tag);
      });
      newTag.appendChild(tagname);
      document.querySelector(".navbar").appendChild(newTag);
    }
  });
});

//-----------navbar hashtag button onclick search-------------

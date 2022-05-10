// const { RESERVED_EVENTS } = require("socket.io/dist/socket");

//----------------Socket.IO client side--------------------
// const socket = io.connect();

// socket.on("toClient", (msg) => {
//   console.log(msg);
// });
// socket.emit("toServer", "client side at home page respond to backend server");

//---------querySelector area-----------------
let buttonList = document.querySelector(".button-list");
let pageNumber = document.querySelector("#page-number");
let pageNumberText = pageNumber.textContent;
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
  if (equalOfPage(pageNumberText, contentIndex) === true) {
    pageNumber.style.background = "rgba(40, 40, 40, 0.8)";
    pageNumber.style.color = "white";
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
    <a href="/content-page.html?id=${post.id}">more detail</a>
  </div>
  </a>`;
  }
  checkCurrentPage(); // FIXME: 功能正常，但未能準確判斷
}
getPost();

//-----------------TODO: FIXME: pagination----------------------------

async function pagination() {
  pageNumber.innerHTML = "";

  let res = await fetch("/main");
  let result = await res.json();
  let posts = result.posts;
  for (let post of posts) {
    console.log(post.id);

    if (post.id % 8 === 0) {
      let buttonNum = 0;
      buttonNum++;

      let newPageButton = document.createElement("div");
      newPageButton.classList.add("page-number");
      newPageButton.textContent += buttonNum;

      document.body.appendChild(newPageButton);
    }

    // function createPageButton() {
    //   if (post.id % 8 === 0) {
    //     totalPage += post.id / 8;
    //     for (let i = 1; i < totalPage; i++) {
    //       console.log({ i: i });
    //     }
    //   }
    // }
    // createPageButton();
  }
}
// pagination();

//---------------choosing page data from database-----------
buttonList.addEventListener("click", (event) => {
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
    <button class="edit-btn">
    <i class="upper-content-top-icon bi bi-eye"></i>
    </button>
   
      <img class="content-img"
        src="${"/img/" + post.image}">
      <i class="upper-content-bottom-icon bi bi-heart"></i>
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
  checkCurrentPage(); // FIXME: 功能正常，但未能準確判斷
  changePage();
});

// let pageBtn = document.querySelector("#page");
// let newPage = pageBtn.cloneNode(true);
// newPage.textContent = 3;
// pageBtn.insertAdjacentElement("beforeend", newPage);


// get what role is the user:normal user or admin


fetch('/is_admin')
.then(res => res.json())
.catch(error => ({ error: String(error) }))
.then(json => {

  let admin = document.querySelector('.admin')
  
  admin.textContent = json.role === 'admin' ? 'Admin' : 'Member';

})


 
//   function ajaxForm(options) {
//     const { form, getBody, cb } = options
//     form.addEventListener('submit', event => {
//       event.preventDefault()
//       Promise.resolve(getBody)
//         .then(getBody => JSON.stringify(getBody()))
//         .then(body =>
//           fetch(form.action, {
//             method: form.method,
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body,
//           }),
//         )
//         .then(res => res.json())
//         .catch(error => ({ error: String(error) }))
//         .then(cb)
//     })
//   }



//   ajaxForm({
//     form: loginForm,
//     getBody() {
//       return {
//         username: loginForm.username.value,
//         password: loginForm.password.value,
//       }
//     },
//     cb: json => {
//       if (json.error) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Failed to login: ' + json.error,
//         })
//         return
//       }
//       user_id = json.id
//       loadUserStyle()
//     },
//   })


// ajaxForm({
//   form: logout-Form,
//   getBody() {
//     return {}
//   },
//   cb: json => {
//     if (json.error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Failed to logout: ' + json.error,
//       })
//       return
//     }
//     unloadAdminStyle()
//   },
// })




// fetch('/logout')
// .then(res=>res.JSON())
// .catch(error => ({ error: String(error) }))
// .then(json=>{
//   let logout = document.querySelector('#logout')
//   logout.textContent = 'login';
// })



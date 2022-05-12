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
let pageNumberText = pageNumber.innerHTML;
let preBtn = document.querySelector(".previous-page");
let nextBtn = document.querySelector(".next-page");

//----------------TODO: FIXME: check current page function-------------

function equalOfPage(pageNum, contentInd) {
  if (pageNum % 1 === 0 && contentInd % 8 === 0) {
    return true;
  } else {
    return false;
  }
}

function checkCurrentPage() {
  if (equalOfPage(pageNumberText, contentIndex) === false) {
    console.log({ equalOfPage: false });
    return;
  } else {
    console.log({ equalOfPage: true });
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

  let result = await res.json()
  let posts = result.posts;
  console.log(posts);

 

  for (let post of posts) {

    postsContainer.innerHTML += `
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
      <button class="delete-btn" id=btn${post.id}>delete</button>
    </div>    
    <a href="/content-page.html?id=${post.id}">more detail</a>

  </div>
`;

  }



  let deleteBtnList = document.querySelectorAll('.delete-btn')
  let contentBox = document.querySelector('.contentBox')
  
  deleteBtnList.forEach(deleteBtn=>
    {deleteBtn.addEventListener('click',()=>{
    console.log('delete post')
    console.log()
    let postId = deleteBtn.id.replace('btn','')
    Swal.fire({
      title: 'Confirm to delete memo?',
      text: `You are going to delete?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#333',
      confirmButtonText: 'Confirm to delete',
      cancelButtonText: 'Do not delete',
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`/post/` + postId, { method: 'DELETE' }) //reminder
          .then(res => res.json())
          .catch(err => ({ error: String(err) }))
          .then(json => {
            if (json.error) {
              Swal.fire('Cannot Delete', json.error, 'error')
            } else {
              Swal.fire('Deleted!', 'The post is deleted.', 'success')
              contentBox.remove()
            }
          })
      }
    })
  })})
  

  pagination();
}
getPost();

// async function loadButton(){}

//-----------------pagination----------------------------

async function pagination() {
  buttonList.removeChild(pageNumber);

  let res = await fetch("/main");
  let result = await res.json();
  let posts = result.posts;
  for (let post of posts) {
    console.log(post.id);

    if (post.id % 8 === 1) {
      let buttonNum;
      buttonNum = Math.ceil(post.id / 8);
      console.log({ "create page number": buttonNum });

      let newPageButton = pageNumber.cloneNode(true);
      newPageButton.className = "Page-" + buttonNum;
      newPageButton.innerHTML += buttonNum;

      buttonList.appendChild(newPageButton);
    }
  }
}

//---------------choosing page data from database-----------

buttonList.addEventListener("click", (event) => {
  console.log(event.target.innerHTML);

  contentIndex = (event.target.innerText - 1) * 8;
  console.log({ contentIndex: contentIndex });

  async function clickPage() {
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
    <i class="upper-content-top-icon bi bi-eye"></i>
      <img class="content-img"
        src="${"/img/" + post.image}">
      <i class="upper-content-bottom-icon bi bi-heart"></i>
    </div>
    <div class="inner-center-content">${post.title}
      <div class="content-tag">hashtag</div>
      <p class="content">${post.content}</p>
      <button class="delete-btn">delete</button>
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
  clickPage();
});

// let pageBtn = document.querySelector("#page");
// let newPage = pageBtn.cloneNode(true);
// newPage.textContent = 3;
// pageBtn.insertAdjacentElement("beforeend", newPage);

// get what role is the user:normal user or admin

  fetch('/is_admin')
  .then(res => {
    if (res.ok) {
      return res.json();
    }
  })
  .then(json => {
    let adminEl = document.querySelector('.admin');

    // if (json.role === 'admin') {
    //   adminEl.textContent = 'Admin';
    // }else if (json.role === 'member') {
    //   adminEl.textContent = 'Member';
    // }  
    adminEl.textContent = json.role === 'admin' ? 'Admin' : 'Member';
    
  })
  .catch(error => ({ error: String(error) }))
  

  let logoutForm = document.querySelector('#logout-form')
  logoutForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    fetch('/logout',{
      method: 'POST',
    })
    .then(res => res.json())
    .then(json => {
  console.log(json)
  Swal.fire({
    icon: 'success',
    title: 'Logout',
    text: 'Already logout!',
    footer: '<a href="login.html">Log in</a>'
  })
  .then (function(){
    window.location.href = 'http://localhost:8001/index.html'
  })
      },
      
    )
    .catch(error => ({ error: String(error) }))
  
    })

  
// socket.on('editPost', (msg) => {
//   console.log(msg);
// });
// socket.emit("toServer", "client side at home page respond to backend server");


//==========================fecth content from index to contentpaged================//
let content = document.querySelector(".content");

async function postContent() {
  let params = new URLSearchParams(location.search);
  let id = params.get("id");

  let res = await fetch("/post/" + id);
  let result = await res.json();
  console.log(result);
  // let mainContent = result.detail;
  // console.log(mainContent);
  let post = result.posts;
  if (post.image == null) {
    content.innerHTML = `<div class="title-holder">${post.title}</div>
    <div class="slider">
        <div  class="item">
        <div class="content-img" style="color: rgba(128, 128, 128, 0.5);">user have not upload image of this post😢</div>
        </div>
 </div>
      <div class="text">
      <div class="core">
      ${post.content}
      </div>
      </div>
      <div class="two-button">
      <button class="button" id="edit-btn">
        <i class="bi bi-pencil aria-hidden=" true"></i>
      </button>

      <button class="button" id="comment-btn">
        <i class="bi bi-chat-text"></i>
        </button>
    </div>  
  
    <div class="author">
    <div class="sub-header-1">Author</div>
    <div class="author-name">${post.username}</div>
    <div class="intro">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto excepturi impedit, ipsum, numquam
            temporibus hic iste at, inventore quo perspiciatis laudantium saepe modi! Quos ipsum debitis et
            voluptatem beatae sit.
        </div>
  </div>

  <div class="isolate"></div>

<div class= "message">
  <div class="comment-name">
    comment as JK
  </div>
  <div class="comment-content">
  Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto excepturi impedit, ipsum, numquam
  temporibus hic iste at, inventore quo perspiciatis laudantium saepe modi! Quos ipsum debitis et
  voluptatem beatae sit.
  </div>

</div>
<div class="isolate"></div>

       `;
  } else {
    content.innerHTML = `<div class="title-holder">${post.title}</div>
    <div class="slider">
        <div  class="item">
        <img src="${"/img/" + post.image}">
        </div>
    </div>
      <div class="text">
      <div class="core">
      ${post.content}
      </div>
      </div>

     <div class="two-button">
        <button class="button" id="edit-btn">
          <i class="bi bi-pencil aria-hidden=" true"></i>
        </button>
  
        <button class="button" id="comment-btn">
          <i class="bi bi-chat-text"></i>
          </button>
      </div>
   
  

      <div class="author">
        <div class="sub-header-1">Author</div>
        <div class="author-name">${post.username}</div>
        <div class="intro">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto excepturi impedit, ipsum, numquam
                temporibus hic iste at, inventore quo perspiciatis laudantium saepe modi! Quos ipsum debitis et
                voluptatem beatae sit.
            </div>
      </div>

      <div class="isolate"></div>
       `;
  }

  let editBtn = document.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    console.log("edit post");
    Swal.fire({
      title: "Edit post",
      input: "textarea",
      customClass: "swal-wide",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Save Edit",
      cancelButtonText: "Cancel Edit",
      showLoaderOnConfirm: true,
      preConfirm: (content) => {
        return fetch(`/post/${post.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        })
          .then((res) => res.json())
          .catch((error) => ({ error: String(error) }))
          .then((json) => {
            if (json.error) {
              Swal.showValidationMessage(json.error);
              return;
            }
            console.log("edit success...", json);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      console.log("result:", result);
      if (result.isConfirmed) {
        Swal.fire({
          title: `Saved post`,
        });
        post.textContent = content;
      }
    });
  });
}

postContent();

//-------------check login status---------------
fetch("/is_admin")
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((json) => {
    let adminEl = document.querySelector(".admin");

    // if (json.role === 'admin') {
    //   adminEl.textContent = 'Admin';
    // }else if (json.role === 'member') {
    //   adminEl.textContent = 'Member';
    // }
    adminEl.textContent = json.role === "admin" ? "Admin" : "Member";
  })
  .catch((error) => ({ error: String(error) }));

//---------------logout form-------------------
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
        window.location.href = "/index.html";
      });
    })
    .catch((error) => ({ error: String(error) }));
});

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

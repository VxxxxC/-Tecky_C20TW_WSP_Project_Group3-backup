
// const { RESERVED_EVENTS } = require("socket.io/dist/socket");
// // // ----------------Socket.IO client side--------------------
// let socket = io.connect();

// socket.emit("connect",()=>{
//   console.log('connected')
// })

// socket.on('editPost', (msg) => {
//   console.log(msg);
// });
// socket.emit("toServer", "client side at home page respond to backend server");

//====================checkdata================================//
function checkData() {
  var txtCheck = document.formName;
  if (txtCheck.textarea.value == "") {
    alert("Please enter information in the textarea");
    txtCheck.textarea.focus();
    return false;
  }
}

//==========================fecth content from index to contentpaged================//
let content = document.querySelector(".content");

async function postContent() {
  let params = new URLSearchParams(location.search);
  let id = params.get("id");

  let res = await fetch("/post/" + id);
  let result = await res.json();
  console.log(result);
  let post = result.posts;
  content.innerHTML = `<div class="title-holder">${post.title}</div>
    <div class="slider">
        <div  class="item">
           <img src="${"/img/" + post.image}">
        </div>
 </div>
      <div class="text">${post.content}</div>
      <button class="edit-btn">
      <i class="bi bi-pencil"></i>
      </button>
      <div class="author">
            <div class="sub-header-1">Author</div>
            <div class="author-name">${post.users_id}</div>
            <div class="intro">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto excepturi impedit, ipsum, numquam
                temporibus hic iste at, inventore quo perspiciatis laudantium saepe modi! Quos ipsum debitis et
                voluptatem beatae sit.
            </div>
          
        </div>
       `;

  let editBtn = document.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    console.log("edit post");
    Swal.fire({
      title: "Edit post",
      input: "text",
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

fetch("/is_admin")
  .then((res) => res.json())
  .catch((error) => ({ error: String(error) }))
  .then((json) => {
    let admin = document.querySelector(".admin");
    admin.textContent = json.role === "admin" ? "Admin" : "Member";
  });

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
      })
        .then (function(){
          window.location.href = 'http://localhost:8001/index.html'
        })
       
    })
    .catch((error) => ({ error: String(error) }));
});

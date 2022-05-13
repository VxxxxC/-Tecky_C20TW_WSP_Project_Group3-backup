


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
            <div class="author-name">${post.username}</div>
            <div class="intro">
            </div>
          
        </div>
       `;

  let editBtn = document.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    console.log("edit post");
    Swal.fire({
      title: "Edit post",
      input: "textarea",
      customClass: 'swal-wide',
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

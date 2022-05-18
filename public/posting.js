//----------------Socket.IO client side--------------------
const socket = io.connect();

socket.on("toClient", (msg) => {
  console.log(msg);
});
socket.emit(
  "toServer",
  "SocketIO on !! Posting page listening to backend server..."
);

//-------------------text editor------------------------
let toolbarOptions = [
  [
    {
      align: [],
    },
  ],
  [
    {
      header: [1, 2, 3, 4, 5, 6, false],
    },
  ],
  [
    {
      font: [],
    },
  ],
  [
    {
      color: [],
    },
    {
      background: [],
    },
  ],
  ["link", "image", "video", "formula"],
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [
    {
      list: "ordered",
    },
    {
      list: "bullet",
    },
  ],
  [
    {
      script: "sub",
    },
    {
      script: "super",
    },
  ],
];

let quill = new Quill(".editor", {
  modules: {
    toolbar: toolbarOptions,
  },
  placeholder: "輸入正文內容...",
  theme: "snow",
});

//---------------title value--------------
let title = document.querySelector(".post-title");

//---------------text editor content value--------
let content;
quill.on("text-change", () => {
  content = quill.getText();
  console.log(content);
});

//----------------title image value-----------
let titleImg = document.querySelector(".title-img");

//--------------submit content to server--------------

function submit() {
  document
    .querySelector(".submit-button")
    .addEventListener("click", async (event) => {
      if (title.value == "" || null) {
        alert("Please enter title");
        return;
      }
      if (content == null || "") {
        alert("Please enter content");
        return;
      }

      // let form = document.querySelector("#post-content");
      event.preventDefault();

      let formData = new FormData();

      let tags = [];
      for (let tag of tagContent.querySelectorAll(".tags")) {
        tags.push(tag.textContent);
      }
      console.log({ tags });

      formData.append("image", titleImg.files[0]);
      formData.append("title", title.value);
      formData.append("content", content);
      formData.append("tags", tags);

      for (const entry of formData.entries()) {
        console.log(entry);
      }

      await fetch("/post", {
        method: "POST",
        // headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      console.log("posting...");
      location.href = "/index.html";
    });
}
submit();

//-------------------------Tags-------------------------

let tags = document.querySelector(".tags");
let tagContent = document.querySelector(".tag-content");

tags.addEventListener("keypress", (event) => {
  let tagInput = event.target;
  let inputValue = event.target.value;

  if (event.target.value !== "" && event.key == "Enter") {
    console.log(inputValue);
    let newTag = tags.cloneNode(true);
    newTag.textContent = inputValue;
    newTag.addEventListener("click", (event) => {
      console.log(event.target.textContent);
      tagInput.value = event.target.textContent;
      newTag.remove();
    });
    tagContent.appendChild(newTag);
    event.target.value = "";
    console.log(tagContent.querySelectorAll(".tags"));
  }
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
        window.location.href = "http://localhost:8001/index.html";
      });
    })
    .catch((error) => ({ error: String(error) }));
});

//----------------Socket.IO client side--------------------
const socket = io.connect();

socket.on("toClient", (msg) => {
  console.log(msg);
});
socket.emit(
  "toServer",
  "client side at posting page respond to backend server"
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
});

//----------------title image value-----------
let titleImg = document.querySelector(".title-img");

//--------------submit content to server--------------
document
  .querySelector(".submit-button")
  .addEventListener("click", async (event) => {
    // let form = document.querySelector("#post-content");
    event.preventDefault();
    let formData = new FormData();

    formData.append("image", titleImg.files[0]);
    formData.append("title", title.value);
    formData.append("content", content);

    for (const entry of formData.entries()) {
      console.log(entry);
    }

    await fetch("/post", {
      method: "POST",
      // headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });
    console.log("posting...");
  });

//--------------------------------------------------

// await fetch("/post", {
//   method: "POST",
//   headers: {
//     "content-type": "application/json",
//   },
//   body: JSON.stringify({
//     title: title.value,
//     content: content,
//   }),
// })
//   .then((res) => res.json())
//   .catch((err) => ({ error: string(err) }))
//   .then((json) => {
//     console.log(json);
//   });

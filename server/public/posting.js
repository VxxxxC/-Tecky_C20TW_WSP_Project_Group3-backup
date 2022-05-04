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

quill.on("text-change", () => {
  let text = quill.getText();
  console.log(text);
});

const title = document.querySelector(".post-title").value;
console.log(title);

document.querySelector(".submit-button").addEventListener("submit", async() => {

})
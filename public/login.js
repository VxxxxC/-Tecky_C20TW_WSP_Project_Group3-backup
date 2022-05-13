let loginForm = document.querySelector("#login-form");
//-- ensure all input are filled------
function validateForm() {
  let a = document.forms["Form"]["username"].value;
  let b = document.forms["Form"]["password"].value;

  if (!a || !b) {
    alert("Please Fill All Required Fields");
    return false;
  }
}

//--login method----

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("/login", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: loginForm.username.value,
      password: loginForm.password.value,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      //   console.log(json);
      // console.log('hihi');

      if (json.error) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: "error",
          title: "Failed to auto login: " + json.error,
        });
        // console.error('failed to check role:', json.error)
        // return
      }
      loadingPage();
    })
    .catch((error) => ({ error: String(error) }));
});

function loadingPage() {
  let myWindow = window.open(
    "/loading_page.html",
    "myWindow",
    "width=500, height=500"
  );

  setTimeout(() => {
    myWindow.close();
    location.href = "/index.html";
  }, 1500);
}

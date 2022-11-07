let signupForm = document.querySelector("#sign-form");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("/signup", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: signupForm.username.value,
      password: signupForm.password.value,
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
          title: "Failed to auto signup: " + json.error,
        });
        // console.error('failed to check role:', json.error)
        return;
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

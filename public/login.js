let loginForm = document.querySelector('#login-form')
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

  fetch('/session')
  .then(res => res.json())
  .catch(error => ({ error: String(error) }))
  .then(json => {
    if (json.error) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: toast => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
      })

      Toast.fire({
        icon: 'error',
        title: 'Failed to auto login: ' + json.error,
      })
      console.error('failed to check role:', json.error)
      return
    }
    user_id = json.id
    if (json.username) {
      loadUserStyle()
    }
  })




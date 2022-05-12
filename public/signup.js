function validateForm() {
    let a = document.forms["Form"]["username"].value;
    let b = document.forms["Form"]["password"].value;

    if (!a || !b) {
      alert("Please Fill All Required Fields");
      return false;
    }
  }





let signupForm = document.querySelector('#sign-form');


loginForm.addEventListener('submit', (e)=>{
  e.preventDefault()
  fetch('/signup',{
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username:signupForm.username.value, password:signupForm.password.value})
  })
  .then(res => res.json())
  .then(json => {
  //   console.log(json);
  // console.log('hihi');

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
        title: 'Failed to auto signup: ' + json.error,
      })
      // console.error('failed to check role:', json.error)
      // return
    }
    window.location.href = '/'
  })
  .catch(error => ({ error: String(error) }))
})
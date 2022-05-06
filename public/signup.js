function validateForm() {
    let a = document.forms["Form"]["username"].value;
    let b = document.forms["Form"]["password"].value;

    if (!a || !b) {
      alert("Please Fill All Required Fields");
      return false;
    }
  }


let signupForm = document.querySelector('#sign-form');

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
      checkAllMemoOwnership()
    }
  })

  
  function ajaxForm(options) {
    const { form, getBody, cb } = options
    form.addEventListener('submit', event => {
      event.preventDefault()
      Promise.resolve(getBody)
        .then(getBody => JSON.stringify(getBody()))
        .then(body =>
          fetch(form.action, {
            method: form.method,
            headers: {
              'Content-Type': 'application/json',
            },
            body,
          }),
        )
        .then(res => res.json())
        .catch(error => ({ error: String(error) }))
        .then(cb)
    })
  }
  
  
  ajaxForm({
    form: signupForm,
    getBody() {
      if (signupForm.password.value !== signupForm.password2.value) {
        throw 'password not matched'
      }
      return {
        username: signupForm.username.value,
        password: signupForm.password.value,
      }
    },
    cb: json => {
      if (json.error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to signup: ' + json.error,
        })
        return
      }
      user_id = json.id
      loadUserStyle()
      checkAllMemoOwnership()
    },
  })

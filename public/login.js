
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


  function loadAdminStyle() {
    let link = document.createElement('link')
    link.id = 'index-style'
    link.rel = 'stylesheet'
    link.href = '/index/admin.css'
    document.head.appendChild(link)
  }

  function unloadAdminStyle() {
     let link = document.querySelector('#admin.style')
     if (link){
       link.remove()
     }

  }
   
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
    form: loginForm,
    getBody() {
      return {
        username: loginForm.username.value,
        password: loginForm.password.value,
      }
    },
    cb: json => {
      if (json.error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to login: ' + json.error,
        })
        return
      }
      user_id = json.id
      loadUserStyle()
    },
  })

  
  ajaxForm({
    form: loginForm,
    getBody() {
      return {
        username: loginForm.username.value,
        password: loginForm.password.value,
      }
    },
    cb: json => {
      if (json.error) {
        Swal.fire({
          icon: 'error',
          title: 'Failed to login: ' + json.error,
        })
        return
      }
      user_id = json.id
      loadUserStyle()
    },
  })


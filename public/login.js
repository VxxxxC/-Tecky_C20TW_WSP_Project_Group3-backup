

function validateForm() {
    let a = document.forms["Form"]["username"].value;
    let b = document.forms["Form"]["password"].value;

    if (!a || !b) {
      alert("Please Fill All Required Fields");
      return false;
    }
  }


  fetch('/session')
  .then(res => res.json())
  .catch(error => ({error:String(error)}))
  .then(json =>{
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
  },
  users_id = json.id
  if(json.username){
    loadAdminstyle()
  }

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
   

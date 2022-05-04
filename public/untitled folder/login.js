function validateForm() {
    let a = document.forms["Form"]["username"].value;
    let b = document.forms["Form"]["email"].value;
    let c = document.forms["Form"]["password"].value;

    if (!a || !b || !c) {
      alert("Please Fill All Required Fields");
      return false;
    }
  }


  

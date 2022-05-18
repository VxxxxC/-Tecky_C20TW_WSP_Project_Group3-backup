document.getElementById("self-intro").addEventListener("click",function(){
    swal("please edit your self-introduction", {
      content: "input",
    })
    .then((value) => {
      if (value !== "" && value !== null){
        swal(`successful change the self-introduction`);
      }
    });
  });

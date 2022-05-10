function checkData() {
  var txtCheck = document.formName;
  if (txtCheck.textarea.value == "") {
    alert("Please enter information in the textarea");
    txtCheck.textarea.focus();
    return false;
  }
}

let content = document.querySelector(".content");

async function postContent() {
  let params = new URLSearchParams(location.search);
  let id = params.get("id");

  let res = await fetch("/post/" + id);
  let result = await res.json();
  console.log(result);
  let post = result.posts;
  content.innerHTML = `<div class="title-holder">${post.title}</div>
    <div class="slider">
    <div class="slider-items">
        <div  class="item active">
           <img src="${"/img/" + post.image}">
        </div>
    </div>
 </div>
      <div class="text">${post.content}</div>
      <button class="edit-btn">edit</button>
      <div class="author">
            <div class="sub-header-1">${post.users_id}</div>
            <div class="author-name">jk</div>
            <div class="intro">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto excepturi impedit, ipsum, numquam
                temporibus hic iste at, inventore quo perspiciatis laudantium saepe modi! Quos ipsum debitis et
                voluptatem beatae sit.
            </div>
          
        </div>
       `;

  let editBtn = document.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    console.log("edit post");
    Swal.fire({
      title: "Edit post",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Save Edit",
      cancelButtonText: "Cancel Edit",
      showLoaderOnConfirm: true,
      preConfirm: (content) => {
        return fetch(`/post/${post.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        })
          .then((res) => res.json())
          .catch((error) => ({ error: String(error) }))
          .then((json) => {
            if (json.error) {
              Swal.showValidationMessage(json.error);
              return;
            }
            console.log("edit success...", json);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      console.log("result:", result);
      if (result.isConfirmed) {
        Swal.fire({
          title: `Saved post`,
        });
        post.textContent = content;
      }
    });
  });

  // let deleteBtn = document.querySelector('.delete-btn')
  // deleteBtn.addEventListener('click',()=>{
  //   console.log('delete post')
  //   Swal.fire({
  //     title: 'Confirm to delete memo?',
  //     text: `You are going to delete "${post.content}"`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#d33',
  //     cancelButtonColor: '#333',
  //     confirmButtonText: 'Confirm to delete',
  //     cancelButtonText: 'Do not delete',
  //   }).then(result => {
  //     if (result.isConfirmed) {
  //       fetch(`/post/` + post.id, { method: 'DELETE' })
  //         .then(res => res.json())
  //         .catch(err => ({ error: String(err) }))
  //         .then(json => {
  //           if (json.error) {
  //             Swal.fire('Cannot Delete', json.error, 'error')
  //           } else {
  //             Swal.fire('Deleted!', 'The memo is deleted.', 'success')
  //             postContainer.remove()
  //           }
  //         })
  //     }
  //   })
  // })
}

postContent();

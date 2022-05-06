

let slides = document.querySelector(".slider-items").children;
let nextSlide = document.querySelector(".right-slide");
let prevSlide = document.querySelector(".left-slide");
let totalSlides = slides.length;
let index = 0;

nextSlide.onclick = function () {
  next("next");
};
prevSlide.onclick = function () {
  next("prev");
};

function next(direction) {
  if (direction == "next") {
    index++;
    if (index == totalSlides) {
      index = 0;
    }
  } else {
    if (index == 0) {
      index = totalSlides - 1;
    } else {
      index--;
    }
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }
  slides[index].classList.add("active");
}

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
  let params = new URLSearchParams(location.search)
  let id  = params.get('id')

  let res = await fetch('/post/'+id);
  let result = await res.json();
  console.log(result);
  let post = result.post;
    content.innerHTML = `<div class="title-holder">${post.title}</div>
    <div class="slider">
    <div class="slider-items">
        <div  class="item active">
           <img src="${"/img/" + post.image}">
        </div>
    </div>
        <div class="left-slide"> &lt;</div>
        <div class="right-slide">&gt;</div>
 </div>
      <div class="text">${post.content}</div>
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
}



postContent();
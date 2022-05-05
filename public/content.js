const { textChangeRangeIsUnchanged } = require("typescript");

var slides=document.querySelector('.slider-items').children;
 var nextSlide=document.querySelector(".right-slide");
var prevSlide=document.querySelector(".left-slide");
var totalSlides=slides.length;
var index=0;

nextSlide.onclick=function () {
     next("next");
}
prevSlide.onclick=function () {
     next("prev");
}

function next(direction){

   if(direction=="next"){
      index++;
       if(index==totalSlides){
        index=0;
       }
   } 
   else{
           if(index==0){
            index=totalSlides-1;
           }
           else{
            index--;
           }
    }

  for(i=0;i<slides.length;i++){
          slides[i].classList.remove("active");
  }
  slides[index].classList.add("active");     

}

let text = document.querySelector('.text')
let title = document.querySelector('title-holder')
let slide = document.querySelector('slider')

function checkData() {
     var txtCheck = document.formName;
       if(txtCheck.textarea.value == "")  {
         alert("Please enter information in the textarea");
         txtCheck.textarea.focus();
         return false;
       }
   }

   title.addEventListener('load', loadTitle());

   function loadTitle(){
    fetch(`/post/${post.title}`),{
      method:'GET',
      headers:{'Contnet-Type':'application/json'},
      body:JSON.stringify({Title:title.value})
    }
   }

text.addEventListener('load',loadContent());

function loadContent(){
  fetch(`/post/${post.loadContent}`),{
    method:'GET',
    headers:{'Contnet-Type':'application/json'},
    body:JSON.stringify({Content:content})
  }
 }


 slide.addEventListener('laod',loadImage());

let img =slide.querySelector('img')
if(img){
  img.src = '/uplodas/' + image
}else{
  img.remove()
}

 function loadImage(){
  fetch(`/post/${post.image}`),{
    method:'GET',
    headers:{'Contnet-Type':'application/json'},
    body:JSON.stringify({Image})
  }
 }

let content = document.querySelector('content')
function checkOwnership(content){
  let content_user_id = + DataTransferItem.user_id
  if(content_user_id === user_id){
    content.classList.add('owner')
  }else{
    content.classList.remove()
  }
}


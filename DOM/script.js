let bttn = document.querySelector("button")
let bulb = document.querySelector("#bulb")
let img = document.querySelector("img")

let flag = true
bttn.addEventListener('click',()=>{
    
    if(flag){
        img.setAttribute("src","https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=")
        flag = false
    }
    else{
        img.setAttribute("src","https://cdn.pixabay.com/photo/2017/07/24/19/57/tiger-2535888_640.jpg")
        flag=true

    }
})
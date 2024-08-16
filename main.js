const page0 = document.querySelector(".page0")
const page1 = document.querySelector(".page1")
const page2 = document.querySelector(".page2")
const name = document.querySelector("#name")
let sing 
let mode
function open(){
    page0.classList.add("page0-op")
}
window.addEventListener("load", open)
function clPage0(){
    let playerName = name.value
    console.log(playerName)
    page0.classList.remove("page0-op")
    page1.classList.add("page1-op")
}
function clpage1(){
    page1.classList.remove("page1-op")
    page2.classList.add("page2-op")
}
function clpage2(){
    page2.classList.remove("page2-op")
    page3.classList.add("page3-op")
}
function add(){
    sing = "+"
    mode = "add"
}
function sub(){
    sing = "-"
    mode = "sub"
}
function mul(){
    sing = "X"
    mode = "mul"
}
function div(){
    sing = "/"
    mode = "div"
}
function mix(){
    mode = "mix"
}
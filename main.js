const page0 = document.querySelector(".page0")
const page1 = document.querySelector(".page1")

function open(){
    page0.classList.add("page0-op")
}
window.addEventListener("load", open)
function clPage0(){
    page0.classList.remove("page0-op")
    page1.classList.add("page1-op")
}
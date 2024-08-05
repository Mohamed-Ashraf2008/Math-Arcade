const page0 = document.querySelector(".page0")
function open(){
    page0.classList.add("page0-op")
}
window.addEventListener("load", open)
function clPage0(){
    page0.classList.remove("page0-op")
}
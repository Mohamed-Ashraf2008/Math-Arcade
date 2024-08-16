const page0 = document.querySelector(".page0")
const page1 = document.querySelector(".page1")
const page2 = document.querySelector(".page2")
const page3 = document.querySelector(".page3")
const name = document.querySelector("#name")
let randomNum1
let randomNum2
let wrongAns1 
let wrongAns2
let wrongAns3
let anssList = []
let score
let max
let min
let ans
let sing 
let mode
let diff
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
function es(){
    diff = "easy"
}
function no(){
    diff = "normal"
}
function hd(){
    diff = "hard"
}
function ex(){
    diff = "extreme"
}
function random(){
    if(sing == "-"){
        if(diff == "easy"){
            max = 10
            min = 1
        }
        else if(diff == "normal"){
            min = 10
            max = 30
        }
        else if(diff == "hard"){
            min = 10
            max = 70
        }
        else if(diff == "extreme"){
            min = 10
            max = 120
        }
    }
    else if(sing == "+"){
        if(diff == "easy"){
            max = 15
            min = 1
        }
        else if(diff == "normal"){
            min = 15
            max = 40
        }
        else if(diff == "hard"){
            min = 15
            max = 90
        }
        else if(diff == "extreme"){
            min = 15
            max = 150
        }
    }
    else if(sing == "X"){
        if(diff == "easy"){
            max = 5
            min = 1
        }
        else if(diff == "normal"){
            min = 2
            max = 10
        }
        else if(diff == "hard"){
            min = 2
            max = 15
        }
        else if(diff == "extreme"){
            min = 2
            max = 20
        }
    }
    else if(sing == "/"){
        if(diff == "easy"){
            max = 5
            min = 2
        }
        else if(diff == "normal"){
            min = 2
            max = 10
        }
        else if(diff == "hard"){
            min = 10
            max = 20
        }
        else if(diff == "extreme"){
            min = 2
            max = 40
        }
    }
    return Math.floor(Math.random() * (max - min + 1) + min)
}

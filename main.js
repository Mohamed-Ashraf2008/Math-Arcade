const page0 = document.querySelector(".page0")
const page1 = document.querySelector(".page1")
const page2 = document.querySelector(".page2")
const page3 = document.querySelector(".page3")
const name = document.querySelector("#name")
let op1 = document.querySelector(".op1")
let op2 = document.querySelector(".op2")
let op3 = document.querySelector(".op3")
let op4 = document.querySelector(".op4")
let randomNum1
let randomNum2
let wrongAns1 = 0
let wrongAns2 = 0
let wrongAns3 = 0
let anssList = []
let score = 0 
let max = 0
let min = 0
let ans = 0
let sign = "+"
let mode = "add"
let diff = "easy"
let ran = 0
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
    startTheGame()
}
function add(){
    sign = "+"
    mode = "add"
}
function sub(){
    sign = "-"
    mode = "sub"
}
function mul(){
    sign = "X"
    mode = "mul"
}
function div(){
    sign = "/"
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
    if(sign == "-"){
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
    else if(sign == "+"){
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
    else if(sign == "X"){
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
            op1.textContent = 2
            max = 20
        }
    }
    else if(sign == "/"){
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
    ran = (Math.floor(Math.random() * (max - min + 1) + min))
    return(ran)
}
random()
function startTheGame(){
    if(mode == "mix"){
    sign = ["+","-","X","/"][Math.floor(Math.random() * 4)]
    }
    randomNum1 = random()
    randomNum2 = random()
    if(sign == "+"){
        ans = randomNum1 + randomNum2
        wrongAns1 = random() + random()
        wrongAns2 = random() + random()
        wrongAns3 = random() + random()
    }
    else if(sign == "-"){
        while(randomNum1 - randomNum2 <= 0){
            randomNum1 = random()
            randomNum2 = random()
        }
        ans = randomNum1 - randomNum2
        wrongAns1 = random() - random()
        wrongAns2 = random() - random()
        wrongAns3 = random() - random()
    }
    else if(sign == "X"){
        ans = randomNum1 * randomNum2
        wrongAns1 = random() * random()
        wrongAns2 = random() * random()
        wrongAns3 = random() * random()
    }
    else if(sign == "/"){
        randomNum1 = random() * randomNum2
        ans = randomNum1 / randomNum2
        wrongAns1 = random()
        wrongAns2 = random()
        wrongAns3 = random()
    }
    anssList = [ans,wrongAns1,wrongAns2,wrongAns3]
    anssList.sort
    op1.textContent = anssList[0]
    op2.textContent = anssList[1]
    op3.textContent = anssList[2]
    op4.textContent = anssList[3]
}
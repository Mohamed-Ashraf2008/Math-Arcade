const page0 = document.querySelector(".page0");
const page1 = document.querySelector(".page1");
const page2 = document.querySelector(".page2");
const page3 = document.querySelector(".page3");
const nameInput = document.querySelector("#name");
let display = document.querySelector(".display");
let scoreEl = document.querySelector(".score");
let messageEl = document.querySelector(".massage");
let probEl = document.querySelector(".prob");
let op1 = document.querySelector(".op1");
let op2 = document.querySelector(".op2");
let op3 = document.querySelector(".op3");
let op4 = document.querySelector(".op4");

let randomNum1, randomNum2, wrongAns1, wrongAns2, wrongAns3, ans, ran;
let anssList = [];
let score = 0;
let max, min;
let sign = "+";
let mode = "add";
let difficulty = null; // Difficulty is set later by the player

window.addEventListener("load", () => {
    page0.classList.add("page0-op");
});

function clPage0() {
    let playerName = nameInput.value;
    console.log(`Player name: ${playerName}`);
    page0.classList.remove("page0-op");
    page1.classList.add("page1-op");
}

function setMode(selectedMode) {
    mode = selectedMode;
    console.log(`Mode set to: ${mode}`);
    page1.classList.remove("page1-op");
    page2.classList.add("page2-op");
}

function setDifficulty(selectedDifficulty) {
    difficulty = selectedDifficulty;
    console.log(`Difficulty set to: ${difficulty}`);
    page2.classList.remove("page2-op");
    page3.classList.add("page3-op");
    startTheGame();
}

function generateRandomNumbers() {
    switch (difficulty) {
        case "easy":
            min = 1;
            max = mode === "mul" || mode === "div" ? 5 : 15;
            break;
        case "normal":
            min = mode === "div" ? 2 : 10;
            max = mode === "mul" || mode === "div" ? 10 : 40;
            break;
        case "hard":
            min = mode === "div" ? 10 : 15;
            max = mode === "mul" || mode === "div" ? 15 : 90;
            break;
        case "extreme":
            min = mode === "div" ? 2 : 40;
            max = mode === "mul" || mode === "div" ? 20 : 200;
            break;
    }

    ran = Math.floor(Math.random() * (max - min + 1) + min);
    return(ran)
}

function startTheGame() {
    randomNum1 = generateRandomNumbers()
    randomNum2 = generateRandomNumbers()
    if (mode === "mix") {
        sign = ["+", "-", "X", "/"][Math.floor(Math.random() * 4)];
    } else {
        sign = mode === "add" ? "+" : mode === "sub" ? "-" : mode === "mul" ? "X" : "/";
    }

    generateRandomNumbers();

    switch (sign) {
        case "+":
            ans = randomNum1 + randomNum2;
            break;
        case "-":
            ans = randomNum1 - randomNum2;
            break;
        case "X":
            ans = randomNum1 * randomNum2;
            break;
        case "/":
            if (randomNum2 === 0) randomNum2 = 1; // Prevent division by zero
            randomNum1 = generateRandomNumbers() * randomNum2
            ans = randomNum1 / randomNum2;
            break;
    }

    wrongAns1 = ans + Math.floor(Math.random() * 10 + 1);
    wrongAns2 = ans - Math.floor(Math.random() * 10 + 1);
    wrongAns3 = ans + Math.floor(Math.random() * 5 + 1);

    // Ensure all wrong answers are unique and different from the correct one
    while ([wrongAns1, wrongAns2, wrongAns3].includes(ans) || wrongAns1 === wrongAns2 || wrongAns2 === wrongAns3) {
        wrongAns1 = ans + Math.floor(Math.random() * 10 + 1);
        wrongAns2 = ans - Math.floor(Math.random() * 10 + 1);
        wrongAns3 = ans + Math.floor(Math.random() * 5 + 1); 
    }
// Display the problem and shuffle the answer options
probEl.textContent = `${randomNum1} ${sign} ${randomNum2} = `;
anssList = [ans, wrongAns1, wrongAns2, wrongAns3].sort(() => Math.random() - 0.5);

op1.textContent = anssList[0];
op2.textContent = anssList[1];
op3.textContent = anssList[2];
op4.textContent = anssList[3];

scoreEl.textContent = `Score: ${score}`;
messageEl.innerHTML = "Start";}

op1.addEventListener("click", () => checkAnswer(Number(op1.textContent))); op2.addEventListener("click", () => checkAnswer(Number(op2.textContent))); op3.addEventListener("click", () => checkAnswer(Number(op3.textContent))); op4.addEventListener("click", () => checkAnswer(Number(op4.textContent)));

function checkAnswer(selectedAns) { if (selectedAns === ans) { win(); } else { lose(); } }

function win() { 
    score++; 
    messageEl.innerHTML = "CORRECT!!"; 
    startTheGame(); 
}

function lose() { 
    score = 0; 
    scoreEl.textContent = `Score: ${score}`; 
    messageEl.innerHTML = "WRONG!!";
    startTheGame(); 
}
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
let difficulty = null;

window.addEventListener("load", () => {
    page0.classList.add("page0-op");
});

function clPage0() {
    page0.style.display = "none";
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
            max = (sign === "X" || sign === "/") ? 5 : 15;
            break;
        case "normal":
            min = (sign === "X" || sign === "/") ? 2 : 5;
            max = (sign === "X" || sign === "/") ? 9 : 40;
            break;
        case "hard":
            min = (sign === "X" || sign === "/") ? 5 : 15;
            max = (sign === "X" || sign === "/") ? 13 : 60;
            break;
        case "extreme":
            min = (sign === "X" || sign === "/") ? 10 : 40;
            max = (sign === "X" || sign === "/") ? 17 : 100;
            break;
    }
    ran = Math.floor(Math.random() * (max - min + 1) + min);
    return ran;
}

function startTheGame() {
    sign = (mode === "mix") ? ["+", "-", "X", "/"][Math.floor(Math.random() * 4)] : mode === "add" ? "+" : mode === "sub" ? "-" : mode === "mul" ? "X" : "/";
    randomNum1 = generateRandomNumbers();
    randomNum2 = generateRandomNumbers();
    ans = (sign === "+") ? randomNum1 + randomNum2 : (sign === "-") ? randomNum1 - randomNum2 : (sign === "X") ? randomNum1 * randomNum2 : randomNum1 / (randomNum2 || 1);

    wrongAns1 = ans + Math.floor(Math.random() * 10 + 1);
    wrongAns2 = ans - Math.floor(Math.random() * 10 + 1);
    wrongAns3 = ans + Math.floor(Math.random() * 5 + 1);

    while ([wrongAns1, wrongAns2, wrongAns3].includes(ans) || new Set([wrongAns1, wrongAns2, wrongAns3]).size < 3) {
        wrongAns1 = ans + Math.floor(Math.random() * 10 + 1);
        wrongAns2 = ans - Math.floor(Math.random() * 10 + 1);
        wrongAns3 = ans + Math.floor(Math.random() * 5 + 1);
    }

    probEl.textContent = `${randomNum1} ${sign} ${randomNum2} = `;
    anssList = [ans, wrongAns1, wrongAns2, wrongAns3].sort(() => Math.random() - 0.5);

    [op1, op2, op3, op4].forEach((btn, i) => btn.textContent = anssList[i]);

    scoreEl.textContent = `Score: ${score}`;
}

[op1, op2, op3, op4].forEach(btn => btn.addEventListener("click", () => checkAnswer(Number(btn.textContent))));

function checkAnswer(selectedAns) {
    (selectedAns === ans) ? win() : lose();
}

function win() {
    score++;
    messageEl.textContent = "Correct!";
    startTheGame();
}

function lose() {
    score = 0;
    scoreEl.textContent = `Score: ${score}`;
    messageEl.textContent = "Wrong!";
}

function back() {
    page3.classList.remove("page3-op");
    page1.classList.add("page1-op");
    score = 0;
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD2OWGUWuNqbSKq7RQgA4gCpm37Bqqoevo",
    authDomain: "math-games-ca70d.firebaseapp.com",
    projectId: "math-games-ca70d",
    storageBucket: "math-games-ca70d",
    messagingSenderId: "996248715280",
    appId: "1:996248715280:web:bdceac7bfc35d46cccca95",
    databaseURL: "https://math-games-ca70d-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);



document.addEventListener("DOMContentLoaded", () => {
    // Select elements after DOM has fully loaded
    const userName = document.querySelector("#name");
    const userEmail = document.querySelector("#email");
    const userPassword = document.querySelector("#password");
    const authForm = document.querySelector(".signInAndLoginP");
    const userContent = document.querySelector(".mainMenuP");
    const signUpbtn = document.querySelector(".signUp");
    const signInbtn = document.querySelector(".signIn");
    const guestOp = document.querySelector(".guestOp");

    // Firebase sign-up logic
    const userSignup = async () => {
        const signUpName = userName.value;
        const signUpEmail = userEmail.value;
        const signUpPassword = userPassword.value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
            const user = userCredential.user;
            console.log(user);

            // Save additional user info (name) to the Realtime Database
            const userRef = ref(database, 'users/' + user.uid);
            await set(userRef, {
                name: signUpName,
                email: signUpEmail
            });
            const leaderBoard = ref(database, 'leaderBoard/' + user.uid);
            await set(leaderBoard, {
                name: signUpName,
                score: 9
            });
            alert("Your account has been created");
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    };

    // Firebase sign-in logic
    const userSignIn = async () => {
        const signInEmail = userEmail.value;
        const signInPassword = userPassword.value;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
            const user = userCredential.user;
            console.log(user);
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    };

    // Check Firebase auth state (whether the user is logged in)
    const checkAuthState = async () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                authForm.style.display = "none";
                userContent.classList.add("mainMenuP-op");
            } else {
                authForm.style.display = "flex";
                userContent.classList.remove("mainMenuP-op");
            }
        });
    };
    checkAuthState();

    // Add event listeners to buttons
    signUpbtn.addEventListener("click", userSignup);
    signInbtn.addEventListener("click", userSignIn);
    guestOp.addEventListener("click", () => {
        authForm.style.display = "none";
        userContent.classList.add("mainMenuP-op");
    });

    // Mode and difficulty button listeners
    const playBtn = document.querySelector(".playBtn");
    const leaderBoardBtn = document.querySelector(".leaderBoardBtn");
    const settingsBtn = document.querySelector(".settingsBtn");

    const addModeBtn = document.querySelector(".addMode");
    const subModeBtn = document.querySelector(".subMode");
    const mulModeBtn = document.querySelector(".mulMode");
    const divModeBtn = document.querySelector(".divMode");
    const mixModeBtn = document.querySelector(".mixMode");

    const easyDiffBtn = document.querySelector(".easyDiff");
    const normalDiffBtn = document.querySelector(".normalDiff");
    const hardDiffBtn = document.querySelector(".hardDiff");
    const extremeDiffBtn = document.querySelector(".extremeDiff");

    const backBtn = document.querySelector(".backBtn");

    playBtn.addEventListener("click", () => {
        setModeP.classList.add("setModeP-op");
        mainMenuP.classList.remove("mainMenuP-op");
    });

    leaderBoardBtn.addEventListener("click", () => {
        leaderBoardP.classList.add("leaderBoardP-op");
        mainMenuP.classList.remove("mainMenuP-op");

    });

    settingsBtn.addEventListener("click", () => {
        settingsP.classList.add("settingsP-op");
        mainMenuP.classList.remove("mainMenuP-op");
    });


    addModeBtn.addEventListener("click", () => setMode("add"));
    subModeBtn.addEventListener("click", () => setMode("sub"));
    mulModeBtn.addEventListener("click", () => setMode("mul"));
    divModeBtn.addEventListener("click", () => setMode("div"));
    mixModeBtn.addEventListener("click", () => setMode("mix"));

    easyDiffBtn.addEventListener("click", () => setDifficulty("easy"));
    normalDiffBtn.addEventListener("click", () => setDifficulty("normal"));
    hardDiffBtn.addEventListener("click", () => setDifficulty("hard"));
    extremeDiffBtn.addEventListener("click", () => setDifficulty("extreme"));

    backBtn.addEventListener("click", () => back());
});
const backGroundNoise = {
    campFire : "backGroundNoise/campFire.mp3",
    rain : "backGroundNoise/rain.mp3",
    wildLife : "backGroundNoise/wildLife.mp3",
    none:"none"
}

const soundEffects = {
    correct: new Audio("soundEffect/clike.mp3"),
    wrong : ("soundEffect/wrong.mp3"
}

const themes = {
    green: {
        backgroundColor: "#1F2936",
        primaryColor: "#0C8F63",
        lowerPrimaryColor: "#0C8F6340",
        secondaryColor: "#10B981",
        textColor: "#1F2937",
        hoverColor: "#0b7753",
        shadowColor: "#0c8f6380",
        focusColor: "#1F2937",
        fontFamilyMain: "'Jersey 25', Geneva, Tahoma, sans-serif",
        fontFamilySecondary: "'Abril Fatface', cursive",
    },
    dark: {
        backgroundColor: "#1A1A1A",
        primaryColor: "#E5E5E5",
        lowerPrimaryColor: "#E5E5E540",
        secondaryColor: "#CCCCCC",
        textColor: "#F5F5F5",
        hoverColor: "#B3B3B3",
        shadowColor: "#3D3D3D",
        focusColor: "#FFFFFF",
        fontFamilyMain: "'Jersey 25', Geneva, Tahoma, sans-serif",
        fontFamilySecondary: "'Abril Fatface', cursive",
    },
    red: {
        backgroundColor: "#1A0004",
        primaryColor: "#B2002D",
        lowerPrimaryColor: "#B2002D40",
        secondaryColor: "#FF0033",
        textColor: "#F4CCCC",
        hoverColor: "#990026",
        shadowColor: "#B2002D80",
        focusColor: "#FFFFFF",
        fontFamilyMain: "'Jersey 25', Geneva, Tahoma, sans-serif",
        fontFamilySecondary: "'Abril Fatface', cursive",
    },
    yellow: {
        backgroundColor: "#1A1A00",
        primaryColor: "#B28B00",
        lowerPrimaryColor: "#B28B0040",
        secondaryColor: "#FFD700",
        textColor: "#FFF7CC",
        hoverColor: "#996B00",
        shadowColor: "#B28B0080",
        focusColor: "#FFFFFF",
        fontFamilyMain: "'Jersey 25', Geneva, Tahoma, sans-serif",
        fontFamilySecondary: "'Abril Fatface', cursive",
    },
    light: {
        backgroundColor: "#F5F5F5",
        primaryColor: "#1A1A1A",
        lowerPrimaryColor: "#1A1A1A40",
        secondaryColor: "#3D3D3D",
        textColor: "#FFFFFF",
        hoverColor: "#333333",
        shadowColor: "#D3D3D3",
        focusColor: "#000000",
        fontFamilyMain: "'Jersey 25', Geneva, Tahoma, sans-serif",
        fontFamilySecondary: "'Abril Fatface', cursive",
    },
    blue: {
        backgroundColor: "#0A1128",
        primaryColor: "#001F54",
        lowerPrimaryColor: "#001F5440",
        secondaryColor: "#023E8A",
        textColor: "#A8DADC",
        hoverColor: "#002D6F",
        shadowColor: "#001F5480",
        focusColor: "#FFFFFF",
        fontFamilyMain: "'Jersey 25', Geneva, Tahoma, sans-serif",
        fontFamilySecondary: "'Abril Fatface', cursive",
    },
    purple: {
        backgroundColor: "#2C003E",
        primaryColor: "#5E2A8C",
        lowerPrimaryColor: "#5E2A8C40",
        secondaryColor: "#8E44AD",
        textColor: "#FFFFFF",
        hoverColor: "#4B1C6E",
        shadowColor: "#000000",
        focusColor: "#FFFFFF",
        fontFamilyMain: "'Jersey 25', Geneva, Tahoma, sans-serif",
        fontFamilySecondary: "'Abril Fatface', cursive",
    }
};





// Function to apply theme dynamically
let currentAudio = null; // Variable to hold the currently playing audio instance

function setNoise(noiseName , noiseVolume) {
    // Stop the currently playing audio if it exists
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Reset playback position
    }
    
    const noise = backGroundNoise[noiseName];
    if (noise) {
        if(noise != "none"){
            currentAudio = new Audio(noise); // Create new audio instance
            currentAudio.loop = true; // Optional: Loop the background noise
            currentAudio.volume = noiseVolume;
            window.alert(currentAudio + " or "+ noiseName + " is now playing at " + noiseVolume)
        currentAudio.play(); // Play the selected noise
        }
    }
    // Set the volume based on the slider value

}

// Apply the saved volume from localStorage when the page loads



function setTheme(themeName) {
    const theme = themes[themeName];
    const root = document.documentElement;
    
    for (const [key, value] of Object.entries(theme)) {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVar, value);
    }
}

function handleThemeChange() {
    const selectedTheme = document.getElementById('themesS').value;
    const selectedNoise = document.getElementById('musicS').value;
    const selectedNoiseVolume = parseFloat(document.getElementById('musicV').value)
    
    // Save the selected theme and noise to localStorage
    localStorage.setItem('selectedTheme', selectedTheme);
    localStorage.setItem('selectedNoise', selectedNoise);
    localStorage.setItem('selectedNoiseVolume',selectedNoiseVolume)
    
    // Apply the theme and noise
    setTheme(selectedTheme);
    
    setNoise(selectedNoise , selectedNoiseVolume);
}

// Event listener for the Summit button to save and apply theme and noise
const summitButton = document.getElementById('summit');
summitButton.addEventListener('click', () => {
    handleThemeChange();
    
    settingsP.classList.remove("settingsP-op");
    mainMenuP.classList.add("mainMenuP-op");
});

// Apply the theme and noise when the page is loaded (if saved in localStorage)
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selectedTheme');
    const savedNoise = localStorage.getItem('selectedNoise');
    const savedNoiseVolume = localStorage.getItem('selectedNoiseVolume');
    if (savedTheme) {
        setTheme(savedTheme); // Apply saved theme
        document.getElementById('themesS').value = savedTheme; // Set the dropdown to the saved theme
    } else {
        setTheme('green'); // Default theme if no theme is saved
    }
    
    if (savedNoise) {
        document.getElementById('musicS').value = savedNoise; // Set the dropdown to the saved noise
    } else {
        document.getElementById('musicS').value = 'none'; // Default dropdown value
    }
    
    // Wait for user interaction to start playing the noise
    document.addEventListener('click', () => {
        setNoise(savedNoise, savedNoiseVolume);
        if (savedNoiseVolume !== null) {
            document.getElementById('musicV').value = savedNoiseVolume;
            currentAudio.volume = parseFloat(savedNoiseVolume);
            
        } else {
            
            document.getElementById('musicV').value = 1; // Default volume
        }
    }, { once: true });
});

document.addEventListener('click', () => {
    soundEffects.correct.play();
});

// Pause and resume music based on tab visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden && currentAudio) {
        currentAudio.pause(); // Pause audio when the tab is hidden
    } else if (!document.hidden && currentAudio) {
        currentAudio.play(); // Resume audio when the tab is visible again
    }
});

// Function to be called on any button click
const button = document.querySelector("button")
button.addEventListener('click', () => {
    try {
        if (soundEffects && soundEffects.correct) {
            soundEffects.correct.play();
        } else {
            window.alert('soundEffects or soundEffects.correct is not defined.');
        }
    } catch (error) {
        window.alert('Error playing sound:', error);
    }
});




// Game functionality
const signInAndLoginP = document.querySelector(".signInAndLoginP");
const mainMenuP = document.querySelector(".mainMenuP");
const leaderBoardP = document.querySelector(".leaderBoardP");
const settingsP = document.querySelector(".settingsP");
const setModeP = document.querySelector(".setModeP");
const setDifficultyP = document.querySelector(".setDifficultyP");
const soloP = document.querySelector(".soloP");
const scoreEl = document.querySelector(".score");
const display = document.querySelector(".display");
const Phr = document.querySelector(".Phr");
const messageEl = document.querySelector(".massage");
const probEl = document.querySelector(".prob");
const op1 = document.querySelector(".op1");
const op2 = document.querySelector(".op2");
const op3 = document.querySelector(".op3");
const op4 = document.querySelector(".op4");

let randomNum1, randomNum2, wrongAns1, wrongAns2, wrongAns3, ans, ran;
let anssList = [];
let score = 0;
let max, min;
let sign = "+";
let mode = "add";
let difficulty = null;


function setMode(selectedMode) {
    mode = selectedMode;
    console.log(`Mode set to: ${mode}`);
    
    setModeP.classList.remove("setModeP-op");
    setDifficultyP.classList.add("setDifficultyP-op");
}

function setDifficulty(selectedDifficulty) {
    difficulty = selectedDifficulty;
    console.log(`Difficulty set to: ${difficulty}`);
    
    setDifficultyP.classList.remove("setDifficultyP-op");
    soloP.classList.add("soloP-op");
    startTheGame();
}

function generateRandomNumbers() {
    switch (difficulty) {
        case "easy":
            min = 1;
            if (sign === "X" || sign === "/") {
                max = 5; // Smaller range for multiplication and division in easy mode
            } else {
                max = 15; // Range for addition and subtraction in easy mode
            }
            break;
        case "normal":
            if (sign === "X" || sign === "/") {
                min = 2; // Slightly higher minimum for multiplication and division in normal mode
                max = 9; // Slightly higher maximum for multiplication and division in normal mode
            } else {
                min = 5;
                max = 40; // Range for addition and subtraction in normal mode
            }
            break;
        case "hard":
            if (sign === "X" || sign === "/") {
                min = 5; // Higher minimum for multiplication and division in hard mode
                max = 13; // Higher maximum for multiplication and division in hard mode
            } else {
                min = 15;
                max = 60; // Range for addition and subtraction in hard mode
            }
            break;
        case "extreme":
            if (sign === "X" || sign === "/") {
                min = 10; // Higher minimum for multiplication and division in extreme mode
                max = 17; // Higher maximum for multiplication and division in extreme mode
            } else {
                min = 40;
                max = 100; // Range for addition and subtraction in extreme mode
            }
            break;
    }

    ran = Math.floor(Math.random() * (max - min + 1) + min);
    return ran;
}


function startTheGame() {
    if (mode === "mix") {
        sign = ["+", "-", "X", "/"][Math.floor(Math.random() * 4)];
    } else {
        sign = mode === "add" ? "+" : mode === "sub" ? "-" : mode === "mul" ? "X" : "/";
    }
    randomNum1 = generateRandomNumbers()
    randomNum2 = generateRandomNumbers()
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

scoreEl.textContent = `Score: ${score}`;}


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
    display.classList.add("displayL");
    Phr.classList.add("hrL");
    probEl.classList.add("probL");
    messageEl.classList.add("messageL");

    setTimeout(() => {
        display.classList.remove("displayL");
        Phr.classList.remove("hrL");
        probEl.classList.remove("probL");
        messageEl.classList.remove("messageL");
    }, 1000);
}

function back() {
    soloP.classList.remove("soloP-op");
    mainMenuP.classList.add("mainMenuP-op");
    score = 0;
}

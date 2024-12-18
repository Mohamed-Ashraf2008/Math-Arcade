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
    const playBtn = document.querySelector(".playBtn");
    const leaderBoardBtn = document.querySelector(".leaderBoardBtn");
    const settingsBtn = document.querySelector(".settingsBtn");
    const backBtn = document.querySelector(".backBtn");
    playBtn.addEventListener("click", () => {
        startCountdown.style.display = "flex";
        startCountdownF();
        soloP.classList.add("soloP-op");
        mainMenuP.classList.remove("mainMenuP-op");
        messageEl.textContent = "Start!"
        startTheGame();
    });

    leaderBoardBtn.addEventListener("click", () => {
        leaderBoardP.classList.add("leaderBoardP-op");
        mainMenuP.classList.remove("mainMenuP-op");

    });

    settingsBtn.addEventListener("click", () => {
        settingsP.classList.add("settingsP-op");
        mainMenuP.classList.remove("mainMenuP-op");
    });

    backBtn.addEventListener("click", () => back());

});
// service-worker.js
// Your CSS variables
const rootStyles = getComputedStyle(document.documentElement);
const backgroundColor = rootStyles.getPropertyValue("--background-color").trim();
const themeColor = rootStyles.getPropertyValue("--text-color").trim();

// Create the manifest dynamically
const manifest = {
    name: "Math-Arcade",
    short_name: "MA",
    start_url: "./index.html",
    display: "standalone",
    background_color: backgroundColor,
    theme_color: themeColor,
    icons: [
        {
            src: "icons8-math-100.png",
            sizes: "192x192",
            type: "image/png"
        },
        {
            src: "icons8-math-100.png",
            sizes: "512x512",
            type: "image/png"
        }
    ]
};

// Convert manifest to a Blob
const stringManifest = JSON.stringify(manifest);
const blob = new Blob([stringManifest], { type: "application/json" });
const manifestURL = URL.createObjectURL(blob);

// Inject the manifest dynamically into the HTML
const link = document.createElement("link");
link.rel = "manifest";
link.href = manifestURL;
document.head.appendChild(link);
self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
    console.log('Fetch intercepted for:', event.request.url);
});
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
        .then(() => console.log('Service Worker Registered'));
}

const backGroundNoise = {
    campFire: "backGroundNoise/campFire.mp3",
    rain: "backGroundNoise/rain.mp3",
    wildLife: "backGroundNoise/wildLife.mp3",
    none: "none"
}

const soundEffects = {
    click: new Audio("soundEffect/click.mp3"),
    correct: new Audio("soundEffect/correct.mp3"),
    wrong: new Audio("soundEffect/wrong.mp3"),
    bob: new Audio("soundEffect/bob.mp3")
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
        primaryColor: "#272727",
        lowerPrimaryColor: "#27272740",
        secondaryColor: "#CCCCCC",
        textColor: "#020202",
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
        textColor: "#ba9735",
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

function setNoise(noiseName, noiseVolume) {
    // Stop the currently playing audio if it exists
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Reset playback position
    }

    const noise = backGroundNoise[noiseName];
    if (noise) {
        if (noise != "none") {
            currentAudio = new Audio(noise); // Create new audio instance
            currentAudio.loop = true; // Optional: Loop the background noise
            currentAudio.volume = noiseVolume;

            currentAudio.play(); // Play the selected noise
        }
    }
    // Set the volume based on the slider value

}

// Apply the saved volume from localStorage when the page loads



function setTheme(themeName, gridToggle) {
    const theme = themes[themeName];
    const root = document.documentElement;
    const background = document.getElementsByTagName("BODY")[0]; // Access the first element

    if (gridToggle === "true" || gridToggle === true) {
        background.classList.add("grid");
    } else if (gridToggle === "false" || gridToggle === false) {
        background.classList.remove("grid");
    } else {
    }

    for (const [key, value] of Object.entries(theme)) {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVar, value);
    }
}


function handleThemeChange() {
    const selectedDifficulty = document.getElementById('diff').value;
    const selectedMode = document.getElementById('mode').value;
    const selectedTheme = document.getElementById('themesS').value;
    const selectedNoise = document.getElementById('musicS').value;
    const selectedNoiseVolume = parseFloat(document.getElementById('musicV').value);
    const selectedSoundVolume = parseFloat(document.getElementById('soundV').value);
    const soundEffectsToggle = document.getElementById('soundT');
    const backGroundGridT = document.getElementById('backGroundGridT');

    // Save the selected settings to localStorage
    localStorage.setItem('selectedMode', selectedMode);
    localStorage.setItem('selectedDifficulty', selectedDifficulty);
    localStorage.setItem('selectedTheme', selectedTheme);
    localStorage.setItem('selectedNoise', selectedNoise);
    localStorage.setItem('selectedNoiseVolume', selectedNoiseVolume);
    localStorage.setItem('selectedSoundVolume', selectedSoundVolume);
    localStorage.setItem('soundEffectsToggle', soundEffectsToggle.checked);
    localStorage.setItem('backGroundGridT', backGroundGridT.checked);

    // Apply the theme and noise
    setTheme(selectedTheme, backGroundGridT.checked);
    setNoise(selectedNoise, selectedNoiseVolume);
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
    const savedMode = localStorage.getItem('selectedMode') || "default"; // Default to "defaultMode"
    const savedDifficulty = localStorage.getItem('selectedDifficulty') || "default"; // Default to "defaultDiff"
    const savedTheme = localStorage.getItem('selectedTheme') || "green"; // Default to "green"
    const savedNoise = localStorage.getItem('selectedNoise') || "none"; // Default to "none"
    const savedNoiseVolume = localStorage.getItem('selectedNoiseVolume') || 1; // Default volume
    const savedSoundVolume = localStorage.getItem('selectedSoundVolume') || 1; // Default volume
    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle') === "true"; // Convert to boolean
    const backGroundGridT = localStorage.getItem('backGroundGridT') === "true"; // Convert to boolean

    setTheme(savedTheme, backGroundGridT); // Apply saved theme
    document.getElementById('mode').value = savedMode; // Update dropdown
    document.getElementById('diff').value = savedDifficulty; // Update dropdown
    document.getElementById('themesS').value = savedTheme; // Update dropdown
    document.getElementById('backGroundGridT').checked = backGroundGridT; // Update toggle
    document.getElementById('musicS').value = savedNoise; // Update dropdown
    document.getElementById('soundT').checked = soundEffectsToggle; // Update toggle
    document.getElementById('musicV').value = savedNoiseVolume; // Update volume
    document.getElementById('soundV').value = savedSoundVolume; // Update volume
    // Wait for user interaction to start playing the noise
    document.addEventListener('click', () => {
        setNoise(savedNoise, parseFloat(savedNoiseVolume));
        soundEffects.click.volume = parseFloat(savedSoundVolume);
        soundEffects.wrong.volume = parseFloat(savedSoundVolume);
        soundEffects.correct.volume = parseFloat(savedSoundVolume);
    }, { once: true });
});
document.addEventListener('click', () => {
    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle')
    if (window.getComputedStyle(soloP).display === "none" && soundEffectsToggle === 'true') {
        soundEffects.click.play();
    }
});


// Pause and resume music based on tab visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden && currentAudio) {
        currentAudio.pause(); // Pause audio when the tab is hidden
        soundEffects.click.pause()
        soundEffects.wrong.pause()
        soundEffects.correct.pause()
    } else if (!document.hidden && currentAudio) {
        currentAudio.play(); // Resume audio when the tab is visible again
    }
});










// Game functionality
const signInAndLoginP = document.querySelector(".signInAndLoginP");
const mainMenuP = document.querySelector(".mainMenuP");
const leaderBoardP = document.querySelector(".leaderBoardP");
const settingsP = document.querySelector(".settingsP");
const soloP = document.querySelector(".soloP");
const scoreEl = document.querySelector(".score");
const highScoreEl = document.querySelector(".highScore");
const display = document.querySelector(".display");
const Phr = document.querySelector(".Phr");
const messageEl = document.querySelector(".massage");
const probEl = document.querySelector(".prob");
const op1 = document.querySelector(".op1");
const op2 = document.querySelector(".op2");
const op3 = document.querySelector(".op3");
const op4 = document.querySelector(".op4");
const backConfirmationModal = document.getElementById('backConfirmationModal');
const loseConfirmationModal = document.getElementById('loseConfirmationModal');
const confirmYes = document.querySelector("#confirmYes");
const confirmNo = document.querySelector("#confirmNo");
const tryAgainBtn = document.querySelector("#tryAgainBtn");
const MainMenuBtn = document.querySelector("#MainMenuBtn");
const scoreMessage = document.querySelector("#scoreMessage");
const startCountdown = document.querySelector(".startCountdown")


let randomNum1, randomNum2, wrongAns1, wrongAns2, wrongAns3, ans, ran;
let anssList = [];
let score = 0;
let highsetScore = localStorage.getItem("highScore")
if (highsetScore === null) {
    highsetScore = 0
    localStorage.setItem("highScore", 0)
}
let max, min;
let sign = "+";

function startCountdownF() {
    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle')
    if (soundEffectsToggle == "true") {
        soundEffects.bob.play();
    }
    startCountdown.innerHTML = "3...."

    setTimeout(() => {
        startCountdown.innerHTML = "2.."
    }, 1000);
    setTimeout(() => {
        startCountdown.innerHTML = "1"
    }, 2000);
    setTimeout(() => {
        startCountdown.innerHTML = "START!!!"
    }, 3000);
    setTimeout(() => {
        startCountdown.style.display = "none";
    }, 4000)
}

function generateRandomNumbers() {
    let difficulty = document.getElementById("diff").value

    switch (difficulty) {
        case "easy":
            min = 1;
            if (sign === "X" || sign === "/") {
                max = 5; // Smaller range for multiplication and division in easy mode
            }
            else {
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
            } else if (sign === "^" || sign === "√") {
                min = 2
                max = 3
            }
            else {
                min = 40;
                max = 100; // Range for addition and subtraction in extreme mode
            }
            break;
        case "default":
            if (score < 10) {
                min = 1;
                if (sign === "X" || sign === "/") {
                    max = 5; // Smaller range for multiplication and division in easy mode
                }
                else {
                    max = 15; // Range for addition and subtraction in easy mode
                }
            }
            else if (score < 15) {
                if (sign === "X" || sign === "/") {
                    min = 2; // Slightly higher minimum for multiplication and division in normal mode
                    max = 9; // Slightly higher maximum for multiplication and division in normal mode
                }
                else {
                    min = 5;
                    max = 30; // Range for addition and subtraction in normal mode
                }
            }
            else if (score < 20) {
                if (sign === "X" || sign === "/") {
                    min = 5; // Higher minimum for multiplication and division in hard mode
                    max = 13; // Higher maximum for multiplication and division in hard mode
                } else {
                    min = 15;
                    max = 45; // Range for addition and subtraction in hard mode
                }
            }
            else if (score < 25) {
                if (sign === "X" || sign === "/") {
                    min = 10; // Higher minimum for multiplication and division in extreme mode
                    max = 17; // Higher maximum for multiplication and division in extreme mode
                }
                else if (sign === "^" || sign === "√") {
                    min = 2
                    max = 9
                }
                else {
                    min = 40;
                    max = 100; // Range for addition and subtraction in extreme mode
                }
            }
    }

    ran = Math.floor(Math.random() * (max - min + 1) + min);
    return ran;
}


function startTheGame() {
    let difficulty = document.getElementById("diff").value;
    let mode = document.getElementById("mode").value;
    if (mode === "mix") {
        sign = ["+", "-", "X", "/"][Math.floor(Math.random() * 4)];
    }
    else if (mode === "default") {
        if (score <= 10) {
            sign = "+";

        }
        else if (score > 10 && score < 15) {
            sign = ["+", "-"][Math.floor(Math.random() * 2)];

        }
        else if (score > 15 && score < 20) {
            sign = ["+", "-", "X", "/"][Math.floor(Math.random() * 4)];

        }
        else if (score > 20) {
            sign = ["+", "-", "X", "/", "^", "√"][Math.floor(Math.random() * 6)];
        }
    }
    else {
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
        case "^":
            ans = Math.pow(randomNum1, 2);
            // if (randomNum2 > 2) randomNum2 = Math.floor(Math.random() + 2); // Limit exponent range
            // ans = Math.pow(randomNum1, randomNum2);
            break;
        case "√":
            randomNum1 = Math.pow(Math.floor(Math.random() * 10 + 1), 2); // Ensure a perfect square
            ans = Math.sqrt(randomNum1);
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
    if (sign === "√") {
        probEl.textContent = `√${randomNum1} = `;
    }
    else if (sign === "^") {
        probEl.innerHTML = `${randomNum1} <span class="superscript">
        ${2}
        </span>=`
    }
    else {
        probEl.textContent = `${randomNum1} ${sign} ${randomNum2} = `;
    }


    anssList = [ans, wrongAns1, wrongAns2, wrongAns3].sort(() => Math.random() - 0.5);

    op1.textContent = anssList[0];
    op2.textContent = anssList[1];
    op3.textContent = anssList[2];
    op4.textContent = anssList[3];

    scoreEl.textContent = `Score: ${score}`;
    if (difficulty === "default" && mode === "default") {
        highScoreEl.textContent = `Highest: ${highsetScore}`;
    }
    else if (difficulty !== "default" && mode !== "default") {
        highScoreEl.style.display = "none";
    }

}


[op1, op2, op3, op4].forEach(btn => btn.addEventListener("click", () => checkAnswer(Number(btn.textContent))));

function checkAnswer(selectedAns) {
    (selectedAns === ans) ? win() : lose();
}
function win() {
    let difficulty = document.getElementById("diff").value;
    let mode = document.getElementById("mode").value;
    score = score + 1;
    if (score > highsetScore && difficulty === "default" && mode === "default") {
        highsetScore = score;
        localStorage.setItem("highScore", highsetScore);
    }
    scoreEl.textContent = `Score: ${score}`;
    messageEl.textContent = "Correct!";
    startTheGame();
    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle')
    if (soundEffectsToggle === 'true') {
        soundEffects.correct.play()
    }
}
function lose() {
    scoreMessage.textContent = `Your score is: ${score}`;
    probEl.textContent = `WRONG!!!!`
    score = 0;
    scoreEl.textContent = `Score: ${score}`;
    messageEl.textContent = "Wrong!";
    display.classList.add("displayL");
    Phr.classList.add("hrL");
    probEl.classList.add("probL");
    messageEl.classList.add("messageL");
    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle')
    if (soundEffectsToggle === 'true') {
        soundEffects.wrong.play()
    }
    setTimeout(() => {
        display.classList.remove("displayL");
        Phr.classList.remove("hrL");
        probEl.classList.remove("probL");
        messageEl.classList.remove("messageL");
        setTimeout(() => {
            loseConfirmationModal.style.display = 'flex';
        }, 100);
    }, 1000);
}

function back() {
    backConfirmationModal.style.display = 'flex';
}

confirmYes.addEventListener('click', () => {
    soloP.classList.remove("soloP-op");
    mainMenuP.classList.add("mainMenuP-op");
    backConfirmationModal.style.display = 'none';
    score = 0;
    scoreEl.textContent = `Score: ${score}`;
    messageEl.textContent = "";
});
confirmNo.addEventListener('click', () => {
    backConfirmationModal.style.display = 'none';
})

tryAgainBtn.addEventListener('click', () => {
    loseConfirmationModal.style.display = 'none'
    messageEl.textContent = "Start"
    startTheGame()
})

MainMenuBtn.addEventListener('click', () => {
    soloP.classList.remove("soloP-op");
    mainMenuP.classList.add("mainMenuP-op");
    loseConfirmationModal.style.display = 'none';
})


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

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
const joinBtn = document.querySelector(".joinBtn");

joinBtn.addEventListener("click", () => {
    // Select elements after DOM has fully loaded
    const userName = document.querySelector("#name");
    const userEmail = document.querySelector("#email");
    const userPassword = document.querySelector("#password");
    const authForm = document.querySelector(".signInAndLoginP");
    const userContent = document.querySelector(".settingsP");
    const signUpbtn = document.querySelector(".signUp");
    const signInbtn = document.querySelector(".signIn");
    const noAcountOption = document.querySelector("#noAccountOption");
    const yesAcountOption = document.querySelector("#yesAccountOption");
    const guestOp = document.querySelector(".guestOp");
    // Firebase sign-up logic
    noAcountOption.addEventListener("click", () => {
        userName.value = ""
        userEmail.value = ""
        userPassword.value = ""
        noAcountOption.style.display = "none";
        yesAcountOption.style.display = "flex";
        userName.style.display = "inline-block";
        signInbtn.style.display = "none";
        signUpbtn.style.display = "block";
    });
    yesAcountOption.addEventListener("click", () => {
        userName.textContent = ""
        userEmail.textContent = ""
        userPassword.textContent = ""
        noAcountOption.style.display = "flex";
        yesAcountOption.style.display = "none";
        userName.style.display = "none";
        signInbtn.style.display = "block";
        signUpbtn.style.display = "none";
    });
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
                email: signUpEmail,
                scores: {
                    default_default: 0,
                    default_easy: 0,
                    default_normal: 0,
                    default_hard: 0,
                    default_extreme: 0,

                    add_default: 0,
                    add_easy: 0,
                    add_normal: 0,
                    add_hard: 0,
                    add_extreme: 0,

                    sub_default: 0,
                    sub_easy: 0,
                    sub_normal: 0,
                    sub_hard: 0,
                    sub_extreme: 0,

                    mul_default: 0,
                    mul_easy: 0,
                    mul_normal: 0,
                    mul_hard: 0,
                    mul_extreme: 0,

                    div_default: 0,
                    div_easy: 0,
                    div_normal: 0,
                    div_hard: 0,
                    div_extreme: 0,

                    mix_default: 0,
                    mix_easy: 0,
                    mix_normal: 0,
                    mix_hard: 0,
                    mix_extreme: 0
                }
            });
            const leaderBoard = ref(database, 'leaderBoard/' + user.uid);
            await set(leaderBoard, {
                name: signUpName,
                score: 0
            });
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            window.alert("error")
            window.alert(errorCode, errorMessage);
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
                authForm.classList.remove("signInAndLoginP-op")
                userContent.classList.add("settingsP-op");
                return (true)
            } else {
                authForm.classList.add("signInAndLoginP-op");
                userContent.classList.remove("settingsP-op");
                return (false)
            }
        });
    };

    // Add event listeners to buttons
    signUpbtn.addEventListener("click", userSignup);
    signInbtn.addEventListener("click", userSignIn);
    guestOp.addEventListener("click", () => {
        authForm.style.display = "none";
        userContent.classList.add("mainMenuP-op");
    });
    checkAuthState();
});
const joinForm = document.querySelector("#joinForm");
const signOutForm = document.querySelector("#signOutForm");
const deleteForm = document.querySelector("#deleteForm");
const changeNameForm = document.querySelector("#changeNameForm");
const accountSettingsOptions = document.querySelector(".accountSettingsOptions");

const checkAuthState = async () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            accountSettingsOptions.innerHTML = ""; // Clear existing content
            accountSettingsOptions.appendChild(signOutForm);
            accountSettingsOptions.appendChild(deleteForm);
            accountSettingsOptions.appendChild(changeNameForm);
        } else {
            accountSettingsOptions.innerHTML = ""; // Clear existing content
            accountSettingsOptions.appendChild(joinForm);
        }
    });
};

checkAuthState();
let highsetScore = getDefaultScores();

// Declare highsetScore globally
async function getHigh() {
    const database = getDatabase();
    
    // Create a promise that resolves when auth state is ready
    const getCurrentUser = () => {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe(); // Stop listening after first response
                resolve(user);
            });
        });
    };
    
    try {
        // Wait for auth state to be ready
        const user = await getCurrentUser();
        if (user) {
            console.log("User is logged in:", user.email);
            // Get user's scores from Firebase database
            const userRef = ref(database, 'users/' + user.uid);
            const snapshot = await get(userRef);
            
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData.scores) {
                    console.log("Found user scores:", userData.scores);
                    return userData.scores;
                }
            }
            
            // If no scores exist, set default scores
            console.log("Setting default scores for user");
            const defaultScores = getDefaultScores();
            await set(ref(database, 'users/' + user.uid + '/scores'), defaultScores);
            return defaultScores;
        } else {
            console.log("No user logged in, using localStorage");
            // Handle local storage for non-logged in users
            try {
                let localHighScores = localStorage.getItem("highScore");
                if (localHighScores) {
                    localHighScores = JSON.parse(localHighScores);
                    if (isValidScores(localHighScores)) {
                        console.log("Found valid local scores:", localHighScores);
                        return localHighScores;
                    }
                }
                // Set default scores if none exist or are invalid
                console.log("Setting default local scores");
                const defaultScores = getDefaultScores();
                localStorage.setItem("highScore", JSON.stringify(defaultScores));
                return defaultScores;
            } catch (localStorageError) {
                console.error("localStorage error:", localStorageError);
                return getDefaultScores();
            }
        }
    } catch (error) {
        console.error("Error getting high scores:", error);
        return getDefaultScores();
    }
}

// Initialize high scores
getHigh().then((scores) => {
    highsetScore = scores;
    console.log("Successfully initialized high scores:", scores);
}).catch((error) => {
    console.error("Failed to initialize high scores:", error);
    highsetScore = getDefaultScores();
});
// highsetScore = JSON.parse(localStorage.getItem("highScore"))
// highsetScore.default_easy = 3
// localStorage.setItem
// Utility function to provide default scores
function getDefaultScores() {
    return {
        default_default: 0,
        default_easy: 0,
        default_normal: 0,
        default_hard: 0,
        default_extreme: 0,

        add_default: 0,
        add_easy: 3,
        add_normal: 0,
        add_hard: 0,
        add_extreme: 0,

        sub_default: 0,
        sub_easy: 0,
        sub_normal: 0,
        sub_hard: 0,
        sub_extreme: 0,

        mul_default: 0,
        mul_easy: 0,
        mul_normal: 0,
        mul_hard: 0,
        mul_extreme: 0,

        div_default: 0,
        div_easy: 0,
        div_normal: 0,
        div_hard: 0,
        div_extreme: 0,

        mix_default: 0,
        mix_easy: 0,
        mix_normal: 0,
        mix_hard: 0,
        mix_extreme: 0
    };
}

// Utility function to validate scores structure
function isValidScores(scores) {
    return scores && typeof scores === "object" && !Array.isArray(scores);
}

// Example usage:
const signOutBtn = document.querySelector(".signOutBtn");
const deleteAccBtn = document.querySelector(".deleteAccBtn");
// Sign-out functionality
signOutBtn.addEventListener("click", async () => {
    await auth.signOut();
    checkAuthState()
});

// Delete account functionality
deleteAccBtn.addEventListener("click", async () => {
    checkAuthState()
    const user = auth.currentUser;
    // Delete the user from Firebase Auth
    await user.delete();

    // Remove additional user data from the Realtime Database
    const userRef = ref(database, 'users/' + user.uid);
    const leaderBoardRef = ref(database, 'leaderBoard/' + user.uid);
    await set(userRef, null);
    await set(leaderBoardRef, null);
});





const mainMenuP = document.querySelector(".mainMenuP");
mainMenuP.classList.add("mainMenuP-op");
const playBtn = document.querySelector(".playBtn");
const leaderBoardBtn = document.querySelector(".leaderBoardBtn");
const settingsBtn = document.querySelector(".settingsBtn");
const backBtn = document.querySelector(".backBtn");
playBtn.addEventListener("click", () => {
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
    beep: new Audio("soundEffect/beep.mp3"),
    highScore: new Audio("soundEffect/highScore.mp3")
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
        backgroundColor: "#F5F5F5", // Light gray for a clean background
        primaryColor: "#1A1A1A", // Dark gray for primary text and elements
        lowerPrimaryColor: "#1A1A1A80", // Subtle dark gray for accents
        secondaryColor: "#3D3D3D", // Medium gray for highlights
        textColor: "#1F2937", // Dark gray text for contrast
        hoverColor: "#333333", // Darker gray for hover
        shadowColor: "#D3D3D3", // Soft gray shadow
        focusColor: "#000000", // Black for focused elements
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
const correctEq = document.getElementById("correct-eq")

let randomNum1, randomNum2, randomNum3, wrongAns1, wrongAns2, wrongAns3, ans, ran, problem;
let anssList = [];
let score = 0;
let max, min;
let sign = "+";
let secondSign = "+";
let gotHighScore = false;
function startCountdownF() {
    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle')
    startCountdown.style.display = "flex";
    if (soundEffectsToggle == "true") {
        soundEffects.beep.play();
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

function generateRandomNumbers(sign) {
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
                max = 30; // Range for addition and subtraction in normal mode
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
            else if (score > 15) {
                if (sign === "X" || sign === "/") {
                    min = 5; // Higher minimum for multiplication and division in hard mode
                    max = 7; // Higher maximum for multiplication and division in hard mode
                }
                else if (sign === "^" || sign === "√") {
                    min = 2
                    max = 9
                }
                else {
                    min = 15;
                    max = 45; // Range for addition and subtraction in hard mode
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
        secondSign = ["+", "-"][Math.floor(Math.random() * 2)];
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
            sign = [ "^", "√"][Math.floor(Math.random() * 2)];
            secondSign = ["+", "-"][Math.floor(Math.random() * 2)];
        }
    }
    else {
        sign = mode === "add" ? "+" : mode === "sub" ? "-" : mode === "mul" ? "X" : "/";
        if (mode === "add") {
            secondSign = "+";
        } else if (mode === "sub") {
            secondSign = "-";
        } else if (mode === "mul") {
            secondSign = ["+", "-"][Math.floor(Math.random() * 2)];
        }
    }
    randomNum1 = generateRandomNumbers(sign)
    randomNum2 = generateRandomNumbers(sign)
    randomNum3 = generateRandomNumbers(secondSign)
    switch (sign) {
        case "+":
            ans = randomNum1 + randomNum2;
            break;
        case "-":
            // Ensure subtraction doesn't result in negative numbers for easier difficulties
            if (difficulty === "easy" || (difficulty === "default" && score < 15)) {
                let temp = Math.max(randomNum1, randomNum2);
                randomNum2 = Math.min(randomNum1, randomNum2);
                randomNum1 = temp;
            }
            ans = randomNum1 - randomNum2;
            break;
        case "X":
            ans = randomNum1 * randomNum2;
            break;
        case "/":
            // Ensure division results in whole numbers
            if (randomNum2 === 0) randomNum2 = 1;
            randomNum1 = generateRandomNumbers(sign) * randomNum2;
            ans = randomNum1 / randomNum2;
            break;
        case "^":
            ans = Math.pow(randomNum1, 2);
            break;
        case "√":
            // Generate perfect squares for square roots
            randomNum1 = Math.pow(Math.floor(Math.random() * 6 + 1), 2);
            ans = Math.sqrt(randomNum1);
            break;
    }
    if (difficulty === "default" && score > 20 || difficulty === "extreme") {
        switch (secondSign) {
            case "+":
                ans = ans + randomNum3;
                break;
            case "-":
                ans = ans - randomNum3;
                break;
        }
    }
    let errorRange = difficulty === "easy" ? 3 :
        difficulty === "normal" ? 5 :
            difficulty === "hard" ? 8 : 10;

    let wrongAns1 = ans + Math.floor(Math.random() * errorRange + 1);
    let wrongAns2 = ans - Math.floor(Math.random() * errorRange + 1);
    let wrongAns3 = ans + Math.floor(Math.random() * (errorRange / 2) + 1);

    // Ensure all wrong answers are unique and different from the correct answer
    while (new Set([ans, wrongAns1, wrongAns2, wrongAns3]).size !== 4) {
        wrongAns1 = ans + Math.floor(Math.random() * errorRange + 1);
        wrongAns2 = ans - Math.floor(Math.random() * errorRange + 1);
        wrongAns3 = ans + Math.floor(Math.random() * (errorRange / 2) + 1);
    }

    // Display the problem and shuffle the answer options
    if (sign === "√") {
        problem = `√${randomNum1}  `;
    }
    else if (sign === "^") {
        let power = `<span>2</span>`;
        problem = `${randomNum1} ${power} `;
    }
    else {
        problem = `${randomNum1} ${sign} ${randomNum2} `;
    }
    if (difficulty === "extreme" || difficulty === "default" && score > 20) {
        problem += `${secondSign} ${randomNum3} = `
    } else {
        problem += "= ";
    }


    anssList = [ans, wrongAns1, wrongAns2, wrongAns3].sort(() => Math.random() - 0.5);

    op1.textContent = anssList[0];
    op2.textContent = anssList[1];
    op3.textContent = anssList[2];
    op4.textContent = anssList[3];
    let key = `${mode}_${difficulty}`
    scoreEl.textContent = `Score: ${score}`;
    highScoreEl.textContent = `Highest: ${highsetScore[key]}`;
    probEl.innerHTML = problem
}
[op1, op2, op3, op4].forEach(btn => btn.addEventListener("click", (event) => checkAnswer(event, Number(btn.textContent))));

function checkAnswer(event, selectedAns) {
    if (selectedAns === ans) {
        win();
    } else {
        lose();
    }

    [op1, op2, op3, op4].forEach(btn => {
        if (Number(btn.textContent) === ans) {
            btn.classList.add("buttonW");
        } else {
            btn.classList.add("buttonL");
        }
    });
    setTimeout(() => {
        [op1, op2, op3, op4].forEach(btn => {
            btn.classList.remove("buttonW");
            btn.classList.remove("buttonL");
        });
    }, 1000);
}
function win() {
    
    let difficulty = document.getElementById("diff").value;
    let mode = document.getElementById("mode").value;
    messageEl.textContent = "Correct!";
    score = score + 1;
    probEl.innerHTML = problem + ans; // Display the correct answer
    probEl.classList.add("correct-animation"); // Add animation class

    setTimeout(() => {
        probEl.classList.remove("correct-animation"); // Remove the animation class after 1 second
        probEl.innerHTML = ""; // Clear the problem text
        let key = `${mode}_${difficulty}`;
        probEl.textContent = `CORRECT!!!!`; // Reset problem text
        if (score > highsetScore[key]) {
            highsetScore[key] = score;
            localStorage.setItem("highScore", JSON.stringify(highsetScore));
            if(gotHighScore === false){
                messageEl.textContent = "!!NEW HIGH SCORE!!";
                if(soundEffectsToggle === "true"){
                    soundEffects.highScore.play();
                }
                gotHighScore = true
            }
        }
        scoreEl.textContent = `Score: ${score}`;
        
        startTheGame(); // Start the next round
    }, 500); // Delay for 1 second

    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle');
    if (soundEffectsToggle === 'true') {
        soundEffects.correct.play(); // Play the correct answer sound
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
    correctEq.textContent = `The correct answer is: ${ans}`
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
    startCountdownF()
    startTheGame()
})

MainMenuBtn.addEventListener('click', () => {
    soloP.classList.remove("soloP-op");
    mainMenuP.classList.add("mainMenuP-op");
    loseConfirmationModal.style.display = 'none';
})


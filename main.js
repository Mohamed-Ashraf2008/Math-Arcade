import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD2OWGUWuNqbSKq7RQgA4gCpm37Bqqoevo",
    authDomain: "math-games-ca70d.firebaseapp.com",
    projectId: "math-games-ca70d",
    storageBucket: "math-games-ca70d.appspot.com",
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
    const errorMessage = document.querySelector("#error-message");

    noAcountOption.addEventListener("click", () => {
        userName.value = "";
        userEmail.value = "";
        userPassword.value = "";
        noAcountOption.style.display = "none";
        yesAcountOption.style.display = "flex";
        userName.style.display = "inline-block";
        signInbtn.style.display = "none";
        signUpbtn.style.display = "block";
    });

    yesAcountOption.addEventListener("click", () => {
        userName.value = "";
        userEmail.value = "";
        userPassword.value = "";
        noAcountOption.style.display = "flex";
        yesAcountOption.style.display = "none";
        userName.style.display = "none";
        signInbtn.style.display = "block";
        signUpbtn.style.display = "none";
    });

    const userSignup = async () => {
        const signUpName = userName.value.trim();
        const signUpEmail = userEmail.value.trim();
        const signUpPassword = userPassword.value.trim();

        errorMessage.textContent = "";
        errorMessage.style.display = "none";

        try {
            const usersRef = ref(database, 'users');
            const snapshot = await get(usersRef);
            if (snapshot.exists()) {
                const users = snapshot.val();
                for (let uid in users) {
                    if (users[uid].name === signUpName) {
                        errorMessage.textContent = "This username is already taken. Choose another one.";
                        errorMessage.style.display = "block";
                        return;
                    }
                }
            }

            const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
            const user = userCredential.user;

            // ✅ Set the display name in Firebase Authentication
            await updateProfile(user, {
                displayName: signUpName
            });

            // ✅ Save the user data in Realtime Database
            const userRef = ref(database, 'users/' + user.uid);
            await set(userRef, {
                name: signUpName,
                email: signUpEmail,
                scores: {
                    default: 0,
                    add: 0,
                    sub: 0,
                    mul: 0,
                    div: 0,
                    total: 0,
                    soloGamesPlayed: 0,
                    coopGamesPlayed: 0,
                    playerOneScores: 0,
                    playerTwoScores: 0,
                    playerOneWon: 0,
                    playerTwoWon: 0
                }
            });

            location.reload();
        } catch (error) {
            errorMessage.textContent = getFirebaseErrorMessage(error.code);
            errorMessage.style.display = "block";
        }
    };

    const userSignIn = async () => {
        const signInEmail = userEmail.value.trim();
        const signInPassword = userPassword.value.trim();

        errorMessage.textContent = "";
        errorMessage.style.display = "none";

        try {
            const userCredential = await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
            const user = userCredential.user;
            console.log(user);

            location.reload();
        } catch (error) {
            errorMessage.textContent = getFirebaseErrorMessage(error.code);
            errorMessage.style.display = "block";
        }
    };

    const getFirebaseErrorMessage = (errorCode) => {
        switch (errorCode) {
            case "auth/invalid-email":
                return "Please enter a valid email address.";
            case "auth/weak-password":
                return "Password must be at least 6 characters.";
            case "auth/email-already-in-use":
                return "This email is already in use. Try signing in.";
            case "auth/user-not-found":
                return "No user found with this email. Please sign up.";
            case "auth/wrong-password":
                return "Incorrect password. Please try again.";
            default:
                return "Something went wrong. Please try again.";
        }
    };

    const checkAuthState = async () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {

                transitionPage(signInAndLoginP, settingsP)
                return true;
            } else {

                transitionPage(settingsP, signInAndLoginP)
                return false;
            }
        });
    };

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
        default: 0,
        add: 0,
        sub: 0,
        mul: 0,
        div: 0,
        total: 0,
        soloGamesPlayed: 0,
        coopGamesPlayed: 0,
        playerOneScores: 0,
        playerTwoScores: 0,
        playerOneWon: 0,
        playerTwoWon: 0
    };
}

// This function generates a unique guest name
async function generateUniqueGuestName() {
    return `guest`;
}

// This function gets called when the game is opened

async function onGameOpen() {
    onAuthStateChanged(auth, async (user) => {
        if (user && user.email) {
            const nameDisplay = document.querySelector("#username-display");
            if (nameDisplay) {
                if (user.displayName) {
                    nameDisplay.textContent = `Welcome, ${user.displayName}`;
                } else {
                    nameDisplay.textContent = ""; // Or hide it if name is not set
                }
            }
        } else {
            // Guest logic
            const userData = localStorage.getItem('userData');
            if (!userData) {
                console.log("No user data found.");
                localStorage.setItem('userData', 'true');
                const guestName = await generateUniqueGuestName();
                const guestNameElement = document.querySelector("#username-display");
                if (guestNameElement) {
                    guestNameElement.textContent = `Welcome, ${guestName}`;
                }
            } else {
                const guestNameElement = document.querySelector("#username-display");
                const guestName = await generateUniqueGuestName();
                if (guestNameElement) {
                    guestNameElement.textContent = `Welcome, ${guestName}`;
                }
            }
        }
    });
}


// Call onGameOpen when the game is opened
onGameOpen();

async function incrementUserValue(key) {
    if (auth.currentUser) {
        const userRef = ref(database, 'users/' + auth.currentUser.uid + '/scores/' + key);

        try {
            const snapshot = await get(userRef);
            const currentValue = snapshot.exists() ? snapshot.val() || 0 : 0; // Default to 0 if null or not found
            await set(userRef, currentValue + 1);
            console.log(`${key} incremented successfully in Firebase!`);
        } catch (error) {
            console.error(`Error updating ${key} in Firebase:`, error);
        }
    } else {
        console.log("No user is logged in, updating local storage.");
        try {
            let localHighScores = localStorage.getItem("highScore");
            localHighScores = JSON.parse(localHighScores)


            localHighScores[key] += 1;
            localStorage.setItem("highScore", JSON.stringify(localHighScores));
            console.log(`${key} incremented successfully in local storage!`);
        } catch (localStorageError) {
            console.error("Error updating local storage:", localStorageError);
        }
    }
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
    await set(userRef, null);
});





const mainMenuP = document.querySelector(".mainMenuP");
mainMenuP.classList.add("mainMenuP-op");
mainMenuP.style.display = "flex";

const playBtn = document.querySelector(".playBtn");
const onePlayer = document.querySelector(".onePlayer");
const onePlayerZen = document.querySelector(".onePlayerZen");
const twoPlayers = document.querySelector(".twoPlayers");
const leaderBoardBtn = document.querySelector(".leaderBoardBtn");
const settingsBtn = document.querySelector(".settingsBtn");
const statsBtn = document.querySelector(".statsBtn")
const backBtn = document.querySelector(".backBtn");
const backZenBtn = document.querySelector(".backZenBtn");
const homeBtn = document.querySelector(".homeBtn");
const homeBtnForStats = document.querySelector(".homeBtnForStats")
const multiplayerHomeBtn = document.querySelector("#homeButton");

function transitionPage(fromEl, toEl) {
    fromEl.style.transition = "opacity 0.2s ease";
    // fromEl.style.opacity = 0;

    setTimeout(() => {
        fromEl.classList.remove(`${fromEl.classList[0]}-op`);
        fromEl.style.display = "none";
        fromEl.style.opacity = "";

        toEl.style.display = "flex";
        // toEl.style.opacity = 0;
        toEl.style.transition = "opacity 0.2s ease";

        requestAnimationFrame(() => {
            toEl.classList.add(`${toEl.classList[0]}-op`);
            // toEl.style.opacity = 1;
        });
    }, 200);
}


// PLAY BUTTON
playBtn.addEventListener("click", () => {
    transitionPage(mainMenuP, modeSelectP);
});

// SOLO MODE
onePlayer.addEventListener("click", () => {
    transitionPage(modeSelectP, soloP);
    messageEl.textContent = "Start!";
    startCountdownF("solo");
    startTheSoloGame();
    incrementUserValue('soloGamesPlayed');
});
onePlayerZen.addEventListener("click", () => {
    startSleepyCatAnimation(messageZenEl);
    messageZenEl._catAnimation.happy();
    messageZenEl._catAnimation.startSleeping();
    startTheSoloZenGame();
    transitionPage(modeSelectP, soloZenP);
});

// MULTIPLAYER MODE
twoPlayers.addEventListener("click", () => {
    transitionPage(modeSelectP, multiplayerP);
    messageEl.textContent = "Start!";
    startCountdownF("multiplayer");
    startTheMultiplayerGame();
    incrementUserValue('coopGamesPlayed');
});

// LEADERBOARD
leaderBoardBtn.addEventListener("click", () => {
    transitionPage(mainMenuP, leaderBoardP); // Always show the page
    displayLeaderboard(); // Only load data if signed in
});

// SETTINGS
settingsBtn.addEventListener("click", () => {
    transitionPage(mainMenuP, settingsP);
});

// STATS
statsBtn.addEventListener("click", async () => {
    transitionPage(mainMenuP, statsP);

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log("User found:", user.uid);
            const userRef = ref(database, 'users/' + user.uid);
            await fetchUserStats(userRef);
        } else {
            console.log("No user logged in, using local storage.");
            let localScores = JSON.parse(localStorage.getItem("highScore")) || getDefaultScores();
            updateStats(localScores);
        }
    });
});


async function fetchUserStats(userRef) {
    try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            updateStats(userData.scores); // Pass the scores to the update function
        } else {
            console.log("No data available for this user.");
        }
    } catch (error) {
        console.error("Error fetching stats:", error);
    }
}

function updateStats(scores) {
    // Solo section
    document.getElementById('addCount').textContent = `Addition: ${scores.add}`;
    document.getElementById('SubCount').textContent = `Subtraction: ${scores.sub}`;
    document.getElementById('mulCount').textContent = `Multiplication: ${scores.mul}`;
    document.getElementById('divCount').textContent = `Division: ${scores.div}`;
    document.getElementById('defaultCount').textContent = `Default: ${scores.default}`;
    document.getElementById('totalCount').textContent = `Total: ${scores.total}`;
    document.getElementById('SoloGamesPlayed').textContent = `Games Played: ${scores.soloGamesPlayed}`;

    // Multiplayer section
    let nameOfP1 = document.getElementById("changeNameOfP1").value
    let nameOfP2 = document.getElementById("changeNameOfP2").value
    document.getElementById('playerOneScoreCount').textContent = `${nameOfP1} Total Score: ${scores.playerOneScores}`;
    document.getElementById('playerOneWinsCount').textContent = `${nameOfP1} Wins: ${scores.playerOneWon}`;
    document.getElementById('playerTwoScoreCount').textContent = `${nameOfP2} Total Score: ${scores.playerTwoScores}`;
    document.getElementById('playerTwoWinsCount').textContent = `${nameOfP2} Wins: ${scores.playerTwoWon}`;
    document.getElementById('multiplayerGamesPlayed').textContent = `Games Played: ${scores.coopGamesPlayed}`;
}
// Function to fetch and display the top 100 players on the leaderboard
const rankedBySelect = document.getElementById("rankedBy");
rankedBySelect.addEventListener("change", () => {
    displayLeaderboard();
});

function displayLeaderboard() {
    const leaderboardContainer = document.querySelector(".leaderBoardP .players");
    leaderboardContainer.innerHTML = "";

    const rankedBySelect = document.getElementById("rankedBy");
    const userRef = ref(database, 'users');
    const user = auth.currentUser;
    const currentUserName = user ? (user.displayName || user.email || "").trim().toLowerCase() : null;

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const leaderBoardData = snapshot.val();

            const players = Object.keys(leaderBoardData).map(userId => ({
                id: userId,
                name: leaderBoardData[userId].name,
                score: leaderBoardData[userId].scores?.[rankedBySelect.value] || 0
            }));

            players.sort((a, b) => b.score - a.score);
            const topPlayers = players.slice(0, 1000);

            let foundCurrentUser = false;

            topPlayers.forEach((player, index) => {
                const playerDiv = document.createElement("div");
                playerDiv.className = "player";
                playerDiv.id = `player-${index + 1}`;

                const playerName = player.name.trim().toLowerCase();
                if (currentUserName && playerName === currentUserName) {
                    playerDiv.classList.add("current-player");
                    foundCurrentUser = true;
                }

                const rankH1 = document.createElement("h1");
                rankH1.className = "rank";
                rankH1.id = `rank-${index + 1}`;
                rankH1.textContent = "#" + (index + 1);

                const playerNameH1 = document.createElement("h1");
                playerNameH1.className = "player-name";
                playerNameH1.id = `player-name-${index + 1}`;
                playerNameH1.textContent = player.name;

                const scoreH1 = document.createElement("h1");
                scoreH1.className = "score";
                scoreH1.id = `score-${index + 1}`;
                scoreH1.textContent = player.score;

                playerDiv.appendChild(rankH1);
                playerDiv.appendChild(playerNameH1);
                playerDiv.appendChild(scoreH1);

                leaderboardContainer.appendChild(playerDiv);
            });

            // Show guest message if not signed in or not ranked
            if (!user) {
                const guestMessage = document.createElement("div");
                guestMessage.className = "guest-mes player current-player";
                guestMessage.textContent = "Sign in to compete on the leaderboard!";
                leaderboardContainer.appendChild(guestMessage);
            }
        }
    }).catch((error) => {
        console.error("Error fetching leaderboard data:", error);
        leaderboardContainer.innerHTML = `<div class="guest-mes player">Failed to load leaderboard.</div>`;
    });
}


// Add event listener to automatically recall the leaderboard function when the select changes

// Check if the user is signed in

// Fetch user stats

// Call fetchUserStats to fetch and display data

// Call the function when the leaderboard page is opened

backBtn.addEventListener("click", () => back());
homeBtn.addEventListener("click", () => home());
multiplayerHomeBtn.addEventListener("click", () => multiplayerHome());
homeBtnForStats.addEventListener("click", () => homeForStats())
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
        pixelShadow: "#064D38",
    },
    dark: {
        backgroundColor: "#1A1A1A",
        primaryColor: "#27272780",
        lowerPrimaryColor: "#27272740",
        secondaryColor: "#CCCCCC",
        textColor: "#020202",
        hoverColor: "#B3B3B3",
        shadowColor: "#3D3D3D",
        focusColor: "#FFFFFF",
        fontFamilyMain: "'Jersey 25', Geneva, Tahoma, sans-serif",
        fontFamilySecondary: "'Abril Fatface', cursive",
        pixelShadow: "#111111",
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
        pixelShadow: "#590017",
    },
    yellow: {
        backgroundColor: "#1A1A00",
        primaryColor: "#B28B00",
        lowerPrimaryColor: "#B28B0040",
        secondaryColor: "#FFD700",
        textColor: "#F5F5F5",
        hoverColor: "#996B00",
        shadowColor: "#B28B0080",
        focusColor: "#FFFFFF",
        fontFamilyMain: "'Jersey 25', Geneva, Tahoma, sans-serif",
        fontFamilySecondary: "'Abril Fatface', cursive",
        pixelShadow: "#594600",
    },
    light: {
        backgroundColor: "#F5F5F5",
        primaryColor: "#1A1A1A",
        lowerPrimaryColor: "#1A1A1A30",
        secondaryColor: "#3d3d3d",
        textColor: "#f0f0f0",
        hoverColor: "#333333",
        shadowColor: "#D3D3D399",
        focusColor: "#000000",
        fontFamilyMain: "'Jersey 25', Geneva, Tahoma, sans-serif",
        fontFamilySecondary: "'Abril Fatface', cursive",
        pixelShadow: "#0d0d0d",
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
        pixelShadow: "#000d2a",
    },
    purple: {
        backgroundColor: "#2C003E",
        primaryColor: "#772a8c",
        lowerPrimaryColor: "#5E2A8C40",
        secondaryColor: "#8E44AD",
        textColor: "#F4F4F4",
        hoverColor: "#772a8c",
        shadowColor: "#5e2a8c80",
        focusColor: "#FFFFFF",
        fontFamilyMain: "'Jersey 25', Geneva, Tahoma, sans-serif",
        fontFamilySecondary: "'Abril Fatface', cursive",
        pixelShadow: "#2f1447",
    },
    colorBlind: {
        backgroundColor: "#FFFFFF",
        primaryColor: "#000000",
        lowerPrimaryColor: "#00000080",
        secondaryColor: "#F44336",
        textColor: "#000000",
        hoverColor: "#FF5722",
        shadowColor: "#00000060",
        focusColor: "#00BCD4",
        fontFamilyMain: "'Jersey 25', Geneva, Tahoma, sans-serif",
        fontFamilySecondary: "'Abril Fatface', cursive",
        pixelShadow: "#000000", // same as primary
    }
};

const backGroundNoise = {
    campFire: document.getElementById("campFire"),
    rain: document.getElementById("rain"),
    wildLife: document.getElementById("wildLife"),
    none: null
};

const soundEffects = {
    click: document.getElementById("click"),
    correct: document.getElementById("correct"),
    wrong: document.getElementById("wrong"),
    beep: document.getElementById("beep"),
    highScore: document.getElementById("highScore")
};

let currentAudio = null; // Track the currently playing audio

function setNoise(noiseName, noiseVolume) {
    console.log(`Setting noise: ${noiseName}, Volume: ${noiseVolume}`);
    const noise = backGroundNoise[noiseName];

    if (currentAudio && currentAudio !== noise) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    if (noise) {
        currentAudio = noise;
        currentAudio.loop = true;
        currentAudio.volume = noiseVolume;
        currentAudio.play();
    } else {
        currentAudio = null;
    }
}

document.getElementById('musicV').addEventListener('input', (e) => {
    const volume = parseFloat(e.target.value);
    if (currentAudio) {
        currentAudio.volume = volume;
        console.log(`Background noise volume updated to ${volume}`);
    }
});

document.getElementById('soundV').addEventListener('input', (e) => {
    const volume = parseFloat(e.target.value);
    Object.values(soundEffects).forEach(effect => {
        if (effect) {
            effect.volume = volume;
            console.log(`${effect.id} volume updated to ${volume}`);
        }
    });
});

function setTheme(themeName, gridToggle, flickeringToggle) {
    const theme = themes[themeName];
    const root = document.documentElement;
    const background = document.getElementsByTagName("BODY")[0]; // Access the first element

    const flickerables = document.querySelector(".flickerable");

    if (flickeringToggle === "true" || flickeringToggle === true) {
        flickerables.classList.add("flicker")
    } else if (flickeringToggle === "false" || flickeringToggle === false) {
        flickerables.classList.remove("flicker")
    }

    window.alert(flickeringToggle)


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
    const selectedMode = document.getElementById('mode').value;
    const playerOneName = document.getElementById('changeNameOfP1').value;
    const playerTwoName = document.getElementById('changeNameOfP2').value;
    const limit = document.getElementById('changeLimit').value;
    const selectedTheme = document.getElementById('themesS').value;
    const selectedNoise = document.getElementById('musicS').value;
    const selectedNoiseVolume = parseFloat(document.getElementById('musicV').value);
    const selectedSoundVolume = parseFloat(document.getElementById('soundV').value);
    const soundEffectsToggle = document.getElementById('soundT');
    const particalsToggle = document.getElementById("particalsT")
    const backGroundGridT = document.getElementById('backGroundGridT');
    const displayflickering = document.getElementById("displayflickering")

    console.log(`Noise Volume: ${selectedNoiseVolume}, Sound Volume: ${selectedSoundVolume}`);

    Object.values(soundEffects).forEach(effect => {
        if (effect) {
            effect.volume = selectedSoundVolume;
            console.log(`Updated ${effect.id} volume to ${selectedSoundVolume}`);
        }
    });

    // Update background noise volume

    // Save the selected settings to localStorage
    localStorage.setItem('selectedMode', selectedMode);
    localStorage.setItem('playerOneName', playerOneName);
    localStorage.setItem('playerTwoName', playerTwoName);
    localStorage.setItem('limit', limit);
    localStorage.setItem('selectedTheme', selectedTheme);
    localStorage.setItem('selectedNoise', selectedNoise);
    localStorage.setItem('selectedNoiseVolume', selectedNoiseVolume);
    localStorage.setItem('selectedSoundVolume', selectedSoundVolume);
    localStorage.setItem('soundEffectsToggle', soundEffectsToggle.checked);
    localStorage.setItem('backGroundGridT', backGroundGridT.checked);
    localStorage.setItem('particalsT', particalsT.checked);
    localStorage.setItem('displayflickering', displayflickering)

    // Apply the theme and noise
    setTheme(selectedTheme, backGroundGridT.checked, displayflickering.checked);
    setNoise(selectedNoise, selectedNoiseVolume);
}
// Event listener for the Summit button to save and apply theme and noise
const summitButton = document.getElementById('summit');
summitButton.addEventListener('click', () => {
    handleThemeChange();

    transitionPage(settingsP, mainMenuP)
});


// Apply the theme and noise when the page is loaded (if saved in localStorage)
document.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('selectedMode') || "default"; // Default to "defaultMode"
    const savedNameOfP1 = localStorage.getItem('playerOneName') || "Player 1"; // Default to "Player 1"
    const savedNameOfP2 = localStorage.getItem('playerTwoName') || "Player 2"; // Default to "Player 2"
    const savedLimit = localStorage.getItem('limit') || 15; // Default to 10
    const savedTheme = localStorage.getItem('selectedTheme') || "green"; // Default to "green"
    const savedNoise = localStorage.getItem('selectedNoise') || "none"; // Default to "none"
    const savedNoiseVolume = localStorage.getItem('selectedNoiseVolume') || 1; // Default volume
    const savedSoundVolume = localStorage.getItem('selectedSoundVolume') || 1; // Default volume
    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle') === "true"; // Convert to boolean
    const backGroundGridT = localStorage.getItem('backGroundGridT') === "true"; // Convert to boolean
    const particalsT = localStorage.getItem('particalsT') === "true"; // Convert to boolean
    const displayflickering = localStorage.getItem('displayflickering') === "true";

    setTheme(savedTheme, backGroundGridT, displayflickering); // Apply saved theme
    document.getElementById('mode').value = savedMode; // Update dropdown
    document.getElementById('changeNameOfP1').value = savedNameOfP1; // Update input
    document.getElementById('changeNameOfP2').value = savedNameOfP2; // Update input
    document.getElementById('changeLimit').value = savedLimit; // Update input
    document.getElementById('themesS').value = savedTheme; // Update dropdown
    document.getElementById('backGroundGridT').checked = backGroundGridT; // Update toggle'
    document.getElementById('displayflickering').value = displayflickering
    document.getElementById('particalsT').checked = particalsT; // Update toggle
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

document.addEventListener("DOMContentLoaded", function () {
    // Get all toggle buttons and their respective option sections
    var toggles = [
        { button: ".gameOptionsDropBtn", section: ".gameSettingsOptions" },
        { button: ".soundOptionsDropBtn", section: ".soundSettingsOptions" },
        { button: ".themeOptionsDropBtn", section: ".themeSettingsOptions" },
        { button: ".accountOptionsDropBtn", section: ".accountSettingsOptions" },
    ];

    toggles.forEach(function (toggle) {
        var btn = document.querySelector(toggle.button);
        var sec = document.querySelector(toggle.section);

        if (btn && sec) {
            btn.addEventListener("click", function () {
                // Toggle the visibility of the section
                if (sec.style.display === "none" || sec.style.display === "") {
                    sec.style.display = "block";
                    btn.style.transform = "rotate(-90deg)"; // Rotate the button
                } else {
                    sec.style.display = "none";
                    btn.style.transform = "rotate(0deg)"; // Reset rotation
                }
            });

            // Initialize sections to be hidden by default
            sec.style.display = "none";
        }
    });
});

/**
 * Button Particle Effect - Arcade Style
 * Creates a burst of square particles from button edges when called
*/

// Main function to be called when you want the particle effect
function createButtonParticleEffect(button, result) {
    const particalsT = localStorage.getItem('particalsT');
    if (particalsT === 'true') {

        // Add the basic particle effect class
        button.classList.add('particle-effect');

        // Get button dimensions and position
        const rect = button.getBoundingClientRect();

        // Get theme colors from CSS variables for particles 
        const colors = [
            getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--hover-color').trim()
        ];

        // Create particles for better visual effect
        const numParticles = 8; // Good number for coverage

        // Create particles bursting from edges
        for (let i = 0; i < numParticles; i++) {
            createFlyingParticle(button, colors[i % colors.length], i, result);
        }

        // Remove the animation class after animation completes
        setTimeout(() => {
            button.classList.remove('particle-effect');
        }, 800);
    }
}

// Helper function to create individual particles
function createFlyingParticle(button, color, index, result) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const buttonRect = button.getBoundingClientRect();
    const buttonWidth = buttonRect.width;
    const buttonHeight = buttonRect.height;

    const size = 5 + Math.random() * 5;

    if (result) {
        // Normal square particle
        particle.style.width = `${size * 1.3}px`;
        particle.style.height = `${size * 1.3}px`;
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '0';
    } else {
        // X particle using text
        particle.textContent = 'x';
        particle.style.color = color;
        particle.style.backgroundColor = 'transparent';
        particle.style.fontWeight = 'normal';
        particle.style.fontSize = `${size * 4}px`;
        particle.style.display = 'flex';
        particle.style.alignItems = 'center';
        particle.style.justifyContent = 'center';
        particle.style.fontFamily = 'Jersey 25';
        particle.style.width = `${size * 1.2}px`;
        particle.style.height = `${size * 1.2}px`;
    }

    const edgePosition = index % 4;

    let startX, startY, tx, ty;

    switch (edgePosition) {
        case 0: // Top
            startX = Math.random() * buttonWidth;
            startY = 0;
            tx = (Math.random() - 0.5) * 150;
            ty = -100 - Math.random() * 50;
            break;
        case 1: // Right
            startX = buttonWidth;
            startY = Math.random() * buttonHeight;
            tx = 100 + Math.random() * 50;
            ty = (Math.random() - 0.5) * 150;
            break;
        case 2: // Bottom
            startX = Math.random() * buttonWidth;
            startY = buttonHeight;
            tx = (Math.random() - 0.5) * 150;
            ty = 100 + Math.random() * 50;
            break;
        case 3: // Left
            startX = 0;
            startY = Math.random() * buttonHeight;
            tx = -100 - Math.random() * 50;
            ty = (Math.random() - 0.5) * 150;
            break;
    }

    particle.style.position = 'absolute';
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;
    particle.style.transform = 'none';

    const rotation = Math.random() * 180;

    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.setProperty('--rotation', `${rotation}deg`);

    particle.style.animation = `particleFly 1.8s ease-out forwards`;

    button.appendChild(particle);

    setTimeout(() => {
        if (particle.parentNode === button) {
            button.removeChild(particle);
        }
    }, 800);
}

const signInAndLoginP = document.querySelector(".signInAndLoginP");
const leaderBoardP = document.querySelector(".leaderBoardP");
const settingsP = document.querySelector(".settingsP");
const statsP = document.querySelector(".statsP")
const modeSelectP = document.querySelector(".modeSelectP");
const soloP = document.querySelector(".soloP");
const soloZenP = document.querySelector(".soloZenP");
const multiplayerP = document.querySelector(".multiplayerP");
const scoreEl = document.querySelector(".score");
const highScoreEl = document.querySelector(".highScore");
const display = document.querySelector(".display");
const displayZen = document.querySelector(".displayZen");
const playerOneDisplay = document.querySelector(".playerOneDisplay");
const playerTwoDisplay = document.querySelector(".playerTwoDisplay");
const Phr = document.querySelector(".Phr");
const playerOneMassageContainer = document.querySelector(".playerOneMassageContainer");
const playerTwoMassageContainer = document.querySelector(".playerTwoMassageContainer");
const messageZenContainerEl = document.querySelector(".massageContainerZen")
const messageEl = document.querySelector(".massage");
const messageZenEl = document.querySelector(".massageZen");
const probEl = document.querySelector(".prob");
const probElZen = document.querySelector(".probZen");
const playerOneProb = document.querySelector(".playerOneProb")
const playerTwoProb = document.querySelector(".playerTwoProb")
const op1 = document.querySelector(".op1");
const op2 = document.querySelector(".op2");
const op3 = document.querySelector(".op3");
const op4 = document.querySelector(".op4");
const op1Zen = document.querySelector(".op1Zen");
const op2Zen = document.querySelector(".op2Zen");
const op3Zen = document.querySelector(".op3Zen");
const op4Zen = document.querySelector(".op4Zen");
const timerEl = document.querySelector(".timer")
const playerOneOp1 = document.querySelector(".playerOneOp1");
const playerOneOp2 = document.querySelector(".playerOneOp2");
const playerOneOp3 = document.querySelector(".playerOneOp3");
const playerOneScore = document.querySelector(".playerOneScore");
const playerTwoOp1 = document.querySelector(".playerTwoOp1");
const playerTwoOp2 = document.querySelector(".playerTwoOp2");
const playerTwoOp3 = document.querySelector(".playerTwoOp3");
const playerTwoScore = document.querySelector(".playerTwoScore");
const backConfirmationModal = document.getElementById('backConfirmationModal');
const loseConfirmationModal = document.getElementById('loseConfirmationModal');
const winConfirmationModal = document.getElementById('winConfirmationModal');
const winer = document.querySelector("#winer");
const confirmYes = document.querySelector("#confirmYes");
const confirmNo = document.querySelector("#confirmNo");
const tryAgainBtn = document.querySelector("#tryAgainBtn");
const MainMenuBtn = document.querySelector("#MainMenuBtn");
const playAgainBtn = document.querySelector("#PlayAgainBtn");
const quitBtn = document.querySelector("#quitBtn");
const scoreMessage = document.querySelector("#scoreMessage");
const correctEq = document.getElementById("correct-eq")
let specialColor
let specialColorForP1
let specialColorForP2
let tempPrimary
let randomNum1, randomNum2, randomNum3, wrongAns1, wrongAns2, wrongAns3, ans, ran, problem;
let anssList = [];
let oneScore = 0
let twoScore = 0
let score = 0;
let levelProgress
let percent
let timer = 0;
let max, min;
let sign = "+";
let secondSign = "+";
let gotHighScore = false;
function startCountdownF(mode) {
    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle')
    let startCountdown
    if (mode === "solo") {
        startCountdown = document.querySelector(".startCountdownForSolo")
    } else {
        startCountdown = document.querySelector(".startCountdownForMultiplayer")
    }
    startCountdown.style.display = "flex";
    if (soundEffectsToggle == "true") {
        soundEffects.beep.play();
    }
    startCountdown.innerHTML = "3..."

    setTimeout(() => {
        startCountdown.innerHTML = "2.."
    }, 1000);
    setTimeout(() => {
        startCountdown.innerHTML = "1."
    }, 2000);
    setTimeout(() => {
        startCountdown.innerHTML = "START!!!"
    }, 3000);
    setTimeout(() => {
        startCountdown.style.display = "none";
    }, 4000)

    timer = 30
}


function generateRandomNumbers(sign, gameMode) {
    if (score < 10) { // Level 1 - Very Easy
        min = 1;
        max = (sign === "X" || sign === "/") ? 3 : 10;
    }
    else if (score < 20) { // Level 2 - Easy
        min = 1;
        max = (sign === "X" || sign === "/") ? 5 : 15;
    }
    else if (score < 30 || gameMode !== "solo") { // Level 3 - Normal
        min = (sign === "X" || sign === "/") ? 2 : 5;
        max = (sign === "X" || sign === "/") ? 8 : 25;
    }
    else if (score < 40) { // Level 4 - Hard
        min = (sign === "X" || sign === "/") ? 3 : 8;
        max = (sign === "X" || sign === "/") ? 10 : 30;
    }
    else if (score < 50) { // Level 5 - Very Hard
        min = (sign === "X" || sign === "/") ? 4 : 10;
        max = (sign === "X" || sign === "/") ? 12 : 40;
    }
    else if (score < 60) { // Level 6 - Extreme
        if (sign === "X" || sign === "/") {
            min = 5;
            max = 15;
        } else if (sign === "^" || sign === "√") {
            min = 2;
            max = 5;
        } else {
            min = 10;
            max = 50;
        }
    }
    else if (score < 70) { // Level 7 - Insane
        if (sign === "X" || sign === "/") {
            min = 6;
            max = 18;
        } else if (sign === "^" || sign === "√") {
            min = 2;
            max = 6;
        } else {
            min = 15;
            max = 60;
        }
    }
    else if (score < 80) { // Level 8 - Nightmare
        if (sign === "X" || sign === "/") {
            min = 7;
            max = 20;
        } else if (sign === "^" || sign === "√") {
            min = 2;
            max = 7;
        } else {
            min = 20;
            max = 70;
        }
    }
    else if (score < 90) { // Level 9 - Impossible
        if (sign === "X" || sign === "/") {
            min = 8;
            max = 22;
        } else if (sign === "^" || sign === "√") {
            min = 3;
            max = 8;
        } else {
            min = 25;
            max = 80;
        }
    }
    else { // Level 10 - Beyond Human
        if (sign === "X" || sign === "/") {
            min = 9;
            max = 25;
        } else if (sign === "^" || sign === "√") {
            min = 3;
            max = 9;
        } else {
            min = 30;
            max = 90;
        }
    }

    return Math.floor(Math.random() * (max - min + 1) + min);

}

let timerInterval;

let isPaused = false; // Track whether the game is paused

function pauseGame() {
    if (!isPaused) {
        stopTimer(); // Stop the timer
        isPaused = true;
        console.log("Game paused");
    }
}

function resumeGame() {
    if (isPaused) {
        startTimer(); // Restart the timer
        isPaused = false;
        console.log("Game resumed");
    }
}
const levelEl = document.getElementById('level')

function startTheSoloGame() {
    let difficulty = "default";
    let mode = document.getElementById("mode").value;
    if (score < 10) {
        levelEl.innerHTML = "Level: 1"; // Very Easy
    } else if (score < 20) {
        levelEl.innerHTML = "Level: 2"; // Easy
    } else if (score < 30) {
        levelEl.innerHTML = "Level: 3"; // Normal
    } else if (score < 40) {
        levelEl.innerHTML = "Level: 4"; // Hard
    } else if (score < 50) {
        levelEl.innerHTML = "Level: 5"; // Very Hard
    } else if (score < 60) {
        levelEl.innerHTML = "Level: 6"; // Extreme
    } else if (score < 70) {
        levelEl.innerHTML = "Level: 7"; // Insane
    } else if (score < 80) {
        levelEl.innerHTML = "Level: 8"; // Nightmare
    } else if (score < 90) {
        levelEl.innerHTML = "Level: 9"; // Impossible
    } else {
        levelEl.innerHTML = "Level: 10"; // Beyond Human
    }
    if (score < 100) {
        if (score > 0 && score % 10 == 0) {
            document.querySelector('.massageContainer').style.setProperty('--progress', "115%");
            setTimeout(() => {
                const levelProgress = (score % 10);
                const percent = (levelProgress * 10) + "%";
                document.querySelector('.massageContainer').style.setProperty('--progress', percent);
            }, 1000);
        } else {
            const levelProgress = (score % 10);
            const percent = (levelProgress * 10) + "%";
            document.querySelector('.massageContainer').style.setProperty('--progress', percent);
        }
    } else {
        document.querySelector('.massageContainer').style.setProperty('--progress', "115%");
    }



    const tempPrimary = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    document.documentElement.style.setProperty('--special-color', tempPrimary);

    if (score % 10 === 0 && score !== 0 && score < 101) {
        levelEl.style.fontSize = "clamp(2rem, 2.8vw, 4rem)"
        messageEl.textContent = ("!!NEW LEVEL!!")
        setTimeout(() => {
            levelEl.style.fontSize = "clamp(1.5rem, 2.2vw, 3rem)"
        }, 1000)
    }

    // Determine the operation sign based on mode and score
    if (mode === "default") {
        if (score <= 10) {
            sign = "+";
        } else if (score > 10 && score <= 20) {
            sign = ["+", "-"][Math.floor(Math.random() * 2)];
        } else if (score > 20 && score <= 30) {
            sign = ["+", "-", "X", "/"][Math.floor(Math.random() * 4)];
        } else if (score > 30 && score <= 40) {
            sign = ["+", "-", "X", "X", "/", "/", "^"][Math.floor(Math.random() * 7)];
        } else if (score > 40 && score <= 50) {
            sign = ["+", "-", "X", "X", "/", "/", "^", "√"][Math.floor(Math.random() * 8)];
        } else if (score > 50) {
            sign = ["+", "-", "X", "X", "/", "/", "^", "√"][Math.floor(Math.random() * 8)];
            secondSign = ["+", "-"][Math.floor(Math.random() * 2)];
        }
    } else {
        sign = mode === "add" ? "+" : mode === "sub" ? "-" : mode === "mul" ? "X" : "/";
        if (mode === "add") {
            secondSign = "+";
        } else if (mode === "sub") {
            secondSign = "-";
        } else if (mode === "mul") {
            secondSign = ["+", "-"][Math.floor(Math.random() * 2)];
        }
    }

    // Generate random numbers based on the selected sign
    randomNum1 = generateRandomNumbers(sign, 'solo');
    randomNum2 = generateRandomNumbers(sign, 'solo');
    randomNum3 = generateRandomNumbers(secondSign);

    // Calculate the correct answer based on the operation
    switch (sign) {
        case "+":
            ans = randomNum1 + randomNum2;
            break;
        case "-":
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
            if (randomNum2 === 0) randomNum2 = 1;
            randomNum1 = generateRandomNumbers(sign, 'solo') * randomNum2;
            ans = randomNum1 / randomNum2;
            break;
        case "^":
            ans = Math.pow(randomNum1, 2);
            break;
        case "√":
            randomNum1 = Math.pow(Math.floor(Math.random() * 6 + 1), 2);
            ans = Math.sqrt(randomNum1);
            break;
    }

    // Handle additional operations for extreme difficulty or high scores
    if (difficulty === "default" && score > 50 || difficulty === "extreme") {
        switch (secondSign) {
            case "+":
                ans = ans + randomNum3;
                break;
            case "-":
                ans = ans - randomNum3;
                break;
        }
    }

    // Generate wrong answers within an error range
    let errorRange = 5;
    let wrongAns1 = ans + Math.floor(Math.random() * errorRange + 1);
    let wrongAns2 = ans - Math.floor(Math.random() * errorRange + 1);
    let wrongAns3 = ans + Math.floor(Math.random() * (errorRange / 2) + 1);

    // Ensure all wrong answers are unique and different from the correct answer
    while (new Set([ans, wrongAns1, wrongAns2, wrongAns3]).size !== 4) {
        wrongAns1 = ans + Math.floor(Math.random() * errorRange + 1);
        wrongAns2 = ans - Math.floor(Math.random() * errorRange + 1);
        wrongAns3 = ans + Math.floor(Math.random() * (errorRange / 2) + 1);
    }

    // Display the problem
    if (sign === "√") {
        problem = `√${randomNum1}  `;
    } else if (sign === "^") {
        let power = `<span>2</span>`;
        problem = `${randomNum1} ${power} `;
    } else {
        problem = `${randomNum1} ${sign} ${randomNum2} `;
    }

    if (difficulty === "extreme" || (difficulty === "default" && score > 50)) {
        problem += `${secondSign} ${randomNum3} = `;
    } else {
        problem += "= ";
    }

    // Shuffle the answer options
    anssList = [ans, wrongAns1, wrongAns2, wrongAns3].sort(() => Math.random() - 0.5);

    // Update the UI with the problem and answer options
    op1.textContent = anssList[0];
    op2.textContent = anssList[1];
    op3.textContent = anssList[2];
    op4.textContent = anssList[3];
    probEl.innerHTML = problem;

    // Update the score display
    scoreEl.textContent = `Score: ${score}`;

    // Fetch and display the high score if the user is logged in
    if (auth.currentUser) {
        const userRef = ref(database, 'users/' + auth.currentUser.uid + '/scores/' + mode);
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const highScore = snapshot.val();
                highScoreEl.textContent = `Highest: ${highScore}`;
            } else {
                highScoreEl.textContent = "High Score: Not available";
            }
        }).catch((error) => {
            console.error("Error fetching data:", error);
        });
    } else {
        highScoreEl.textContent = `Highest: ${JSON.parse(localStorage.getItem("highScore"))[mode]}`;
    }
}
[op1, op2, op3, op4].forEach(btn => btn.addEventListener("click", (event) => checkAnswer(event, Number(btn.textContent))));

function checkAnswer(event, selectedAns) {
    if (selectedAns === ans) {
        win();
        incrementUserValue("total");
        // Call the particle effect function only when answer is correct
        createButtonParticleEffect(event.target, true);

        messageEl.textContent = "Correct!";
    } else {
        createButtonParticleEffect(event.target, false);
        lose();
        probEl.textContent = `WRONG!!!!`;
        messageEl.textContent = "Wrong!";
    }

    // Add appropriate classes to buttons
    [op1, op2, op3, op4].forEach(btn => {
        if (Number(btn.textContent) === ans) {
            btn.classList.add("buttonW");
        } else {
            btn.classList.add("buttonL");
        }
    });

    // Remove classes after 1 second
    setTimeout(() => {
        [op1, op2, op3, op4].forEach(btn => {
            btn.classList.remove("buttonW");
            btn.classList.remove("buttonL");
        });
    }, 1000);
}


function startTimer() {
    // Clear any existing timer interval
    if (timerInterval) clearInterval(timerInterval);

    // Update the timer display immediately
    updateTimerDisplay();

    // Start the countdown
    timerInterval = setInterval(() => {
        timer--;
        updateTimerDisplay();

        // End the game if the timer reaches 0
        if (timer <= 0) {
            clearInterval(timerInterval);
            lose();
            probEl.textContent = `TIMES UP!!!!`
            messageEl.textContent = "Times Up";
        }
    }, 1000);
}
function updateTimerDisplay() {
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');
    timerEl.textContent = `${minutes}:${seconds}`;

    // Add animation when time is 5 seconds or less
    if (timer <= 5) {
        timerEl.style.color = "rgba(255, 0, 0, 0.5)";
        timerEl.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        timerEl.style.border = "5px solid rgba(255, 0, 0, 0.5)";
        timerEl.style.boxShadow = "clamp(5px, 0.5vw, 20px) clamp(7px, 0.75vw, 20px) rgba(255, 0, 0, 0.2)";
        timerEl.style.animation = "pulse 0.5s infinite alternate";
    } else {
        timerEl.style.color = "";
        timerEl.style.backgroundColor = "";
        timerEl.style.border = "";
        timerEl.style.boxShadow = "";
        timerEl.style.animation = "";
    }
}

// Add this CSS to your styles
const style = document.createElement('style');
style.textContent = `
@keyframes pulse {
    from { transform: scale(1); opacity: 1; }
    to { transform: scale(1.01); opacity: 0.7; }
    }
    `;
document.head.appendChild(style);

function win() {
    timer += 5;
    updateTimerDisplay();
    startTimer(); // Start the countdown

    const animationContainer = document.getElementById('mainPlayerScoreAnimationContainer');
    const animationContainerForTimer = document.getElementById("timerAnimationContainer")
    const minusOne = document.createElement('div');
    const minusOneForTimer = document.createElement('div')
    minusOne.textContent = '+1';
    minusOneForTimer.textContent = "+5"
    minusOne.className = 'score-animation';
    minusOneForTimer.className = 'score-animation';

    // Position the animation near the score
    animationContainer.style.position = 'relative';
    animationContainerForTimer.style.position = 'relative';
    minusOne.style.left = `${80}px`;
    minusOne.style.top = `${-20}px`;
    minusOneForTimer.style.left = `${20}px`

    animationContainer.appendChild(minusOne);
    animationContainerForTimer.appendChild(minusOneForTimer);

    // Remove the animation element after 1s
    setTimeout(() => {
        minusOne.remove();
        minusOneForTimer.remove()
    }, 500);
    score = score + 1;
    let difficulty = "default"
    let mode = document.getElementById("mode").value;
    messageEl.textContent = "Correct!";
    probEl.innerHTML += ans; // Display the correct answer
    probEl.classList.add("correct-animation"); // Add animation class
    let key = `${mode}`;
    if (auth.currentUser) {
        const userRef = ref(database, 'users/' + auth.currentUser.uid + '/scores/' + key);
        get(userRef).then((snapshot) => {
            // Get the stored score (default to 0 if it doesn't exist)
            const storedScore = snapshot.exists() ? snapshot.val() : 0;
            if (score > storedScore) {
                incrementUserValue(key);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    setTimeout(() => {
        probEl.classList.remove("correct-animation"); // Remove the animation class after 1 second
        probEl.innerHTML = ""; // Clear the problem text
        probEl.textContent = `CORRECT!!!!`; // Reset problem text
        if (auth.currentUser) {
            const userRef = ref(database, 'users/' + auth.currentUser.uid + '/scores/' + key);
            get(userRef).then((snapshot) => {
                // Get the stored score (default to 0 if it doesn't exist)
                const storedScore = snapshot.exists() ? snapshot.val() : 0;

                if (score > storedScore) {
                    if (gotHighScore === false) {
                        messageEl.textContent = "!!NEW HIGH SCORE!!";
                        if (localStorage.getItem('soundEffectsToggle') === "true") {
                            soundEffects.highScore.play();
                        }
                        gotHighScore = true;
                    }
                }
            }).catch((error) => {
                console.error(error);
            });
        } else {

            if (score > JSON.parse(localStorage.getItem("highScore"))[key]) {
                incrementUserValue(key)
                if (gotHighScore === false) {
                    messageEl.textContent = "!!NEW HIGH SCORE!!";
                    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle');
                    if (soundEffectsToggle === "true") {
                        soundEffects.highScore.play();
                    }
                    gotHighScore = true;
                }
            }
        }
        scoreEl.textContent = `Score: ${score}`;
        startTheSoloGame(); // Start the next round
    }, 500); // Delay for 1 second

    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle');
    if (soundEffectsToggle === 'true' && (score < highsetScore[key] + 1 || gotHighScore === true)) {
        soundEffects.correct.play(); // Play the correct answer sound
    }
    scoreEl.textContent = `Score: ${score}`;
}
function lose() {
    if (timerInterval) clearInterval(timerInterval);

    // 1. Store current primary color in a temp variable

    // 2. Define and apply the special red color

    // 3. Normal lose sequence
    scoreMessage.textContent = `Your score is: ${score}`;
    score = 0;
    scoreEl.textContent = `Score: ${score}`;
    display.classList.add("displayL");
    probEl.classList.add("probL");
    levelEl.classList.add("lLevel");
    correctEq.textContent = `The correct answer is: ${ans}`;
    specialColor = "#B2002D";
    tempPrimary = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    setTimeout(() => {
        document.documentElement.style.setProperty('--special-color', specialColor);
    }, 100)
    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle');
    if (soundEffectsToggle === 'true') {
        soundEffects.wrong.play();
    }

    setTimeout(() => {
        display.classList.remove("displayL");

        probEl.classList.remove("probL");
        messageEl.classList.remove("messageL");
        levelEl.classList.remove("lLevel");
        timerEl.style.color = "";
        timerEl.style.backgroundColor = "";
        timerEl.style.border = "";
        timerEl.style.boxShadow = "";
        timerEl.style.animation = "";

        // 4. Restore the original primary color after delay

        setTimeout(() => {
            document.documentElement.style.setProperty('--special-color', tempPrimary);
        }, 100)
        setTimeout(() => {
            loseConfirmationModal.style.display = 'flex';
        }, 100);
    }, 1000);
}

function startTheMultiplayerGame() {
    sign = ["+", "-", "X", "/", "+", "X"][Math.floor(Math.random() * 6)];
    let difficulty = "normal"
    let mode = "mix"
    randomNum1 = generateRandomNumbers(sign, 'multi')
    randomNum2 = generateRandomNumbers(sign, 'multi')
    let limit = document.getElementById("changeLimit").value
    const P1percent = (((oneScore / limit) * 100)) + "%";
    const P2percent = (((twoScore / limit) * 100)) + "%";
    document.querySelector('.playerOneMassageContainer').style.setProperty('--p1Progress', P1percent);
    document.querySelector('.playerTwoMassageContainer').style.setProperty('--p2Progress', P2percent);
    const tempPrimary = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    document.documentElement.style.setProperty('--special-color-for-p1', tempPrimary);
    document.documentElement.style.setProperty('--special-color-for-p2', tempPrimary);
    switch (sign) {
        case "+":
            ans = randomNum1 + randomNum2;
            break;
        case "-":
            // Ensure subtraction doesn't result in negative numbers for easier difficulties
            while (randomNum1 < randomNum2) {
                randomNum1 = generateRandomNumbers(sign, 'multi')
                randomNum2 = generateRandomNumbers(sign, 'multi')
            }
            ans = randomNum1 - randomNum2;
            break;
        case "X":
            ans = randomNum1 * randomNum2;
            break;
        case "/":
            // Ensure division results in whole numbers
            if (randomNum2 === 0) randomNum2 = 1;
            randomNum1 = generateRandomNumbers(sign, 'multi') * randomNum2;
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
    let errorRange = 3

    let wrongAns1 = ans + Math.floor(Math.random() * errorRange + 1);
    let wrongAns2 = ans - Math.floor(Math.random() * errorRange + 1);

    // Ensure all wrong answers are unique and different from the correct answer
    while (new Set([ans, wrongAns1, wrongAns2, wrongAns3]).size !== 4) {
        wrongAns1 = ans + Math.floor(Math.random() * errorRange + 1);
        wrongAns2 = ans - Math.floor(Math.random() * errorRange + 1);
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
    problem += "= ";


    anssList = [ans, wrongAns1, wrongAns2].sort(() => Math.random() - 0.5);

    playerOneOp1.textContent = anssList[0];
    playerOneOp2.textContent = anssList[1];
    playerOneOp3.textContent = anssList[2];
    playerTwoOp1.textContent = anssList[0];
    playerTwoOp2.textContent = anssList[1];
    playerTwoOp3.textContent = anssList[2];
    playerOneScore.textContent = `Score: ${oneScore}`;
    playerTwoScore.textContent = `Score: ${twoScore}`;
    playerOneProb.innerHTML = problem
    playerTwoProb.innerHTML = problem

}

[playerOneOp1, playerOneOp2, playerOneOp3].forEach(btn =>
    btn.addEventListener("click", event => {
        [playerOneOp1, playerOneOp2, playerOneOp3, playerTwoOp1, playerTwoOp2, playerTwoOp3].forEach(b => b.disabled = true);
        checkAnswerForP1(event, Number(btn.textContent));
        setTimeout(() => {
            [playerOneOp1, playerOneOp2, playerOneOp3, playerTwoOp1, playerTwoOp2, playerTwoOp3].forEach(b => b.disabled = false);
        }, 1000);
    })
);

function checkAnswerForP1(event, selectedAns) {
    if (selectedAns === ans) {
        P1Win();
        createButtonParticleEffect(event.target, true);
    } else {
        P1Lose();
        createButtonParticleEffect(event.target, false);
    }
}

[playerTwoOp1, playerTwoOp2, playerTwoOp3].forEach(btn =>
    btn.addEventListener("click", event => {
        [playerOneOp1, playerOneOp2, playerOneOp3, playerTwoOp1, playerTwoOp3, playerTwoOp3].forEach(b => b.disabled = true);
        checkAnswerForP2(event, Number(btn.textContent));
        setTimeout(() => {
            [playerOneOp1, playerOneOp2, playerOneOp3, playerTwoOp1, playerTwoOp2, playerTwoOp3].forEach(b => b.disabled = false);
        }, 1000);
    })
);

function checkAnswerForP2(event, selectedAns) {
    if (selectedAns === ans) {
        P2Win();
        createButtonParticleEffect(event.target, true);
    } else {
        P2Lose();
        createButtonParticleEffect(event.target, false);
    }
}



function P1Win() {
    const animationContainer = document.getElementById('playerOneScoreAnimationContainer');
    const minusOne = document.createElement('div');
    minusOne.textContent = '+1';
    minusOne.className = 'score-animation';

    // Position the animation near the score
    const playerScoreRect = playerOneScore.getBoundingClientRect();
    animationContainer.style.position = 'relative';
    minusOne.style.left = `${playerScoreRect.width / 10}px`;

    animationContainer.appendChild(minusOne);

    // Remove the animation element after 1s
    setTimeout(() => {
        minusOne.remove();
        oneScore += 1;
        playerOneScore.innerHTML = `Score: ${oneScore}`;
    }, 250);
    playerOneScore.innerHTML = `Score: ${oneScore}`;
    playerTwoProb.innerHTML += ans;
    playerOneProb.innerHTML += ans;
    playerTwoProb.classList.add("correct-animation")
    playerOneProb.classList.add("correct-animation");
    setTimeout(() => {
        playerOneProb.classList.remove("correct-animation");
        playerTwoProb.classList.remove("correct-animation")
    }, 250); // Delay for 1 second


    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle');
    if (soundEffectsToggle === 'true') {
        soundEffects.correct.play(); // Play the correct answer sound
    }
    if (oneScore >= document.getElementById("changeLimit").value - 1) {
        document.querySelector('.playerOneMassageContainer').style.setProperty('--p1Progress', "100%");
        blinkText(playerOneProb, 'WON!');
        blinkText(playerTwoProb, 'LOST!');
        winer.innerHTML = `${document.getElementById("changeNameOfP1").value} Won!`
        playerTwoDisplay.classList.add("displayL");
        specialColorForP2 = "#B2002D";
        tempPrimary = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        setTimeout(() => {
            document.documentElement.style.setProperty('--special-color-for-p2', specialColorForP2);
        }, 100)
        incrementUserValue("playerOneWon")
        incrementUserValue("playerOneScores")
    } else {
        setTimeout(() => {
            incrementUserValue("playerOneScores")
            startTheMultiplayerGame();
        }, 250); // Delay for 1 second
    }



    // Start the next game only after the problem text is correctly updated
}

function blinkText(element, text) {
    let blinkCount = 0;
    const interval = setInterval(() => {
        element.innerHTML = (blinkCount % 2 === 0) ? text : '';  // Alternate between showing the text and an empty string
        blinkCount++;

        if (blinkCount >= 8) {  // 3 blinks (6 changes: 3 times text, 3 times empty)
            clearInterval(interval);

            // Show the modal after blinking is done
            if (element === playerTwoProb) {
                winConfirmationModal.style.display = "flex";
            }
        }
    }, 250);  // Change visibility every 500ms
    playerOneDisplay.classList.remove("displayL");
    playerTwoDisplay.classList.remove("displayL");
    playerOneProb.classList.remove("probL");
    playerTwoProb.classList.remove("probL")


}
function P2Win() {
    const animationContainer = document.getElementById('playerTwoScoreAnimationContainer');
    const minusOne = document.createElement('div');
    minusOne.textContent = '+1';
    minusOne.className = 'score-animation';

    // Position the animation near the score
    const playerScoreRect = playerOneScore.getBoundingClientRect();
    animationContainer.style.position = 'relative';
    minusOne.style.left = `${playerScoreRect.width / 10}px`;

    animationContainer.appendChild(minusOne);

    // Remove the animation element after 1s
    setTimeout(() => {
        minusOne.remove();
        twoScore += 1;
        playerTwoScore.innerHTML = `Score: ${twoScore}`;
    }, 250);
    playerTwoScore.innerHTML = `Score: ${twoScore}`;
    playerOneProb.innerHTML += ans;
    playerTwoProb.innerHTML += ans;
    playerOneProb.classList.add("correct-animation");
    playerTwoProb.classList.add("correct-animation");

    setTimeout(() => {
        playerOneProb.classList.remove("correct-animation");
        playerTwoProb.classList.remove("correct-animation");
    }, 250); // Delay for 1 second


    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle');
    if (soundEffectsToggle === 'true') {
        soundEffects.correct.play(); // Play the correct answer sound
    }

    if (twoScore >= document.getElementById("changeLimit").value - 1) {
        document.querySelector('.playerTwoMassageContainer').style.setProperty('--p2Progress', "100%");
        blinkText(playerOneProb, 'LOST!');
        blinkText(playerTwoProb, 'WON!');
        winer.innerHTML = `${document.getElementById("changeNameOfP2").value} Won!`
        playerOneDisplay.classList.add("displayL");
        specialColorForP1 = "#B2002D";
        tempPrimary = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        setTimeout(() => {
            document.documentElement.style.setProperty('--special-color-for-p1', specialColorForP1);
        }, 100)
        incrementUserValue("playerTwoWon")
        incrementUserValue("playerTwoScores")
    } else {
        setTimeout(() => {
            incrementUserValue("playerTwoScores")
            startTheMultiplayerGame();
        }, 250); // Delay for 1.5 seconds to give time for the reset
    }
}

function P1Lose() {
    playerOneDisplay.classList.add("displayL");
    playerOneProb.classList.add("probL");

    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle');
    if (soundEffectsToggle === 'true') {
        soundEffects.wrong.play();
    }
    specialColorForP1 = "#B2002D";
    tempPrimary = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    setTimeout(() => {
        document.documentElement.style.setProperty('--special-color-for-p1', specialColorForP1);
    }, 100)

    // Add the '-1' animation
    if (oneScore >= 1) {
        const P1animationContainer = document.getElementById('playerOneScoreAnimationContainer');
        const minusOne = document.createElement('div');
        minusOne.textContent = '-1';
        minusOne.className = 'score-animation';
        minusOne.style.color = 'red'

        // Position the animation near the score
        const playerScoreRect = playerOneScore.getBoundingClientRect();
        P1animationContainer.style.position = 'relat ive';
        minusOne.style.left = `${playerScoreRect.width / 10}px`;

        P1animationContainer.appendChild(minusOne);

        // Remove the animation element after 1s
        setTimeout(() => {
            minusOne.remove();
            oneScore -= 1;
            playerOneScore.innerHTML = `Score: ${oneScore}`;
        }, 1000);
    }

    setTimeout(() => {
        playerOneDisplay.classList.remove("displayL");
        playerOneProb.classList.remove("probL");

        startTheMultiplayerGame();
        setTimeout(() => {
            document.documentElement.style.setProperty('--special-color-for-p1', tempPrimary);
        }, 100)
    }, 1000);

}

function P2Lose() {
    playerTwoDisplay.classList.add("displayL");
    playerTwoProb.classList.add("probL");

    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle');
    if (soundEffectsToggle === 'true') {
        soundEffects.wrong.play();
    }
    specialColorForP2 = "#B2002D";
    tempPrimary = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    setTimeout(() => {
        document.documentElement.style.setProperty('--special-color-for-p2', specialColorForP2);
    }, 100)
    // Add the '-1' animation
    if (twoScore >= 1) {
        const P2animationContainer = document.getElementById('playerTwoScoreAnimationContainer');
        const minusOne = document.createElement('div');
        minusOne.textContent = '-1';
        minusOne.className = 'score-animation';
        minusOne.style.color = 'red'


        // Position the animation near the score
        const playerScoreRect = playerTwoScore.getBoundingClientRect();
        P2animationContainer.style.position = 'relative';
        minusOne.style.left = `${playerScoreRect.width / 10}px`;

        P2animationContainer.appendChild(minusOne);

        // Remove the animation element after 1s
        setTimeout(() => {
            minusOne.remove();
            twoScore -= 1;
            playerTwoScore.innerHTML = `Score: ${twoScore}`;
        }, 1000);
    }

    setTimeout(() => {
        playerTwoDisplay.classList.remove("displayL");
        playerTwoProb.classList.remove("probL");

        startTheMultiplayerGame();
        setTimeout(() => {
            document.documentElement.style.setProperty('--special-color-for-p2', tempPrimary);
        }, 100)
    }, 1000);
}

function startSleepyCatAnimation(targetElement) {
    const sleepFrames = [
        "/ᐠ - ˕ -マ",
        "/ᐠ -ࡇ- マ ᶻ ",
        "/ᐠ - ˕ -マ ᶻ 𝗓",
        "/ᐠ -ࡇ- マ ᶻ 𝗓 𐰁"
    ];

    const awakeFrames = [
        "/ᐠ > ˕ <マ",
        "/ᐠ •̀ ˕ •́ マ",
        "/ᐠ •̀ ˕ •́ マ stop it"
    ];

    const happyFrame = "/ᐠ > ˕ <マ ₊˚⊹♡";
    const sadFrame = "/ᐠ ╥﹏╥マ";

    // Clean up any existing animation
    if (targetElement._catAnimation) {
        clearInterval(targetElement._catAnimation.intervalId);
        targetElement.removeEventListener('mouseenter', targetElement._catAnimation.wakeUp);
        targetElement.removeEventListener('mouseleave', targetElement._catAnimation.startSleeping);
    }

    let currentFrame = 0;
    let intervalId;
    let isAwake = false;

    const animate = (frames) => {
        targetElement.textContent = frames[currentFrame % frames.length];
        currentFrame++;
    };

    const startSleeping = () => {
        isAwake = false;
        currentFrame = 0;
        clearInterval(intervalId);
        intervalId = setInterval(() => animate(sleepFrames), 1200);
        animate(sleepFrames);
        targetElement._catAnimation.intervalId = intervalId;
    };

    const wakeUp = () => {
        if (!isAwake) {
            isAwake = true;
            currentFrame = 0;
            clearInterval(intervalId);

            intervalId = setInterval(() => {
                if (currentFrame < awakeFrames.length) {
                    targetElement.textContent = awakeFrames[currentFrame];
                    currentFrame++;
                } else {
                    clearInterval(intervalId); // stay angry
                }
            }, 3000);

            targetElement.textContent = awakeFrames[currentFrame];
            currentFrame++;
            targetElement._catAnimation.intervalId = intervalId;
        }
    };


    const happy = () => {
        clearInterval(intervalId);
        targetElement.textContent = happyFrame;
    };

    const sad = () => {
        clearInterval(intervalId);
        targetElement.textContent = sadFrame;
    };

    // Store references so they can be used externally
    targetElement._catAnimation = {
        intervalId,
        wakeUp,
        startSleeping,
        happy,
        sad
    };

    targetElement.addEventListener('mouseenter', wakeUp);
    targetElement.addEventListener('mouseleave', startSleeping);

    startSleeping();
}

function startTheSoloZenGame() {
    setTimeout(() => {
        messageZenEl._catAnimation.startSleeping();
    }, 1000)


    sign = ["+", "-", "X", "/"][Math.floor(Math.random() * 4)]

    score = 20
    // Generate random numbers based on the selected sign
    randomNum1 = generateRandomNumbers(sign, 'solo');
    randomNum2 = generateRandomNumbers(sign, 'solo');
    // Calculate the correct answer based on the operation
    switch (sign) {
        case "+":
            ans = randomNum1 + randomNum2;
            break;
        case "-":
            let temp = Math.max(randomNum1, randomNum2);
            randomNum2 = Math.min(randomNum1, randomNum2);
            randomNum1 = temp;
            ans = randomNum1 - randomNum2;
            break;
        case "X":
            ans = randomNum1 * randomNum2;
            break;
        case "/":
            if (randomNum2 === 0) randomNum2 = 1;
            randomNum1 = generateRandomNumbers(sign, 'solo') * randomNum2;
            ans = randomNum1 / randomNum2;
            break;
    }


    // Generate wrong answers within an error range
    let errorRange = 5;
    let wrongAns1 = ans + Math.floor(Math.random() * errorRange + 1);
    let wrongAns2 = ans - Math.floor(Math.random() * errorRange + 1);
    let wrongAns3 = ans + Math.floor(Math.random() * (errorRange / 2) + 1);

    // Ensure all wrong answers are unique and different from the correct answer
    while (new Set([ans, wrongAns1, wrongAns2, wrongAns3]).size !== 4) {
        wrongAns1 = ans + Math.floor(Math.random() * errorRange + 1);
        wrongAns2 = ans - Math.floor(Math.random() * errorRange + 1);
        wrongAns3 = ans + Math.floor(Math.random() * (errorRange / 2) + 1);
    }

    // Shuffle the answer options
    anssList = [ans, wrongAns1, wrongAns2, wrongAns3].sort(() => Math.random() - 0.5);
    problem = `${randomNum1} ${sign} ${randomNum2} = `;
    // Update the UI with the problem and answer options
    op1Zen.textContent = anssList[0];
    op2Zen.textContent = anssList[1];
    op3Zen.textContent = anssList[2];
    op4Zen.textContent = anssList[3];
    probElZen.innerHTML = problem;
}

[op1Zen, op2Zen, op3Zen, op4Zen].forEach(btn => btn.addEventListener("click", (event) => checkAnswerForZen(event, Number(btn.textContent))));

function checkAnswerForZen(event, selectedAns) {
    if (selectedAns === ans) {
        createButtonParticleEffect(event.target, true);
        winZen();
        probElZen.innerHTML += ans; // Display the correct answer
        messageZenEl.textContent = "/ᐠ > ˕ <マ ₊˚⊹♡";
    } else {
        createButtonParticleEffect(event.target, false);
        loseZen();
        messageZenEl.textContent = "/ᐠ ╥﹏╥マ";
    }

    // Add approprZeniate classes to buttons
    [op1Zen, op2Zen, op3Zen, op4Zen].forEach(btn => {
        if (Number(btn.textContent) === ans) {
            btn.classList.add("buttonW");
        } else {
            btn.classList.add("buttonL");
        }
    });

    // Remove classes after 1 second
    setTimeout(() => {
        [op1Zen, op2Zen, op3Zen, op4Zen].forEach(btn => {
            btn.classList.remove("buttonW");
            btn.classList.remove("buttonL");
        });
    }, 1000);
}

function winZen() {
    let difficulty = "default"
    let mode = document.getElementById("mode").value;
    messageZenEl._catAnimation.happy();
    probElZen.classList.add("correct-animation"); // Add animation class
    setTimeout(() => {
        probElZen.classList.remove("correct-animation"); // Remove the animation class after 1 second
        probElZen.innerHTML = ""; // Clear the problem text
        probElZen.textContent = `CORRECT!!!!`; // Reset problem text
        startTheSoloZenGame(); // Start the next round
    }, 500); // Delay for 1 second

    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle');
    if (soundEffectsToggle === 'true' && (score < highsetScore[key] + 1 || gotHighScore === true)) {
        soundEffects.correct.play(); // Play the correct answer sound
    }
}
function loseZen() {
    messageZenEl._catAnimation.sad();
    displayZen.classList.add("displayL");
    probElZen.classList.add("probL");
    messageZenContainerEl.classList.add("messageL");
    const soundEffectsToggle = localStorage.getItem('soundEffectsToggle');
    if (soundEffectsToggle === 'true') {
        soundEffects.wrong.play();
    }

    setTimeout(() => {
        displayZen.classList.remove("displayL");
        probEl.classList.remove("probL");
        messageZenContainerEl.classList.remove("messageL");
    }, 1000);
}

function back() {
    backConfirmationModal.style.display = 'flex';
    pauseGame();
}

function home() {
    transitionPage(leaderBoardP, mainMenuP);
}

function homeForStats() {
    transitionPage(statsP, mainMenuP);
}

function multiplayerHome() {
    transitionPage(multiplayerP, mainMenuP);
    oneScore = 0;
    twoScore = 0;
    playerOneScore.textContent = "";
    playerTwoScore.textContent = "";
    playerOneProb.innerHTML = "";
    playerTwoProb.innerHTML = "";
    playerOneDisplay.classList.remove("displayL");
    playerTwoDisplay.classList.remove("displayL");


}

confirmYes.addEventListener('click', () => {
    transitionPage(soloP, mainMenuP);
    backConfirmationModal.style.display = 'none';
    score = 0;
    scoreEl.textContent = `Score: ${score}`;
    messageEl.textContent = "";
    timerEl.innerHTML = '00:30';
    if (timerInterval) clearInterval(timerInterval);
});

backZenBtn.addEventListener('click', () => {
    transitionPage(soloZenP, mainMenuP);
    score = 0
    setTimeout(() => {
        messageZenEl._catAnimation.sad();
    }, 1000)
});

confirmNo.addEventListener('click', () => {
    backConfirmationModal.style.display = 'none';
    resumeGame();
});

tryAgainBtn.addEventListener('click', () => {
    loseConfirmationModal.style.display = 'none';
    messageEl.textContent = "Start";
    startCountdownF("solo");
    startTheSoloGame();
    timerEl.innerHTML = '00:30';
});

playAgainBtn.addEventListener("click", () => {
    winConfirmationModal.style.display = 'none';
    messageEl.textContent = "Start";
    oneScore = 0;
    twoScore = 0;
    playerOneScore.textContent = "";
    playerTwoScore.textContent = "";
    playerOneProb.innerHTML = "";
    playerTwoProb.innerHTML = "";
    playerOneDisplay.classList.remove("displayL");
    playerTwoDisplay.classList.remove("displayL");


    startCountdownF("multiplayer");
    startTheMultiplayerGame();
});

quitBtn.addEventListener("click", () => {
    multiplayerHome();
});

MainMenuBtn.addEventListener('click', () => {
    transitionPage(soloP, mainMenuP);
    loseConfirmationModal.style.display = 'none';
});
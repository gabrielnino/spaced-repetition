let clearCount = 0;
let timerInterval;
let waitIntervals = [60, 300, 900, 3600];
let currentInterval = 0;
let targetPhrase = "";
let mode = "withoutWait"; // Default mode
let clockInterval;
let elapsedSeconds = 0;

// Normalize string by removing accents, punctuation, and converting to lowercase
function normalizeString(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/['’]/g, "")
        .toLowerCase();
}

// Start the waiting timer
function startWaitTimer() {
    if (mode === "withoutWait") {
        document.getElementById("timer").textContent = "No wait mode.";
        document.getElementById("myTextbox").focus();
        return;
    }

    clearInterval(timerInterval);
    let timeRemaining = waitIntervals[currentInterval];
    document.getElementById("timer").textContent = `Wait time: ${timeRemaining} seconds.`;
    document.getElementById("myTextbox").disabled = true;
    document.getElementById("overlay").style.display = "flex";

    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById("timer").textContent = `Wait time: ${timeRemaining} seconds.`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            document.getElementById("myTextbox").disabled = false;
            document.getElementById("overlay").style.display = "none";
            document.getElementById("myTextbox").focus();
            currentInterval = (currentInterval + 1) % waitIntervals.length;
        }
    }, 1000);
}

// Check and clear the input if it matches the target phrase
function checkAndClear() {
    const textbox = document.getElementById("myTextbox");
    const inputValue = normalizeString(textbox.value.trim());
    const normalizedPhrase = normalizeString(targetPhrase);

    if (inputValue === normalizedPhrase) {
        textbox.value = "";
        clearCount++;
        document.getElementById("counter").textContent = `Text cleared ${clearCount} times.`;
        checkAndHighlight();
        startWaitTimer();
    } else {
        textbox.focus();
    }
}

// Set the phrase to memorize
function setPhrase() {
    const phraseInput = document.getElementById("phraseInput").value.trim();
    if (phraseInput !== "") {
        targetPhrase = phraseInput;
        document.getElementById("phraseSection").style.display = "none";
        document.getElementById("memorySection").style.display = "block";
        document.getElementById("myTextbox").disabled = false;
        document.getElementById("myTextbox").focus();
        resetClock();
        checkAndHighlight();
        startWaitTimer();
    } else {
        alert("Please enter a valid phrase.");
        document.getElementById("phraseInput").focus();
    }
}

// Reset the entire process
function reset() {
    clearCount = 0;
    currentInterval = 0;
    targetPhrase = "";
    mode = "withoutWait";
    clearInterval(timerInterval);

    document.getElementById("phraseInput").value = "";
    document.getElementById("myTextbox").value = "";
    document.getElementById("counter").textContent = "Text cleared 0 times.";
    document.getElementById("timer").textContent = "No wait mode.";
    document.getElementById("phraseSection").style.display = "block";
    document.getElementById("memorySection").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("phraseInput").focus();
}

// Function to handle the Enter key press event
function handleEnterKeyPress(event) {
    if (event.key === "Enter") {
        if (document.getElementById("phraseSection").style.display !== "none") {
            // If in phrase input section, trigger the setPhrase function
            setPhrase();
        } else if (document.getElementById("memorySection").style.display !== "none") {
            // If in memorization section, check the input
            checkAndClear();
        }
    }
}

// Clock-related functions
function startClock() {
    clearInterval(clockInterval);
    clockInterval = setInterval(() => {
        elapsedSeconds++;
        const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
        const seconds = String(elapsedSeconds % 60).padStart(2, '0');
        document.getElementById("clock").textContent = `Time: ${minutes}:${seconds}`;
    }, 1000);
}

function resetClock() {
    clearInterval(clockInterval);
    elapsedSeconds = 0;
    document.getElementById("clock").textContent = "Time: 00:00";
}

// Highlight the differences between input and target phrase
function highlightDifferences(input, target) {
    const inputWords = input.split(' ');
    const targetWords = target.split(' ');
    let highlightedPhrase = '';

    for (let i = 0; i < Math.max(inputWords.length, targetWords.length); i++) {
        if (inputWords[i] === targetWords[i]) {
            highlightedPhrase += `<span style="background-color: green; color: white;">${inputWords[i] || ''}</span> `;
        } else if (!inputWords[i] && targetWords[i]) {
            highlightedPhrase += `<span style="background-color: yellow;">______</span> `;
        } else {
            highlightedPhrase += `<span style="background-color: red; color: white;">${inputWords[i] || ''}</span> `;
        }
    }

    return highlightedPhrase;
}

// Toggle the visibility of the phraseHiddenDisplay based on the checkbox
function togglePhraseVisibility() {
    const checkbox = document.getElementById("showPhraseCheckbox");
    const phraseHiddenDisplay = document.getElementById("phraseHiddenDisplay");

    if (checkbox.checked) {
        // Show the phraseHiddenDisplay when the checkbox is checked
        phraseHiddenDisplay.style.display = "block";
    } else {
        // Return to the default behavior when unchecked
        phraseHiddenDisplay.style.display = "none";
    }
}

// Update the display with highlighted phrase differences
function checkAndHighlight() {
    const textbox = document.getElementById("myTextbox");
    const inputValue = textbox.value.trim();
    const highlightedPhrase = highlightDifferences(inputValue, targetPhrase);
    document.getElementById("phraseHiddenDisplay").innerHTML = highlightedPhrase;

    const normalizedInput = normalizeString(inputValue);
    const normalizedPhrase = normalizeString(targetPhrase);

    if (normalizedInput === normalizedPhrase) {
        textbox.value = "";
        clearCount++;
        document.getElementById("counter").textContent = `Text cleared ${clearCount} times.`;
        resetClock();
        startWaitTimer();
    } else if (elapsedSeconds === 0) {
        startClock();
    }

    togglePhraseVisibility();
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (document.body.classList.contains("dark-mode")) {
        darkModeToggle.textContent = "Switch to Light Mode";
    } else {
        darkModeToggle.textContent = "Switch to Dark Mode";
    }
}

// Event listeners
document.addEventListener("keydown", handleEnterKeyPress);

// On page load
window.onload = function() {
    document.getElementById("phraseInput").focus();
    document.body.classList.add("dark-mode"); // Dark mode as default
    document.getElementById("darkModeToggle").textContent = "Switch to Light Mode";
};

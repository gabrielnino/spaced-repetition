let clearCount = 0;
let timerInterval;
let waitIntervals = [60, 300, 900, 3600];
let currentInterval = 0;
let targetPhrase = "";
let mode = "withoutWait"; // Default mode set to without waiting intervals

let clockInterval;
let elapsedSeconds = 0;

function normalizeString(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/['’]/g, "")
        .toLowerCase();
}

function startWaitTimer() {
    if (mode === "withoutWait") {
        // If mode is without wait, do not start the timer
        document.getElementById("timer").textContent = "No wait mode.";
        document.getElementById("myTextbox").focus(); // Focus the textbox
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
            document.getElementById("myTextbox").focus(); // Focus the textbox
            currentInterval = (currentInterval + 1) % waitIntervals.length;
        }
    }, 1000);
}

function checkAndClear() {
    const textbox = document.getElementById("myTextbox");
    const inputValue = normalizeString(textbox.value.trim());
    const normalizedPhrase = normalizeString(targetPhrase);

    if (inputValue === normalizedPhrase) {
        textbox.value = "";
        clearCount++;
        document.getElementById("counter").textContent = `Text cleared ${clearCount} times.`;
        startWaitTimer();
    } else {
        textbox.focus(); // Focus the textbox
    }
}

function setPhrase() {
    const phraseInput = document.getElementById("phraseInput").value.trim();
    if (phraseInput !== "") {
        targetPhrase = phraseInput;
        document.getElementById("phraseSection").style.display = "none";
        document.getElementById("memorySection").style.display = "block";
        document.getElementById("myTextbox").disabled = false;
        document.getElementById("myTextbox").focus(); // Focus the textbox
        resetClock(); // Reset the clock when starting
        checkAndHighlight(); // Initial call to display the phrase
        startWaitTimer();
    } else {
        alert("Please enter a valid phrase.");
        document.getElementById("phraseInput").focus(); // Focus the phrase input textbox
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    // Update the toggle button text based on the current mode
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (document.body.classList.contains("dark-mode")) {
        darkModeToggle.textContent = "Switch to Light Mode";
    } else {
        darkModeToggle.textContent = "Switch to Dark Mode";
    }
}

function toggleMode() {
    const modeToggle = document.getElementById("modeToggle");
    if (mode === "withWait") {
        mode = "withoutWait";
        modeToggle.textContent = "Switch to Wait Mode";
        document.getElementById("timer").textContent = "No wait mode.";
        clearInterval(timerInterval); // Stop any ongoing timer
        document.getElementById("myTextbox").disabled = false;
        document.getElementById("overlay").style.display = "none";
        document.getElementById("myTextbox").focus(); // Focus the textbox
    } else {
        mode = "withWait";
        modeToggle.textContent = "Switch to No Wait Mode";
        startWaitTimer();
    }
}

function reset() {
    clearCount = 0;
    currentInterval = 0;
    targetPhrase = "";
    mode = "withoutWait"; // Reset to default no wait mode
    clearInterval(timerInterval);

    document.getElementById("phraseInput").value = "";
    document.getElementById("myTextbox").value = "";
    document.getElementById("counter").textContent = "Text cleared 0 times.";
    document.getElementById("timer").textContent = "No wait mode.";
    document.getElementById("phraseSection").style.display = "block";
    document.getElementById("memorySection").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.getElementById("modeToggle").textContent = "Switch to Wait Mode";
    document.getElementById("phraseInput").focus(); // Focus the phrase input textbox
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

// Add event listener for keydown to the whole document
document.addEventListener("keydown", handleEnterKeyPress);
// Attach the input event listener to the textbox for real-time feedback
document.getElementById("myTextbox").addEventListener("input", checkAndHighlight);

// Set dark mode as default on page load
window.onload = function() {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeToggle").textContent = "Switch to Light Mode";
    // Set mode toggle button to reflect default "No Wait" mode
    document.getElementById("modeToggle").textContent = "Switch to Wait Mode";
    document.getElementById("timer").textContent = "No wait mode.";
    document.getElementById("phraseInput").focus(); // Focus the phrase input textbox on load
    updateIntervalDisplay(); // Display the initial intervals
}

// Function to set custom wait intervals
function setCustomIntervals() {
    const intervalInput = document.getElementById("intervalInput").value.trim();
    if (intervalInput !== "") {
        const newIntervals = intervalInput.split(',').map(val => parseInt(val.trim())).filter(val => !isNaN(val) && val > 0);
        if (newIntervals.length > 0) {
            waitIntervals = newIntervals;
            currentInterval = 0; // Reset the current interval index
            updateIntervalDisplay(); // Update the interval display
            alert(`Custom intervals set to: ${waitIntervals.join(', ')} seconds.`);
            document.getElementById("phraseInput").focus(); // Focus the phrase input textbox
        } else {
            alert("Please enter valid intervals separated by commas.");
        }
    } else {
        alert("Please enter valid intervals.");
    }
}

// Function to update the display of current intervals
function updateIntervalDisplay() {
    document.getElementById("currentIntervals").textContent = `Current intervals: ${waitIntervals.join(', ')} seconds`;
}

function startClock() {
    clearInterval(clockInterval); // Clear any previous intervals
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

function checkAndHighlight() {
    const textbox = document.getElementById("myTextbox");
    const inputValue = textbox.value.trim();
    const highlightedPhrase = highlightDifferences(inputValue, targetPhrase);
    document.getElementById("phraseHiddenDisplay").innerHTML = highlightedPhrase;

    const normalizedInput = normalizeString(inputValue);
    const normalizedPhrase = normalizeString(targetPhrase);

    if (normalizedInput === normalizedPhrase) {
        // If input matches the target phrase, reset the text, counter, and clock
        textbox.value = "";
        clearCount++;
        document.getElementById("counter").textContent = `Text cleared ${clearCount} times.`;
        resetClock(); // Reset the clock when the phrase is correct
        startWaitTimer();
    } else if (elapsedSeconds === 0) {
        // Start the clock only if it hasn't started already
        startClock();
    }
}
function goToStep(stepNumber) {
    if (stepNumber === 1) {
        document.getElementById("step1Content").style.display = "block";
        document.getElementById("step2Content").style.display = "none";
        document.getElementById("step1").classList.add("active");
        document.getElementById("step2").classList.remove("active");
    } else if (stepNumber === 2) {
        document.getElementById("step1Content").style.display = "none";
        document.getElementById("step2Content").style.display = "block";
        document.getElementById("step1").classList.remove("active");
        document.getElementById("step2").classList.add("active");
    }
}

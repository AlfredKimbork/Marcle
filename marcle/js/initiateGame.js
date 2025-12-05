import { activeKeyboard, activeKeyboardFinger, keyboardBtns, createBoard } from "./wordleLogic.js";
import { marcBtn, speedBtn, marcThinking, checkMarcGuess, askMarc } from "./marcAI.js";
import { modeToggle } from "./switchMode.js";
document.addEventListener("keyup", activeKeyboard);
keyboardBtns.forEach(keyboardBtn => {
    keyboardBtn.addEventListener("click", activeKeyboardFinger);
});
// create the playing board
createBoard();
// marcs speed 
export let thinkingDelay = 10;
export let writingDelay = 100;
let currentSpeed = localStorage.getItem("marcSpeed");
if (!currentSpeed)
    localStorage.setItem("marcSpeed", "1x");
export const setMarcSpeed = () => {
    switch (currentSpeed) {
        case "1x":
            speedBtn.innerHTML = "1x";
            thinkingDelay = 10;
            writingDelay = 100;
            break;
        case "5x":
            speedBtn.innerHTML = "5x";
            thinkingDelay = 2;
            writingDelay = 20;
            break;
        case "10x":
            speedBtn.innerHTML = "10x";
            thinkingDelay = 1;
            writingDelay = 10;
            break;
        default:
            break;
    }
};
setMarcSpeed();
speedBtn.addEventListener("click", () => {
    currentSpeed = localStorage.getItem("marcSpeed");
    speedBtn.classList.add("check");
    setTimeout(() => {
        speedBtn.classList.remove("check");
    }, 500);
    switch (currentSpeed) {
        case "1x":
            speedBtn.innerHTML = "5x";
            thinkingDelay = 2;
            writingDelay = 20;
            localStorage.setItem("marcSpeed", "5x");
            break;
        case "5x":
            speedBtn.innerHTML = "10x";
            thinkingDelay = 1;
            writingDelay = 10;
            localStorage.setItem("marcSpeed", "10x");
            break;
        case "10x":
            speedBtn.innerHTML = "1x";
            thinkingDelay = 10;
            writingDelay = 100;
            localStorage.setItem("marcSpeed", "1x");
            break;
        default:
            break;
    }
});
// activate marc
export let marcActive = false;
if (localStorage.getItem("marc") == "true") {
    marcActive = true;
    marcBtn.classList.add("pressed");
    checkMarcGuess();
    localStorage.setItem("marc", "true");
    document.removeEventListener("keyup", activeKeyboard);
    keyboardBtns.forEach(keyboardBtn => {
        keyboardBtn.removeEventListener("click", activeKeyboardFinger);
    });
}
marcBtn.addEventListener("click", () => {
    if (!marcBtn.classList.contains("pressed")) {
        marcActive = true;
        marcBtn.classList.add("pressed");
        checkMarcGuess();
        localStorage.setItem("marc", "true");
        document.removeEventListener("keyup", activeKeyboard);
        keyboardBtns.forEach(keyboardBtn => {
            keyboardBtn.removeEventListener("click", activeKeyboardFinger);
        });
    }
    else {
        marcActive = false;
        marcBtn.classList.remove("pressed");
        clearTimeout(marcThinking);
        localStorage.setItem("marc", "false");
        document.addEventListener("keyup", activeKeyboard);
        keyboardBtns.forEach(keyboardBtn => {
            keyboardBtn.addEventListener("click", activeKeyboardFinger);
        });
        marcBtn.classList.remove("pressed");
    }
});
// ask marc
askMarc.addEventListener("click", () => {
    askMarc.classList.add("check");
    setTimeout(() => {
        askMarc.classList.remove("check");
    }, 500);
    thinkingDelay = 2;
    writingDelay = 20;
    checkMarcGuess();
});
// setup light/dark mode toggle
modeToggle();

import { getWord } from "./possibleWords/words.js";
const wordleBody = document.querySelector("#wordle-wrapper");
const keyboardBtns = document.querySelectorAll(".keyboard-btn");
let currentCell;
let column = 0;
let row = 0;
let word = getWord();
console.log(word);
const addLocation = (cell) => {
    cell.classList.add(`row-${row}`);
    cell.classList.add(`column-${column}`);
    column++;
};
const moveMarked = () => {
    currentCell.classList.remove("current");
    let markedColumn = column;
    if (column == 5) {
        markedColumn = 4;
    }
    if (column < 0)
        column = 0;
    currentCell = document.querySelector(`.row-${row}.column-${markedColumn}`);
    currentCell.classList.add("current");
};
const addLetter = (e) => {
    if (column == 5)
        column = 4;
    currentCell = document.querySelector(`.row-${row}.column-${column}`);
    currentCell.innerText = e;
    column++;
};
const deleteLetter = () => {
    column--;
    if (column < 0)
        column = 0;
    let currentCell = document.querySelector(`.row-${row}.column-${column}`);
    currentCell.innerText = "";
};
const checkWord = () => {
    let guessedLetters = document.querySelectorAll(`.row-${row}`);
    let guessedWord = "";
    let missingLetters = word;
    let j = 0;
    let amountDeleted = 0;
    guessedLetters.forEach(guessedLetter => {
        guessedWord += guessedLetter.innerText;
    });
    guessedLetters.forEach((guessedLetter, i) => {
        if (guessedLetter.innerText == word[i]) {
            guessedLetter.classList.add("green");
            keyboardBtns.forEach(btn => {
                // console.log(btn.id, `Key${guessedLetter.innerText.toLocaleUpperCase()}`)
                if (btn.id == `Key${guessedLetter.innerText.toLocaleUpperCase()}`)
                    btn.classList.add("green");
            });
            missingLetters = missingLetters.replace(guessedWord[j - amountDeleted], "");
            guessedWord = guessedWord.replace(guessedWord[j - amountDeleted], "");
            amountDeleted++;
            j++;
        }
    });
    j = 0;
    guessedLetters.forEach((guessedLetter) => {
        if (missingLetters.includes(guessedLetter.innerText)) {
            missingLetters = missingLetters.replace(guessedWord[j - amountDeleted], "");
            guessedWord = guessedWord.replace(guessedWord[j - amountDeleted], "");
            guessedLetter.classList.add("yellow");
            keyboardBtns.forEach(btn => {
                if (btn.id == `Key${guessedLetter.innerText.toLocaleUpperCase()}`)
                    btn.classList.add("yellow");
            });
            amountDeleted++;
            j++;
        }
        else {
            guessedLetter.classList.add("grey");
            keyboardBtns.forEach(btn => {
                if (btn.id == `Key${guessedLetter.innerText.toLocaleUpperCase()}`)
                    btn.classList.add("grey");
            });
        }
    });
    row++;
    column = 0;
};
for (let i = 0; i < 30; i++) {
    let cell = document.createElement("span");
    cell.classList.add("cell");
    if (column < 5) {
        addLocation(cell);
    }
    else {
        column = 0;
        row++;
        addLocation(cell);
    }
    wordleBody.append(cell);
}
column = 0;
row = 0;
currentCell = document.querySelector(`.row-${row}.column-${column}`);
currentCell.classList.add("current");
document.addEventListener("keyup", (e) => {
    if ("KeyA" <= e.code && e.code <= "KeyZ")
        addLetter(e.key);
    if ("Backspace" == e.code)
        deleteLetter();
    if ("Enter" == e.code && column == 5)
        checkWord();
    moveMarked();
});
keyboardBtns.forEach(keyboardBtn => {
    keyboardBtn.addEventListener("click", (e) => {
        let clickedBtn = e.target;
        let selectedLetter = clickedBtn.id;
        if ("KeyA" <= selectedLetter && selectedLetter <= "KeyZ")
            addLetter(selectedLetter.slice(3).toLowerCase());
        if ("backspace" == selectedLetter)
            deleteLetter();
        if ("enter" == selectedLetter && column == 5)
            checkWord();
        moveMarked();
    });
});
// const alphabets = [...Array(26).keys()].map((n) => String.fromCharCode(97 + n));
// console.log(alphabets);

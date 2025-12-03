import { getWord, possibleWords } from "./possibleWords/words.js";
// import { createMarc } from "./marcAI.js";
const wordleBody = document.querySelector("#wordle-wrapper") as HTMLDivElement;
const keyboardBtns = document.querySelectorAll(".keyboard-btn") as NodeListOf<HTMLButtonElement>;
let currentCell: HTMLSpanElement
let column = 0;
let row = 0;
export const word = getWord();
console.log(word, possibleWords.indexOf(word))

export let yellows: string[] = [];
export let greens: {"letter":string, "position": number}[] = [];
export let greys: {"letter":string, "position": number}[] = [];

const addLocation = (cell: HTMLSpanElement) => {
    cell.classList.add(`row-${row}`);
    cell.classList.add(`column-${column}`);
    column++;
}

export const moveMarked = () => {
    currentCell.classList.remove("current");
    let markedColumn = column

    if(column == 5) {markedColumn = 4}
    if(column < 0) column = 0;

    currentCell = document.querySelector(`.row-${row}.column-${markedColumn}`) as HTMLSpanElement;
    currentCell.classList.add("current");
}

export const addLetter = (e: string) => {
    if(column == 5) column = 4
    
    currentCell = document.querySelector(`.row-${row}.column-${column}`) as HTMLSpanElement;
    currentCell.innerText = e;

    keyboardBtns.forEach(btn => {
        if (btn.id == `Key${e.toLocaleUpperCase()}`) btn.classList.add("check");
        setTimeout(() => {
            btn.classList.remove("check");
        }, 500)
    })
    
    column++;
}

const deleteLetter = () => {
    column--;
    if(column < 0) column = 0;

    let currentCell = document.querySelector(`.row-${row}.column-${column}`) as HTMLSpanElement;
    currentCell.innerText = "";

    keyboardBtns.forEach(btn => {
        if (btn.id == "backspace") btn.classList.add("check");
        setTimeout(() => {
            btn.classList.remove("check");
        }, 500)
    })
} 
export const checkWord = () => {
    // yellows = []
    let guessedLetters = document.querySelectorAll(`.row-${row}`) as NodeListOf<HTMLSpanElement>;
    let guessedWord = "";
    let missingLetters = word;
    
    let j = 0;
    let amountDeleted = 0;

    guessedLetters.forEach(guessedLetter => {
        guessedWord += guessedLetter.innerText;
    })

    guessedLetters.forEach((guessedLetter, i) => {
        if (guessedLetter.innerText == word[i]) {
            guessedLetter.classList.add("green", "check");

                keyboardBtns.forEach(btn => {
                    if (btn.id == `Key${guessedLetter.innerText.toLocaleUpperCase()}`) btn.classList.add("green", "check");
                })
                
                missingLetters = missingLetters.replace(guessedWord[j - amountDeleted], "");
                guessedWord = guessedWord.replace(guessedWord[j - amountDeleted], "");
                greens.push({"letter": guessedLetter.innerText, "position": i})

                
                amountDeleted++;
                j++;
            } else if (missingLetters.includes(guessedLetter.innerText)) {
                guessedLetter.classList.add("yellow", "check");
                keyboardBtns.forEach(btn => {
                    if (btn.id == `Key${guessedLetter.innerText.toLocaleUpperCase()}`) btn.classList.add("yellow", "check");
                })
    
                missingLetters = missingLetters.replace(guessedWord[j - amountDeleted], " ");
                guessedWord = guessedWord.replace(guessedWord[j - amountDeleted], "");
    
                yellows.push(guessedLetter.innerText)
        
                j++
                amountDeleted++
            } else {
                guessedLetter.classList.add("grey", "check");
                keyboardBtns.forEach(btn => {
                    greys.push({"letter": guessedLetter.innerText, "position": i})
                    if (btn.id == `Key${guessedLetter.innerText.toLocaleUpperCase()}`) btn.classList.add("grey", "check");
                });
    
                j++
            }
            // {
            //     j++
            // }
        });

    // j = 0;
    // guessedLetters.forEach(guessedLetter => {
        
    //     if (missingLetters.includes(guessedLetter.innerText)) {
    //         guessedLetter.classList.add("yellow", "check");
    //         keyboardBtns.forEach(btn => {
    //             if (btn.id == `Key${guessedLetter.innerText.toLocaleUpperCase()}`) btn.classList.add("yellow", "check");
    //         })

    //         missingLetters = missingLetters.replace(guessedWord[j - amountDeleted], " ");
    //         guessedWord = guessedWord.replace(guessedWord[j - amountDeleted], "");

    //         yellows.push(guessedLetter.innerText)
    
    //         j++
    //         amountDeleted++
    //     } else {
    //         guessedLetter.classList.add("grey", "check");
    //         keyboardBtns.forEach(btn => {
    //             grey.push({"letter": guessedLetter.innerText, "position": i})
    //             if (btn.id == `Key${guessedLetter.innerText.toLocaleUpperCase()}`) btn.classList.add("grey", "check");
    //         });

    //         j++
    //     }
    // });

    keyboardBtns.forEach(btn => {
        if (btn.id == "enter") btn.classList.add("check");
        setTimeout(() => {
            btn.classList.remove("check");
        }, 500)
    })
    row++;
    column = 0;
}

for (let i = 0; i < 30 ; i++) {
    let cell = document.createElement("span");
    cell.classList.add("cell")
    if (column < 5) {
        addLocation(cell)
    } else {
        column = 0;
        row++
        addLocation(cell)
    }
    wordleBody.append(cell);
}
column = 0;
row = 0;

currentCell = document.querySelector(`.row-${row}.column-${column}`) as HTMLSpanElement;
currentCell.classList.add("current")

document.addEventListener("keyup", (e: KeyboardEvent) => {
    if("KeyA" <= e.code && e.code <= "KeyZ") addLetter(e.key);
    if ("Backspace" == e.code) deleteLetter();
    if ("Enter" == e.code && column == 5) checkWord();

    moveMarked()
})

keyboardBtns.forEach(keyboardBtn => {
    keyboardBtn.addEventListener("click", (e: MouseEvent) => {
        let clickedBtn = e.target as HTMLButtonElement;
        let selectedLetter = clickedBtn.id;

        if("KeyA" <= selectedLetter && selectedLetter <= "KeyZ") addLetter(selectedLetter.slice(3).toLowerCase());
        if ("backspace" == selectedLetter) deleteLetter();
        if ("enter" == selectedLetter && column == 5) checkWord();

        moveMarked()
    })
})

// const alphabets = [...Array(26).keys()].map((n) => String.fromCharCode(97 + n));
// console.log(alphabets);
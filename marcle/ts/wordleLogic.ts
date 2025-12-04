import { marcActive } from "./initiateGame.js";
import { getWord } from "./possibleWords/words.js";
export const keyboardBtns = document.querySelectorAll(".keyboard") as NodeListOf<HTMLButtonElement>;
let currentCell: HTMLSpanElement | undefined
let column = 0;
export let gameStatus: string
export let row = 0;

// create playing board
    const wordleBody = document.querySelector("#wordle-wrapper") as HTMLDivElement;

    export const createBoard = () => {
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
    }

    const addLocation = (cell: HTMLSpanElement) => {
        cell.classList.add(`row-${row}`);
        cell.classList.add(`column-${column}`);
        column++;
    }

// activate keyboard
    export const activeKeyboard = (e: KeyboardEvent) => {
        if("KeyA" <= e.code && e.code <= "KeyZ") addLetter(e.key);
        if ("Backspace" == e.code) deleteLetter();
        if ("Enter" == e.code && column == 5) checkWord();
        
        moveMarked()
    }

    export const activeKeyboardFinger = (e: MouseEvent) => {
        let clickedBtn = e.target as HTMLButtonElement;
        let selectedLetter = clickedBtn.id;
        
        if("KeyA" <= selectedLetter && selectedLetter <= "KeyZ") addLetter(selectedLetter.slice(3).toLowerCase());
        if ("backspace" == selectedLetter) deleteLetter();
        if ("enter" == selectedLetter && column == 5) checkWord();
        
        moveMarked()
}


// move marked cell
    export const moveMarked = () => {
        if (currentCell != undefined) {
            currentCell!.classList.remove("current");
            let markedColumn = column
            
            if(column == 5) {markedColumn = 4}
            if(column < 0) column = 0;
            
            currentCell = document.querySelector(`.row-${row}.column-${markedColumn}`) as HTMLSpanElement;
            currentCell.classList.add("current");
        }
    }

// add & delete letter 
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

// check written word
    const endscreen = document.querySelector("#endscreen") as HTMLDialogElement;
    export const word = getWord();
    export let greens: {"letter":string, "position": number}[] = [];
    export let yellows: string[] = [];
    export let greys: {"letter":string, "position": number}[] = [];

    export const checkWord = () => {
        let guessedLetters = document.querySelectorAll(`.row-${row}`) as NodeListOf<HTMLSpanElement>;
        let guessedWord = "";
        let missingLetters = word;
        
        let j = 0;
        let amountDeleted = 0;
        
        guessedLetters.forEach((guessedLetter, i) => {
            guessedWord += guessedLetter.innerText;
            
            if (guessedLetter.innerText == word[i]) {
                guessedLetter.classList.add("green", "check");
                setTimeout(() => {
                    guessedLetter.classList.remove("check");
                }, 500)
                
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
                setTimeout(() => {
                    guessedLetter.classList.remove("check");
                }, 500)
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
                setTimeout(() => {
                    guessedLetter.classList.remove("check");
                }, 500)
                keyboardBtns.forEach(btn => {
                    greys.push({"letter": guessedLetter.innerText, "position": i})
                    if (btn.id == `Key${guessedLetter.innerText.toLocaleUpperCase()}`) btn.classList.add("grey", "check");
                });
                
                j++
            }
        });
        
        keyboardBtns.forEach(btn => {
            if (btn.id == "enter") btn.classList.add("check");
            setTimeout(() => {
                btn.classList.remove("check");
            }, 500)
        })

        guessedLetters.forEach((guessedLetter) => {
            guessedWord += guessedLetter.innerText;
        });
        
        let winstreak: number
        if (guessedWord == word) {
            gameStatus = "won"

            localStorage.getItem("winstreak") ? winstreak = JSON.parse(localStorage.getItem("winstreak")!) + 1 
                : winstreak = 1
            localStorage.setItem("winstreak", JSON.stringify(winstreak));
            
            currentCell!.classList.remove("current");
            currentCell = undefined;


            document.removeEventListener("keyup", activeKeyboard)
            keyboardBtns.forEach(keyboardBtn => {
                keyboardBtn.removeEventListener("click", activeKeyboardFinger);
            });

            endscreen.innerHTML = `
                <h2>You got the word!</h2>
                <p>the word was <span class="bold">${word}</span>!</p>
                <p>you now have a winstreak of ${winstreak}</p>
            `
        } else if(row == 5) {
            gameStatus = "lost"

            localStorage.getItem("winstreak") ? winstreak = JSON.parse(localStorage.getItem("winstreak")!) 
                : winstreak = 0

            currentCell!.classList.remove("current");
            currentCell = undefined;

            document.removeEventListener("keyup", activeKeyboard)
            keyboardBtns.forEach(keyboardBtn => {
                keyboardBtn.removeEventListener("click", activeKeyboardFinger);
            });

            endscreen.innerHTML = `
                <h2>You didn't get the word!</h2>
                <p>the word was <span class="bold">${word}</span>!</p>
                <p>you had a winstreak of ${winstreak}</p>
            `

            winstreak = 0
            localStorage.setItem("winstreak", JSON.stringify(winstreak));
        } else{
            row++;
            column = 0;
        }

        const clearBoard = (nodes: NodeListOf<HTMLSpanElement>, nodeIndex: number) => {
            if (nodeIndex < nodes.length) {
                nodes[nodeIndex].classList.add("check");
                nodes[nodeIndex].classList.remove("green", "yellow", "grey");

                if (nodes[nodeIndex].classList.contains("cell")) nodes[nodeIndex].innerHTML = ""

                setTimeout(() => {
                    if (nodes[nodeIndex]) nodes[nodeIndex].classList.remove("green", "yellow", "grey");
                }, 500)
                nodeIndex++
                setTimeout(() => clearBoard(nodes, nodeIndex), 25)
            }
        }

        const resetGame = (resetBtn: HTMLButtonElement, clearBoard: Function) => {
            const cells = document.querySelectorAll(".cell") as NodeListOf<HTMLSpanElement>;
            let cellIndex = 0
            let keyboardBtnIndex = 0

            endscreen.setAttribute("style", "animation: slide-out ease-in-out .75s;");
            
            resetBtn.classList.add("check");
            setTimeout(() => {
                resetBtn.classList.remove("check");
                setTimeout(() => {
                    endscreen.close();
                    clearBoard(cells, cellIndex);
                    clearBoard(keyboardBtns, keyboardBtnIndex);
                    
                }, 250);
            }, 500);

            setTimeout(() => {
                window.location.reload()
            }, 2000);
            
        }

        if (gameStatus) {
            const resetBtn = document.createElement("button");
            resetBtn.classList.add("--btn");
            resetBtn.innerText = "Reset";

            resetBtn.addEventListener("click", () => {
                resetGame(resetBtn, clearBoard)
            });

            if(marcActive == true) setTimeout(() =>resetGame(resetBtn, clearBoard), 2500);

            endscreen.append(resetBtn);
            endscreen.showModal();
        }
    }

// win & loose con
    

// const alphabets = [...Array(26).keys()].map((n) => String.fromCharCode(97 + n));
// console.log(alphabets);
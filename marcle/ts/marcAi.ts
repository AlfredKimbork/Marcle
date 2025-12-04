import { possibleWords } from "./possibleWords/words.js";
import { addLetter, moveMarked, checkWord, yellows, greens, greys, word, row, gameStatus } from "./wordleLogic.js";
import { thinkingDelay, writingDelay, marcActive, setMarcSpeed } from "./initiateGame.js";
export const marcBtn = document.querySelector("#marc-btn") as HTMLButtonElement
export const speedBtn = document.querySelector("#speed-btn") as HTMLButtonElement
export const askMarc = document.querySelector("#ask-marc-btn") as HTMLButtonElement
let possibleGuesses = possibleWords

let i = 0;
let guessIndex: number;
let marcGuess: string;
export let marcThinking: number

const getGuess = () => {
        return possibleGuesses[Math.round(Math.random() * (possibleGuesses.length - 1))]
    }

const writeGuess = () => {
    const marcGuessedLetter = marcGuess[i];
    if (i < 5) {
        addLetter(marcGuessedLetter)
        moveMarked()
        setTimeout(() => writeGuess(), writingDelay * 10)

        i++
    } else if (marcActive) {
        checkWord()
        moveMarked()
        i = 0
        
        if(!gameStatus) {
            marcThinking = setTimeout(() => checkMarcGuess(), thinkingDelay * 100);
        } 
        // else {
        //     setTimeout(() => window.location.reload(), 1000)
        // }
    } else {
        i = 0
        setMarcSpeed()
    }
}

export const checkMarcGuess = () => {
    marcGuess = getGuess()
    guessIndex = possibleGuesses.indexOf(marcGuess);
    possibleGuesses.splice(guessIndex, 1)

    if (greens.length > 0) checkGreens()
    else if (yellows.length > 0 && greens.length <= 0) checkYellows()
    else {
        writeGuess()
    };
}

const checkGreens = () => {
    let valid = 0
    for (let j = 0; j < greens.length; j++) {
        if (greens[j].letter == marcGuess[greens[j].position]) {
            valid++
            if(valid == greens.length) {
                if (yellows.length > 0) checkYellows()
                else {
                    writeGuess()
                }
            }
        } else {
            checkMarcGuess()
            break;
        }
    }
}

const checkYellows = () => {
    let valid = 0
    for (let j = 0; j < yellows.length; j++) {
        if (marcGuess.includes(yellows[j])) {
            valid++
            if(valid == yellows.length) {
                if (greys.length > 0) checkGreys()
                else {
                    writeGuess()
                }
            }
        } else {
            checkMarcGuess()
            break;
        }
    }
}

const checkGreys = () => {
    let valid = 0
    for (let j = 0; j < greys.length; j++) {
        if (greys[j].letter != marcGuess[greys[j].position]) {
            valid++
            if(valid == greys.length) {
                writeGuess()
            }
        } else {
            checkMarcGuess()
            break;
        }
    }
}






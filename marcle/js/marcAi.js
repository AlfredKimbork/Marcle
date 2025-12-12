import { possibleWords } from "./possibleWords/words.js";
import { addLetter, moveMarked, checkWord, yellows, greens, greys, gameStatus, word } from "./wordleLogic.js";
import { thinkingDelay, writingDelay, marcActive, setMarcSpeed } from "./initiateGame.js";
export const marcBtn = document.querySelector("#marc-btn");
export const speedBtn = document.querySelector("#speed-btn");
export const askMarc = document.querySelector("#ask-marc-btn");
let possibleGuesses = possibleWords;
let i = 0;
let guesses = 0;
let guessIndex;
let marcGuess;
export let marcThinking;
const getGuess = () => {
    let i = Math.round(Math.random() * (possibleGuesses.length - 1));
    return possibleGuesses[i];
};
const writeGuess = () => {
    const marcGuessedLetter = marcGuess[i];
    if (i < 5) {
        addLetter(marcGuessedLetter);
        moveMarked();
        setTimeout(() => writeGuess(), writingDelay * 10);
        i++;
    }
    else if (marcActive) {
        checkWord();
        possibleGuesses.splice(guessIndex, 1);
        moveMarked();
        i = 0;
        if (!gameStatus) {
            marcThinking = setTimeout(() => checkMarcGuess(), thinkingDelay * 100);
        }
    }
    else {
        i = 0;
        setMarcSpeed();
    }
};
export const checkMarcGuess = () => {
    marcGuess = getGuess();
    guessIndex = possibleGuesses.indexOf(marcGuess);
    // possibleGuesses.splice(guessIndex, 1)
    if (guesses > 1) {
        checkIfValid();
    }
    else {
        let returnStatement = true;
        for (let greyIndex = 0; greyIndex < greys.length; greyIndex++) {
            const grey = greys[greyIndex];
            if (marcGuess.includes(grey.letter)) {
                returnStatement = false;
                break;
            }
        }
        if (returnStatement) {
            writeGuess();
            guesses++;
        }
        else {
            checkMarcGuess();
        }
    }
    // if (guesses < 2 && greys.length > 0) checkGreys()
    //     else if (greens.length > 0) checkGreens()
    //         else if (yellows.length > 0 && greens.length <= 0) checkYellows()
    //             else {
    //                 writeGuess()
    //             };
};
// const checkGreens = () => {
//     let valid = 0
//     for (let j = 0; j < greens.length; j++) {
//         if (greens[j].letter == marcGuess[greens[j].position]) {
//             valid++
//             if(valid == greens.length) {
//                 if (yellows.length > 0) checkYellows()
//                     else if (greys.length > 0) checkGreys()
//                 else {
//                     writeGuess()
//                 }
//             }
//         } else {
//             checkMarcGuess()
//             break;
//         }
//     }
// }
// const checkYellows = () => {
//     let valid = 0
//     for (let j = 0; j < yellows.length; j++) {
//         if (marcGuess.includes(yellows[j].letter) && yellows[j].letter != marcGuess[yellows[j].position]) {
//             valid++
//             if(valid == yellows.length) {
//                 if (greys.length > 0) checkGreys()
//                 else {
//                     writeGuess()
//                 }
//             }
//         } else {
//             checkMarcGuess()
//             break;
//         }
//     }
// }
const checkIfValid = () => {
    let greenValid = false;
    let yellowValid = false;
    let greyValid = false;
    if (greens.length > 0) {
        for (let greenIndex = 0; greenIndex < greens.length; greenIndex++) {
            const green = greens[greenIndex];
            if (green.letter == marcGuess[green.position]) {
                greenValid = true;
            }
            else {
                if (marcGuess == word)
                    console.log("filtered at green");
                greenValid = false;
                break;
            }
        }
    }
    else {
        greenValid = true;
    }
    if (yellows.length > 0) {
        for (let yellowIndex = 0; yellowIndex < yellows.length; yellowIndex++) {
            const yellow = yellows[yellowIndex];
            if (marcGuess.includes(yellow.letter) && yellow.letter != marcGuess[yellow.position]) {
                yellowValid = true;
            }
            else if (greens.length > 0) {
                for (let greenIndex = 0; greenIndex < greens.length; greenIndex++) {
                    const green = greens[greenIndex];
                    if (yellow.letter == green.letter) {
                        yellowValid = true;
                        break;
                    }
                    else {
                        if (marcGuess == word)
                            console.log("filtered at yellow");
                        yellowValid = false;
                    }
                }
            }
            else {
                if (marcGuess == word)
                    console.log("filtered at yellow");
                yellowValid = false;
                break;
            }
            if (!yellowValid) {
                if (marcGuess == word)
                    console.log("doesn't contain yellow letter", yellow.letter);
                break;
            }
        }
    }
    else {
        yellowValid = true;
    }
    if (greys.length > 0) { // if there's any greys
        for (let greyIndex = 0; greyIndex < greys.length; greyIndex++) {
            const grey = greys[greyIndex];
            if (!marcGuess.includes(grey.letter)) { // if Marcs guess doesn't include grey letter 
                greyValid = true;
            }
            else if (greens.length > 0) {
                for (let greenIndex = 0; greenIndex < greens.length; greenIndex++) { // if it does but it's equal to a green letter
                    const green = greens[greenIndex];
                    if (grey.letter == green.letter) {
                        greyValid = true;
                        break;
                    }
                    else if (yellows.length > 0) {
                        for (let yellowIndex = 0; yellowIndex < yellows.length; yellowIndex++) { // if it's not equal to a green letter but it's equal to a yellow letter
                            const yellow = yellows[yellowIndex];
                            if (grey.letter == yellow.letter) {
                                greyValid = true;
                                break;
                            }
                            else { // if it's not equal to green nor yellow letter
                                if (marcGuess == word)
                                    console.log("filtered at grey, not green or yellow", grey.letter);
                                greyValid = false;
                            }
                        }
                    }
                }
            }
            else if (yellows.length > 0) {
                for (let yellowIndex = 0; yellowIndex < yellows.length; yellowIndex++) { // if it does but it's equal to a yellow letter
                    const yellow = yellows[yellowIndex];
                    if (grey.letter == yellow.letter) {
                        greyValid = true;
                        break;
                    }
                    else { // if it's not equal to yellow letter
                        if (marcGuess == word)
                            console.log("filtered at grey, not yellow");
                        greyValid = false;
                    }
                }
            }
            else { // if it's in Marcs guess and there's no greens or yellows 
                if (marcGuess == word)
                    console.log("filtered at grey");
                greyValid = false;
                break;
            }
            if (!greyValid) {
                if (marcGuess == word)
                    console.log("contains grey letter", grey.letter);
                break;
            }
        }
    }
    else {
        greyValid = true;
    }
    // for (let greyIndex = 0; greyIndex < greys.length; greyIndex++) {
    //     console.log(greyIndex)
    //     const grey = greys[greyIndex];
    //     // if(greyIndex == 0)console.log(greens)
    //     // if any green is present
    //     if(greens.length > 0) for (let greenIndex = 0; greenIndex < greens.length; greenIndex++) {
    //         // if(greyIndex == 0)console.log("green is present")
    //         const green = greens[greenIndex];
    //         if (!marcGuess.includes(green.letter)) {
    //             returnStatement = false;
    //             break;
    //         } else if (green.letter != marcGuess[green.position]) {
    //             returnStatement = false;
    //             console.log(green.letter, marcGuess[green.position])
    //             break;
    //         } else console.log(green.letter, marcGuess[green.position])
    //         // if any green + yellow is present
    //         if(yellows.length > 0) for (let yellowIndex = 0; yellowIndex < yellows.length; yellowIndex++) {
    //             const yellow = yellows[yellowIndex];
    //             if (!marcGuess.includes(yellow.letter)) {
    //                 returnStatement = false;
    //                 break;
    //             } else if (yellow.letter == marcGuess[yellow.position]) {
    //                 returnStatement = false;
    //                 break;
    //             }
    //             // if grey letter is equal to yellow or green
    //             if (grey.letter == yellow.letter || grey.letter == green.letter) {
    //                 returnStatement = true
    //                 break;
    //             // if grey letter is NOT equal to yellow or green
    //             } else if (grey.letter != yellow.letter && marcGuess.includes(grey.letter) 
    //                 || grey.letter != green.letter && marcGuess.includes(grey.letter)) {
    //                 returnStatement = false;
    //             } 
    //             // if grey is NOT equal to green
    //         } else if (grey.letter != green.letter && marcGuess.includes(grey.letter)) {
    //             returnStatement = false;
    //             break;
    //             // grey is NOT equal to green
    //         }
    //         if(returnStatement) break
    //     // if no greens but yellows
    //     } else if (yellows.length > 0) for (let yellowIndex = 0; yellowIndex < yellows.length; yellowIndex++) {
    //         const yellow = yellows[yellowIndex];
    //         if (!marcGuess.includes(yellow.letter)) {
    //             returnStatement = false;
    //             break;
    //         } 
    //         if (yellow.letter == marcGuess[yellow.position]) {
    //             returnStatement = false;
    //             break;
    //         }
    //         // if grey letter is equal to yellow
    //         if (grey.letter == yellow.letter) {
    //             returnStatement = true
    //             break;
    //         // if grey letter is NOT equal to yellow
    //         } else if (marcGuess.includes(grey.letter)) {
    //             returnStatement = false;
    //         }
    //         if(returnStatement) break
    //     // if no yellows or greens
    //     } else if (marcGuess.includes(grey.letter)) {
    //         returnStatement = false;
    //         break;
    //     }
    // }
    if (marcGuess == word)
        console.log(greens, yellows, greys, greenValid, yellowValid, greyValid);
    if (possibleGuesses.length == 0)
        console.log("out of guesses", word);
    if (greenValid && yellowValid && greyValid) {
        writeGuess();
    }
    else {
        possibleGuesses.splice(guessIndex, 1);
        checkMarcGuess();
    }
};

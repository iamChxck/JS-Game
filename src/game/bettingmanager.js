export const winMultiplierArr = [
    [ 0.5,  1,   2.5 ], // Orange
    [ 0.7,  1.5, 4   ], // Pear
    [ 0.8,  2,   5   ], // Banana
    [ 1,    2.5, 6   ], // Cherry
    [ 2.5,  6,   12  ], // Seven
    [ 5,    20,  25  ], // Barbar
    [ 1,    1,   1  ]  // Wild
];

let mainBalance = 500000;
const coinValues = [100, 50, 20, 10, 5, 2, 1];
let currCoinIndex = 0;

// Convert main balance to in-game balance based on the current coin value
function getInGameBalance() {
    return Math.floor(mainBalance / coinValues[currCoinIndex]);
}

// Convert in-game balance to main balance
function getMainBalanceFromInGame(inGameBalance) {
    return inGameBalance * coinValues[currCoinIndex];
}

//#region Balance
export function GetBalance() {
    // Return the in-game balance based on the current coin value
    return getInGameBalance();
}

export function AddBalance(win) {
    if (typeof (win) !== "number") {
        return;
    }
    // Add winnings in terms of the current coin value
    mainBalance += win * coinValues[currCoinIndex];
    // Ensure no floating point issues
    mainBalance = Math.floor(mainBalance);
}

export function AddCoinValue() {
    if (currCoinIndex > 0) {
        currCoinIndex--;
    }
}

export function SubtractCoinValue() {
    if (currCoinIndex < coinValues.length - 1) {
        currCoinIndex++;
    }
}

export function GetCurrCoinValue() {
    return (coinValues[currCoinIndex] / 100).toFixed(2);
}

export function SubtractBalance() {
    const betAmount = GetBet();  // Get the current bet amount
    const coinValue = coinValues[currCoinIndex];

    // Calculate the actual bet amount in terms of the in-game balance
    const actualBetAmount = betAmount * coinValue;

    // Check if the balance is sufficient and subtract the bet amount
    if (actualBetAmount <= mainBalance) {
        mainBalance -= actualBetAmount;
        // Ensure the main balance remains accurate with no floating point issues
        mainBalance = Math.floor(mainBalance);
    } else {
        console.log("Insufficient balance.");
    }
}
//#endregion

//#region Bet
let bet = 10;

const betLevelValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let currBetIndex = betLevelValues.length - 1;

export function GetBet() {
    return bet * betLevelValues[currBetIndex];
}

export function AddBetLevel() {
    if (currBetIndex < betLevelValues.length - 1) {
        currBetIndex++;
    }
}

export function SubtractBetLevel() {
    if (currBetIndex > 0) {
        currBetIndex--;
    }
}

export function GetCurrBetValue() {
    return betLevelValues[currBetIndex];
}
//#endregion

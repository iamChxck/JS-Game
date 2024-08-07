import { dialogText, spinButton, UpdateBalanceText } from "../UI/ui.js";
import { AddBalance, GetBet, winMultiplierArr } from "./bettingmanager.js";
import { weightedRand } from "./rand.js";

const reelCount = 5;
const visibleSymbols = 3; // Number of visible symbols at one time
const symbolHeight = 150;
const spacing = 30;
const reelWidth = 170;

const symbols = ['blue', 'red', 'green', 'yellow', 'seven', 'bar', 'wild'];
const blurredSymbols = ['blueBlurred', 'redBlurred', 'greenBlurred', 'yellowBlurred', 'sevenBlurred', 'barBlurred', 'wildBlurred'];

// Calculate the total width of all reels including spacing
const totalWidth = reelCount * reelWidth + (reelCount - 1) * spacing;

let reels = []; // 2D Array for reels
let isSpinning = false;
let visibleSymbolsArray = []; // Array to store visible symbols at the end of the spin

export function GenerateReel(scene) {
    CreateReels(scene, reelCount, visibleSymbols);
}

function CreateReels(scene, numReels, numVisibleSymbols) {
    const startX = 245; // Starting x position for the first reel
    const centerY = scene.cameras.main.height / 2;

    // Mask for the reels
    const maskWidth = totalWidth; // Total width of the reels
    const maskHeight = numVisibleSymbols * symbolHeight; // Height to cover visible symbols

    const maskGraphics = scene.add.graphics();
    maskGraphics.fillStyle(0xffffff, 0); // Mask color
    maskGraphics.fillRect(0, 0, maskWidth, maskHeight);

    // Position the mask
    const maskX = scene.cameras.main.width / 2 - totalWidth / 1.98;
    const maskY = scene.cameras.main.height / 2 - maskHeight / 1.5;
    maskGraphics.setPosition(maskX, maskY);

    const mask = maskGraphics.createGeometryMask();

    // Initialize the 2D array for reels
    reels = Array.from({ length: numReels }, () => []);

    for (let i = 0; i < numReels; i++) {
        const reelX = startX + i * (reelWidth + spacing); // Start reels at x: 245 and space them
        const reelY = centerY - (numVisibleSymbols * symbolHeight) / 2; // Center the reels vertically

        const reel = scene.add.container(reelX, reelY);
        reel.setMask(mask);

        // Initialize reel with random symbols
        for (let j = 0; j < numVisibleSymbols + 2; j++) { // +7 to cover the loop-around
            const randomSymbol = weightedRand(symbols);
            const symbol = scene.add.image(0, j * symbolHeight, randomSymbol);
            symbol.setDisplaySize(reelWidth, symbolHeight);
            reel.add(symbol);

            // Add physics to the symbol
            scene.physics.add.existing(symbol);
            symbol.body.setSize(reelWidth, symbolHeight); // Set collider size

            reels[i].push(symbol); // Add symbol to the 2D array
        }
    }
}



export function SpinReels(scene) {
    if (isSpinning) return;

    isSpinning = true;
    scene.time.clearPendingEvents(); // Clear any pending delayed calls
    spinNextReel(scene, 0); // Start with no initial delay
}

function spinNextReel(scene, index) {
    if (index >= reels.length) return;

    const reelSymbols = reels[index];
    const reelTween = scene.tweens.add({
        targets: reelSymbols,
        y: `+=${symbolHeight}`, // Move symbols down
        duration: 100,
        repeat: -1, // Continue indefinitely
        onUpdate: () => {
            reelSymbols.forEach(symbol => {
                symbol.setTexture(weightedRand(blurredSymbols)); // Change texture continuously
                symbol.setDisplaySize(reelWidth, symbolHeight);
                if (symbol.y >= symbolHeight * (visibleSymbols + 1)) {
                    symbol.y -= symbolHeight * (visibleSymbols + 2); // Move symbol back to top
                }
            });
        }
    });

    // Delay the start of the next reel spin
    scene.time.delayedCall(200, () => {
        spinNextReel(scene, index + 1); // Pass delay to the next reel
    });

    // Simulate stopping the reel after a random duration with an additional delay
    const spinDuration = 1000;
    scene.time.delayedCall(spinDuration, () => {
        StopReel(scene, index, reelTween);
    });
}

function StopReel(scene, index, reelTween) {
    const reelSymbols = reels[index];
    reelSymbols.forEach(symbol => {
        // Stop the tween for the symbol
        scene.tweens.killTweensOf(symbol);
        scene.tweens.killTweensOf(reelTween);

        const blurredSymbol = symbol.texture.key;

        for (let i = 0; i < blurredSymbols.length; i++) {
            if (blurredSymbols[i] === blurredSymbol.toString()) {
                symbol.setTexture(symbols[i]);
            }
        }

        // Adjust symbols to make sure they are properly aligned
        const newY = Math.round(symbol.y / symbolHeight) * symbolHeight;
        symbol.y = newY;
    });


    // If this is the last reel, mark the spinning as false
    if (index === reels.length - 1) {
        isSpinning = false;
        spinButton.enable();
        // Update the visibleSymbolsArray with the currently visible symbols
        updateVisibleSymbols(scene);
        // Add match-checking logic here
        CheckMatching(visibleSymbolsArray);
    }
}


function updateVisibleSymbols(scene) {
    // Initialize the array with 3 rows and 5 columns, filled with null
    visibleSymbolsArray = Array.from({ length: 3 }, () => Array(5).fill(null));

    // Calculate the bounds of the mask
    const maskX = scene.cameras.main.width / 2 - totalWidth / 1.98;
    const maskY = scene.cameras.main.height / 2 - (visibleSymbols * symbolHeight) / 1.5;
    const maskWidth = totalWidth;
    const maskHeight = visibleSymbols * symbolHeight;

    // Collect all visible symbols into a flat array
    let symbolsInView = [];

    reels.forEach((reelSymbols, reelIndex) => {
        reelSymbols.forEach(symbol => {
            const symbolBounds = symbol.getBounds();

            // Check if the symbol is within mask bounds
            if (
                symbolBounds.x < maskX + maskWidth &&
                symbolBounds.x + symbolBounds.width > maskX &&
                symbolBounds.y < maskY + maskHeight &&
                symbolBounds.y + symbolBounds.height > maskY
            ) {
                symbolsInView.push({
                    x: reelIndex, // Reel index as the x position
                    y: Math.abs(Math.floor(symbol.y / symbolHeight)), // Row position based on y position
                    textureKey: symbol.texture.key
                });
            }
        });
    });

    // Sort symbols primarily by their y position (top to bottom) and secondarily by their x position (left to right)
    symbolsInView.sort((a, b) => {
        if (a.y === b.y) {
            return a.x - b.x; // If in the same row, sort by x position
        }
        return a.y - b.y; // Sort by y position
    });

    // Fill the 3x5 grid with symbols
    symbolsInView.forEach((symbol, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        if (row < 3 && col < 5) {
            visibleSymbolsArray[row][col] = {
                position: [col, row],
                textureKey: symbol.textureKey
            };
        }
    });

    // Log the result for debugging
    console.log('Visible Symbols Array:', visibleSymbolsArray);
}


function CheckMatching(selectedSymbolsArr) {
    console.log(selectedSymbolsArr);
    if (!Array.isArray(selectedSymbolsArr)) {
        alert("Wrong value passed");
        return false;
    }


    // Define the dimensions of the slot machine
    const numRows = 3;
    const numCols = 5;

    // Ensure the array has the correct dimensions
    if (!selectedSymbolsArr || selectedSymbolsArr.length !== numRows || selectedSymbolsArr[0].length !== numCols) {
        console.error("Array must be 3 rows by 5 columns.");
        return false; // Exit if the array size is incorrect
    }

    // Define the paylines based on the patterns
    const paylines = [
        // Simple paylines
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], // Top row 0
        [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]], // Middle row 1
        [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]], // Bottom row 2

        // Complex paylines
        [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]], // Diagonal from top-left to bottom-right with middle crossing 3
        [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]], // Diagonal from bottom-left to top-right with middle crossing 4

        [[2, 0], [1, 1], [2, 2], [1, 3], [2, 4]], // Zigzag pattern 5
        [[0, 0], [1, 1], [0, 2], [1, 3], [0, 4]], // Zigzag pattern 6

        [[1, 0], [2, 1], [1, 2], [2, 3], [1, 4]], // Zigzag pattern starting from middle row 7
        [[1, 0], [0, 1], [1, 2], [0, 3], [1, 4]], // Zigzag pattern starting from middle row 8

        [[1, 0], [0, 1], [0, 2], [0, 3], [1, 4]], // Upper-left to middle-right 9
        [[1, 0], [2, 1], [2, 2], [2, 3], [1, 4]], // Lower-left to middle-right 10

        // [[0, 0], [0, 1], [1, 2], [0, 3], [0, 4]], // Top row with a diagonal crossing 11
        // [[2, 0], [2, 1], [1, 2], [2, 3], [2, 4]], // Bottom row with a diagonal crossing 12

        // [[1, 0], [1, 1], [2, 2], [1, 3], [1, 4]], // Middle row with a diagonal crossing 13
        // [[1, 0], [1, 1], [0, 2], [1, 3], [1, 4]], // Middle row with a diagonal crossing 14

        // [[0, 0], [1, 1], [1, 2], [1, 3], [0, 4]], // Upper-left to upper-right with a middle crossing 15
        // [[2, 0], [1, 1], [1, 2], [1, 3], [2, 4]], // Lower-left to lower-right with a middle crossing 16

        // [[0, 0], [2, 1], [0, 2], [2, 3], [0, 4]], // Upper and lower row zigzag pattern 17
        // [[2, 0], [0, 1], [2, 2], [0, 3], [2, 4]], // Lower and upper row zigzag pattern 18

        // [[0, 0], [2, 1], [2, 2], [2, 3], [0, 4]], // Zigzag pattern with upper and lower rows 19
        // [[2, 0], [0, 1], [0, 2], [0, 3], [2, 4]], // Zigzag pattern with upper and lower rows 20

        // [[0, 0], [0, 1], [2, 2], [0, 3], [0, 4]], // Upper rows with a center diagonal crossing 21
        // [[2, 0], [2, 1], [0, 2], [2, 3], [2, 4]], // Lower rows with a center diagonal crossing 22

        // [[1, 0], [0, 1], [1, 2], [2, 3], [1, 4]], // Middle row with diagonal crossing from upper to lower 23
        // [[1, 0], [2, 1], [1, 2], [0, 3], [1, 4]]  // Middle row with diagonal crossing from lower to upper 24
    ];

    // Helper function to check if all elements in the specified positions are the same
    function CheckSequence(positions) {
        const firstElement = selectedSymbolsArr[positions[0][0]][positions[0][1]].textureKey; // Get the value at the first position
        const wildElement = symbols[symbols.length - 1]; // Get the value of wild symbol
        let hasWildElement = false;

        for (let i = 1; i < positions.length; i++) {
            const [row, col] = positions[i]; // Get the row and column for the current position

            if (selectedSymbolsArr[row][col].textureKey !== firstElement &&
                selectedSymbolsArr[row][col].textureKey !== wildElement &&
                firstElement != wildElement) {
                return { isMatch: false, value: null, hasWildElement: hasWildElement }; // Return false if any element does not match the first one
            }

            if (selectedSymbolsArr[row][col] === wildElement || firstElement == wildElement) {
                hasWildElement = true;
            }
        }

        return { isMatch: true, value: firstElement, hasWildElement: hasWildElement }; // All elements match
    }

    // Helper function to categorize the match (3x, 4x, 5x) and get the value
    function CategorizeMatch(pattern) {
        const numMatches = pattern.length;
        const result = CheckSequence(pattern);

        // Determine the match length if it is a valid match
        if (result.isMatch) {
            if (numMatches === 5) return { length: 5, value: result.value, hasWildElement: result.hasWildElement }; // 5x match
            if (numMatches === 4) return { length: 4, value: result.value, hasWildElement: result.hasWildElement }; // 4x match
            if (numMatches === 3) return { length: 3, value: result.value, hasWildElement: result.hasWildElement }; // 3x match
        }

        return { length: 0, value: null, hasWildElement: false }; // No match
    }

    // Track the highest match length and value for each payline
    const maxMatches = [];

    // Check each payline to see if it matches and categorize the match
    for (let i = 0; i < paylines.length; i++) {
        const pattern = paylines[i]; // Get the current payline pattern
        let maxMatch = { length: 0, value: null, hasWildElement: false };

        // Check for matches of length 3 to 5
        for (let length = 3; length <= 5; length++) {
            const shortenPattern = pattern.slice(0, length); // Shorten pattern to current length
            const matchResult = CategorizeMatch(shortenPattern);
            if (matchResult.length > maxMatch.length) {
                maxMatch = matchResult; // Update to the highest match length
            }
        }

        // Store the maximum match length and value found for this payline
        if (maxMatch.length > 0) {
            maxMatches.push({ payline: i, matchLength: maxMatch.length, matchValue: maxMatch.value, matchHasWildElement: maxMatch.hasWildElement });
        }
    }
    let wins = [];

    // Log results
    if (maxMatches.length > 0) {
        for (const match of maxMatches) {
            //console.log(`Payline ${match.payline} matches with ${match.matchLength}x. First element value: ${match.matchValue}. Has wild element ${match.matchHasWildElement}`);
            wins.push(ComputeWin(match));
        }

        const totalWin = wins.reduce((a, b) => a + b, 0);
        AddBalance(totalWin);
        dialogText.setText("You won: $" + totalWin.toFixed(2) + "!!");
        console.log("You won: $" + totalWin.toFixed(2) + "!!");
        UpdateBalanceText();
        return true; // Return true if any matches are found
    } else {
        dialogText.setText("No match found. Try again!");
        console.log("No match found. Try again!");
        return false; // Return false if no matches are found
    }

    // Compute for how much the player wins
    function ComputeWin(matchList) {
        let win = 0;

        for (let i = 0; i < symbols.length; i++) {
            // Determine which symbol matched
            if (matchList.matchValue === symbols[i]) {
                // Check which multiplier to apply
                if (matchList.matchLength === 3) {
                    win = (GetBet() * winMultiplierArr[i][0]);
                } else if (matchList.matchLength === 4) {
                    win = GetBet() * winMultiplierArr[i][1];
                } else if (matchList.matchLength === 5) {
                    win = GetBet() * winMultiplierArr[i][2];
                }
            }
        }

        if (matchList.matchHasWildElement) {
            win *= 2;
        }

        win = Math.round((win + Number.EPSILON) * 100) / 100;

        return win;
    }
}
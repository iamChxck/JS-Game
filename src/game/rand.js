// Will throw an error if value is 0 or 1
const weights = [20, 20, 15, 15, 2, 1, 1];

export function weightedRand(symbols = []) {
    // let total = 0;
    let cursor = 0;

    // Add the total weight
    // const total = weights.reduce((a, b) => a + b, 0);
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);


    // Get a random number based on the total weight
    const random = Math.ceil(Math.random() * totalWeight);

    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    let currentSeed = Date.now() % m;

    function pseudoRNG() {
        currentSeed = (a * currentSeed + c) % m;
        return currentSeed / m;
    }

    const randomValue = pseudoRNG() * totalWeight;
    let cumulativeWeight = 0;

    // for (let i = 0; i < symbols.length; i++) {
    //     cumulativeWeight += weights[i];
    //     if (randomValue < cumulativeWeight) {
    //         return symbols[i];
    //     }
    // }

    // Look for the weighted random
    for (let i = 0; i < weights.length; i++) {
        // Add a catch for when cursor is < random
        cursor += weights[i];
        if (cursor >= random) {
            return symbols[i];
        }
    }
}

function calculateRTP(numSpins) {
    const payoutResults = {};
    for (let i = 0; i < numSpins; i++) {
        const symbol = weightedRand();
        const matches = 5; // Simplified, can vary
        const payout = getMultiplier(symbol, matches);
        payoutResults[symbol] = (payoutResults[symbol] || 0) + payout;
    }

    const totalPayout = Object.values(payoutResults).reduce((acc, payout) => acc + payout, 0);
    const rtp = (totalPayout / numSpins) * 100; // Assuming 1 unit per spin
    return rtp;
}

// Function to get the multiplier for a symbol and number of matches
function getMultiplier(symbol, matches) {
    const index = symbols.indexOf(symbol);
    if (index === -1) {
        throw new Error('Symbol not found');
    }
    const multipliers = winMultiplierArr[index];
    // Ensure that the number of matches is within the valid range
    if (matches < 3 || matches > 5) {
        throw new Error('Invalid number of matches');
    }
    // Determine the correct multiplier index based on the number of matches
    const multiplierIndex = matches - 3;
    return multipliers[multiplierIndex];
}

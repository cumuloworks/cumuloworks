/**
 * This module generates a sequence of numbers (1, 2, or 3) that sum up to a target value.
 * It uses a weighted random selection to determine each number in the sequence,
 * with adjustments to reduce repetition and control the distribution of numbers.
 *
 * Input: A target sum (number) e.g. 10
 * Output: An array of numbers (1, 2, or 3) that add up to the target sum e.g. [1, 3, 2, 3, 1]
 */

export const generateGallerySequence = (targetSum) => {
	const sequence = [];
	let total = 0;
	let lastNum = null;

	// Generate numbers until reach or exceed the target sum
	while (total < targetSum) {
		let randomNum;
		if (lastNum !== null) {
			// Adjust weights to reduce the chance of repeating the last number
			const weights = [1, 1, 1];
			weights[lastNum - 1] = 1 / 3;
			randomNum = weightedRandom([1, 2, 3], weights);
		} else {
			// For the first number, use a different set of weights
			randomNum = weightedRandom([1, 2, 3], [1, 2, 1]);
		}

		// Add the number to the sequence if it doesn't exceed the target sum
		if (total + randomNum <= targetSum) {
			total += randomNum;
			sequence.push(randomNum);
			lastNum = randomNum;
		}
	}

	return sequence;
};

const weightedRandom = (values, weights) => {
	// Calculate the total weight
	const totalWeight = weights.reduce((a, b) => a + b, 0);

	// Generate a random number within the total weight range
	const randomNum = Math.random() * totalWeight;

	let weightSum = 0;
	// Iterate through the weights to find the selected value
	for (let i = 0; i < values.length; i++) {
		weightSum += weights[i];
		weightSum = +weightSum.toFixed(2); // Ensure precision

		// Return the value if the random number falls within its weight range
		if (randomNum <= weightSum) {
			return values[i];
		}
	}
};

export const generateGallerySequence = (targetSum) => {
	const sequence = [];
	let total = 0;
	let lastNum = null;

	while (total < targetSum) {
		let randomNum;
		if (lastNum !== null) {
			const weights = [1, 1, 1];
			weights[lastNum - 1] = 1 / 3;
			randomNum = weightedRandom([1, 2, 3], weights);
		} else {
			randomNum = weightedRandom([1, 2, 3], [1, 2, 1]);
		}

		if (total + randomNum <= targetSum) {
			total += randomNum;
			sequence.push(randomNum);
			lastNum = randomNum;
		}
	}

	return sequence;
};

const weightedRandom = (values, weights) => {
	const totalWeight = weights.reduce((a, b) => a + b, 0);
	const randomNum = Math.random() * totalWeight;
	let weightSum = 0;
	for (let i = 0; i < values.length; i++) {
		weightSum += weights[i];
		weightSum = +weightSum.toFixed(2);

		if (randomNum <= weightSum) {
			return values[i];
		}
	}
};

/**
 * This module generates a sequence of numbers that sum up to a target value.
 * It uses a weighted random selection to determine each number in the sequence,
 * with adjustments to reduce repetition and control the distribution of numbers.
 *
 * Input:
 *   - targetSum: A target sum (number) e.g. 10
 *   - min: Minimum value in the sequence (default: 1)
 *   - max: Maximum value in the sequence (default: 3)
 * Output: An array of numbers that add up to the target sum e.g. [1, 3, 2, 3, 1] or [2, 4, 3, 2]
 */
export const generateGallerySequence = (targetSum: number, min: number = 1, max: number = 3) => {
  const sequence = [];
  let total = 0;
  let lastNum = null;
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  while (total < targetSum) {
    let randomNum: number;
    const remaining = targetSum - total;
    const isLastRow = remaining <= max + 2; // Consider it's the last row if remaining is close to max

    // Priority 1: If remaining is within the valid range, ALWAYS use it (final row)
    if (remaining >= min && remaining <= max) {
      randomNum = remaining;
    }
    // Priority 2: If remaining is less than min, we must use remaining to finish
    else if (remaining < min) {
      randomNum = remaining;
    }
    // Priority 3: If remaining is slightly over max, check if we can split
    else if (remaining === max + 1) {
      // Split into two rows: use max-1, then remaining will be 2
      if (max - 1 >= min) {
        randomNum = max - 1;
      } else {
        randomNum = max;
      }
    }
    // Priority 4: If remaining is max+2, split into two rows
    else if (remaining === max + 2) {
      // Split: use max, then remaining will be 2
      randomNum = max;
    }
    // Priority 5: If we're close to the end, prefer values that will leave a valid remainder
    else if (isLastRow) {
      // Try to find a value that will leave remaining within valid range
      const validChoices = range.filter((n) => {
        const nextRemaining = remaining - n;
        return (
          nextRemaining >= 0 &&
          (nextRemaining === 0 || (nextRemaining >= min && nextRemaining <= max))
        );
      });

      if (validChoices.length > 0) {
        // Prefer values that don't repeat the last number
        if (lastNum !== null && validChoices.length > 1) {
          const filtered = validChoices.filter((n) => n !== lastNum);
          randomNum =
            filtered.length > 0
              ? weightedRandom(
                  filtered,
                  filtered.map(() => 1),
                )
              : validChoices[0];
        } else {
          randomNum = validChoices[0];
        }
      } else {
        // Fallback: use the largest value that fits
        const validNums = range.filter((n) => total + n <= targetSum);
        randomNum = validNums.length > 0 ? Math.max(...validNums) : max;
      }
    }
    // Priority 6: Normal case - reduce repetition
    else if (lastNum !== null) {
      const weights = range.map(() => 1);
      const lastIndex = range.indexOf(lastNum);
      if (lastIndex !== -1) {
        weights[lastIndex] = 1 / 3;
      }
      randomNum = weightedRandom(range, weights);

      // Ensure we don't exceed targetSum
      if (total + randomNum > targetSum) {
        const validNums = range.filter((n) => total + n <= targetSum);
        if (validNums.length > 0) {
          randomNum = Math.max(...validNums);
        } else {
          randomNum = remaining;
        }
      }
    }
    // Priority 7: Initial selection
    else {
      const weights = range.map((_val, idx) => {
        const middle = Math.floor(range.length / 2);
        const distance = Math.abs(idx - middle);
        return range.length - distance;
      });
      randomNum = weightedRandom(range, weights);

      // Ensure we don't exceed targetSum
      if (total + randomNum > targetSum) {
        const validNums = range.filter((n) => total + n <= targetSum);
        if (validNums.length > 0) {
          randomNum = Math.max(...validNums);
        } else {
          randomNum = remaining;
        }
      }
    }

    total += randomNum;
    sequence.push(randomNum);
    lastNum = randomNum;
  }

  return sequence;
};

const weightedRandom = (values: number[], weights: number[]) => {
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

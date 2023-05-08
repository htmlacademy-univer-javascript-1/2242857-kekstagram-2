export const getRandomNumberFromRange = (min, max) => (Math.round(Math.random() * Math.abs(max - min) + Math.min(min, max)));
export const UniqueRandomNumberGenerator = class {
  constructor (min, max) {
    this.min = Math.min(min, max);
    this.max = Math.max(min, max);
    this.rangeSize = this.max - this.min + 1;
    this.usedNumbers = new Set();
  }

  generate () {
    if (this.usedNumbers.size === this.rangeSize) {
      throw new Error('Unique numbers exhausted');
    }

    let number = getRandomNumberFromRange(this.min, this.max);
    while (this.usedNumbers.has(number)) {
      number = getRandomNumberFromRange(this.min, this.max);
    }
    this.usedNumbers.add(number);
    return number;
  }
};

export const isCorrectLength = (str, maxLength) => (str.length <= maxLength);
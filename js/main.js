const getRandomNumberFromRange = (min, max) => (Math.round(Math.random() * Math.abs(max - min) + Math.min(min, max)));
const isCorrectLength = (str, maxLength) => (str.length <= maxLength);

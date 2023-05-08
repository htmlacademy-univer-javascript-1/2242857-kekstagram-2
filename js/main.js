const NUMBER_OF_PHOTOS = 25;

const getRandomNumberFromRange = (min, max) => (Math.round(Math.random() * Math.abs(max - min) + Math.min(min, max)));
const UniqueRandomNumberGenerator = class {
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

const isCorrectLength = (str, maxLength) => (str.length <= maxLength);

const generateComment = (() => {
  const NAMES = ['Евгений', 'Иван', 'Ксения', 'Полина', 'Илья', 'Даниил', 'Аделина', 'Екатерина', 'Сергей', 'Даниэль'];
  const MESSAGES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  const NUMBER_OF_AVATARS = 6;

  const commentIdGenerator = new UniqueRandomNumberGenerator(1, Number.MAX_SAFE_INTEGER);

  return () => {
    const comment = {};
    comment.id = commentIdGenerator.generate();
    comment.name = NAMES[getRandomNumberFromRange(0, NAMES.length - 1)];
    comment.avatar = `img/avatar-${getRandomNumberFromRange(1, NUMBER_OF_AVATARS)}.svg`;
    comment.message = '';
    {
      const messageUniqueNumberGenerator = new UniqueRandomNumberGenerator(0, MESSAGES.length - 1);
      const numberOfMessageTexts = getRandomNumberFromRange(1, 2);
      for (let i = 0; i < numberOfMessageTexts; i++) {
        if (i > 0) {
          comment.message += ' ';
        }
        comment.message += MESSAGES[messageUniqueNumberGenerator.generate()];
      }
    }
    return comment;
  };
})();

const generatePhotoDescription = (() => {
  const photoUniqueNumberGenerator = new UniqueRandomNumberGenerator(1, NUMBER_OF_PHOTOS);

  let id = 1;
  let descriptionNumber = 1;

  return () => {
    const photoDescription = {};
    photoDescription.id = id++;
    photoDescription.url = `photos/${photoUniqueNumberGenerator.generate()}.jpg`;
    photoDescription.description = `Описание ${descriptionNumber++}.`;
    photoDescription.likes = getRandomNumberFromRange(15, 200);
    photoDescription.comments = [];
    const numberOfComments = getRandomNumberFromRange(1, 4);
    for (let i = 0; i < numberOfComments; i++) {
      photoDescription.comments.push(generateComment());
    }
    return photoDescription;
  };
})();

const photoDescriptions = Array.from({length: NUMBER_OF_PHOTOS}, generatePhotoDescription);

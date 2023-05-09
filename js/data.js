import {getRandomNumberFromRange, UniqueRandomNumberGenerator} from "./util.js";

const NAMES = ['Евгений', 'Иван', 'Ксения', 'Полина', 'Илья', 'Даниил', 'Аделина', 'Екатерина', 'Сергей', 'Даниэль'];
const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

export const NUMBER_OF_AVATARS = 6;
export const NUMBER_OF_PICTURES = 25;

export const generateComment = (() => {
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

export const generatePictureDescription = (() => {
  const pictureUniqueNumberGenerator = new UniqueRandomNumberGenerator(1, NUMBER_OF_PICTURES);

  let id = 1;
  let descriptionNumber = 1;

  return () => {
    const pictureDescription = {};
    pictureDescription.id = id++;
    pictureDescription.url = `photos/${pictureUniqueNumberGenerator.generate()}.jpg`;
    pictureDescription.description = `Описание ${descriptionNumber++}.`;
    pictureDescription.likes = getRandomNumberFromRange(15, 200);
    pictureDescription.comments = [];
    const numberOfComments = getRandomNumberFromRange(1, 4);
    for (let i = 0; i < numberOfComments; i++) {
      pictureDescription.comments.push(generateComment());
    }
    return pictureDescription;
  };
})();

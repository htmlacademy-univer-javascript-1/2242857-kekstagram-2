import {openBigPicture} from './big-picture.js'

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')

let pictureDescriptions = new Map();

const onClickHandler = (event) => {
  event.preventDefault();
  
  let picture = event.target;
  while (picture.nodeName !== 'A') {
    picture = picture.parentNode;
  }
  
  const pictureDescription = pictureDescriptions.get(picture);
  
  openBigPicture(pictureDescription);
};

export const addPictures = (pictures) => {
  const fragment = document.createDocumentFragment();
  
  pictures.forEach((picture) => {
    const pictureFragment = pictureTemplate.cloneNode(true).content;
    const pictureElement = pictureFragment.querySelector('.picture');
    
    pictureFragment.querySelector('.picture__img').src = picture.url;
    pictureFragment.querySelector('.picture__likes').textContent = picture.likes;
    pictureFragment.querySelector('.picture__comments').textContent = picture.comments.length;
    
    pictureElement.addEventListener('click', onClickHandler);
    pictureDescriptions.set(pictureElement, picture);
    
    fragment.appendChild(pictureFragment);
  });
  
  picturesContainer.appendChild(fragment);
};


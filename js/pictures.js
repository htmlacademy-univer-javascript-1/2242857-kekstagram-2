import {getPictures} from './api.js';
import {openBigPicture} from './big-picture.js';
import {showError} from './messages.js';
import {UniqueRandomNumberGenerator, debounce} from './util.js';

const filtersContainer = document.querySelector('.img-filters');

const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')

let elementToPicture = new Map();
let pictures = null;

const onClickHandler = (event) => {
  event.preventDefault();
  
  const picture = event.target.closest('A.picture');
  const pictureDescription = elementToPicture.get(picture);
  
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
    elementToPicture.set(pictureElement, picture);
    
    fragment.appendChild(pictureFragment);
  });
  
  picturesContainer.appendChild(fragment);
};

export const clearPictures = () => {
  picturesContainer.querySelectorAll('.picture').forEach((pictureElement) => pictureElement.remove());
  elementToPicture.clear();
};

export const showPictures = debounce((pictures) => {
  clearPictures();
  addPictures(pictures);
}, 500);

const onChangeFilter = (event) => {
  filtersContainer.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
  const filterElement = event.target.closest('.img-filters__button');
  filterElement.classList.add('img-filters__button--active');
  
  if (filterElement.id === 'filter-default') {
    showPictures(pictures);
  } else if (filterElement.id === 'filter-random') {
    const generator = new UniqueRandomNumberGenerator(0, pictures.length - 1);
    const filteredPictures = [];
    for (let i = 0; i < 10; i++) {
      filteredPictures.push(pictures[generator.generate()]);
    }
    showPictures(filteredPictures);
  } else if (filterElement.id === 'filter-discussed') {
    const sortedPictures = new Array(...pictures);
    sortedPictures.sort((a, b) => {
      if (a.comments.length > b.comments.length) {
        return -1;
      }
      if (a.comments.length < b.comments.length) {
        return 1;
      }
      return 0;
    });
    showPictures(sortedPictures);
  }
};

getPictures((picturesParameter) => {
  pictures = picturesParameter;
  if (picturesParameter.length > 0) {
    filtersContainer.classList.remove('img-filters--inactive');
    filtersContainer.querySelectorAll('.img-filters__button').forEach((filter) => filter.addEventListener('click', onChangeFilter));
    
    showPictures(pictures);
  }
}, showError);
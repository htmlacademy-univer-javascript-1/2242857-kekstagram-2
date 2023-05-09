const picturesContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')

export const addPictures = (pictures) => {
  const fragment = document.createDocumentFragment();
  
  pictures.forEach((picture) => {
    const pictureElement = pictureTemplate.cloneNode(true).content;
    
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;
    
    fragment.appendChild(pictureElement);
  });
  
  picturesContainer.appendChild(fragment);
};


const bigPictureElement = document.querySelector('.big-picture');

const imageElement = bigPictureElement.querySelector('.big-picture__img>img');

const headerElement = bigPictureElement.querySelector('.social__header');
const avatarElement = headerElement.querySelector('.social__picture');
const captionElement = headerElement.querySelector('.social__caption');
const likesCountElement = headerElement.querySelector('.likes-count');

const commentCountElement = bigPictureElement.querySelector('.social__comment-count');
const commentsCountElement = bigPictureElement.querySelector('.comments-count');

const commentsElement = bigPictureElement.querySelector('.social__comments');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');

const bigPictureCancelElement = bigPictureElement.querySelector('.big-picture__cancel');

const commentTemplate = document.querySelector('#social__comment');



const onCloseBigPicture = (event) => {
  if (event.type === 'keydown' && event.key !== 'Escape') {
    return;
  }
  
  event.preventDefault();
  
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  
  bigPictureCancelElement.removeEventListener('click', onCloseBigPicture);
  window.removeEventListener('keydown', onCloseBigPicture);
};

export const openBigPicture = (picture) => {
  imageElement.src = picture.url;
  
  captionElement.textContent = picture.description;
  likesCountElement.textContent = picture.likes;
  
  commentCountElement.classList.add('hidden');
  commentsCountElement.textContent = picture.comments.length;
  
  commentsElement.textContent = '';
  
  const fragment = document.createDocumentFragment();
  
  picture.comments.forEach((comment) => {
    const commentFragment = commentTemplate.cloneNode(true).content
    
    const commentAvatar = commentFragment.querySelector('.social__picture');
    commentAvatar.src = comment.avatar;
    commentAvatar.alt = comment.name;
    
    commentFragment.querySelector('.social__text').textContent = comment.message;
    
    fragment.appendChild(commentFragment);
  });
  
  commentsElement.appendChild(fragment);
  
  commentsLoaderElement.classList.add('hidden');
  
  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  
  window.addEventListener('keydown', onCloseBigPicture);
  bigPictureCancelElement.addEventListener('click', onCloseBigPicture);
};

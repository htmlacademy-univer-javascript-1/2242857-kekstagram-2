const NUMBER_OF_LOAD_COMMENTS_PER_STEP = 5;

const bigPictureElement = document.querySelector('.big-picture');

const imageElement = bigPictureElement.querySelector('.big-picture__img>img');

const headerElement = bigPictureElement.querySelector('.social__header');
const avatarElement = headerElement.querySelector('.social__picture');
const captionElement = headerElement.querySelector('.social__caption');
const likesCountElement = headerElement.querySelector('.likes-count');

const commentCountElement = bigPictureElement.querySelector('.social__comment-count');
const commentsLoadedElement = bigPictureElement.querySelector('.comments-loaded');
const commentsCountElement = bigPictureElement.querySelector('.comments-count');

const commentsElement = bigPictureElement.querySelector('.social__comments');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');

const bigPictureCancelElement = bigPictureElement.querySelector('.big-picture__cancel');

const commentTemplate = document.querySelector('#social__comment');

let currentPicture = null;
let numberOfLoadedComments = 0;

const addComments = (comments) => {
  const fragment = document.createDocumentFragment();
  
  comments.forEach((comment) => {
    const commentFragment = commentTemplate.cloneNode(true).content
    
    const commentAvatar = commentFragment.querySelector('.social__picture');
    commentAvatar.src = comment.avatar;
    commentAvatar.alt = comment.name;
    
    commentFragment.querySelector('.social__text').textContent = comment.message;
    
    fragment.appendChild(commentFragment);
  });
  
  commentsElement.appendChild(fragment);
  
  numberOfLoadedComments += comments.length;
  commentsLoadedElement.textContent = numberOfLoadedComments;
  
};

const loadComments = () => {
  addComments(currentPicture.comments.slice(numberOfLoadedComments, numberOfLoadedComments + NUMBER_OF_LOAD_COMMENTS_PER_STEP));
  
  if (numberOfLoadedComments === currentPicture.comments.length) {
    commentsLoaderElement.classList.add('hidden');
  }
};

const onLoadComments = (event) => {
  event.preventDefault();
  loadComments();
}

const onCloseBigPicture = (event) => {
  if (event.type === 'keydown' && event.key !== 'Escape') {
    return;
  }
  
  event.preventDefault();
  
  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  
  commentsLoaderElement.removeEventListener('click', onLoadComments);
  
  bigPictureCancelElement.removeEventListener('click', onCloseBigPicture);
  window.removeEventListener('keydown', onCloseBigPicture);
  
  currentPicture = null;
  numberOfLoadedComments = 0;
};

export const openBigPicture = (picture) => {
  currentPicture = picture;
  
  imageElement.src = picture.url;
  
  captionElement.textContent = picture.description;
  likesCountElement.textContent = picture.likes;
  
  commentsCountElement.textContent = picture.comments.length;
  commentsLoadedElement.textContent = 0;
  
  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  
  commentsElement.textContent = '';
  numberOfLoadedComments = 0;
  loadComments();
  commentsLoaderElement.addEventListener('click', onLoadComments);
  
  window.addEventListener('keydown', onCloseBigPicture);
  bigPictureCancelElement.addEventListener('click', onCloseBigPicture);
};

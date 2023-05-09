const MAX_NUMBER_OF_HASH_TAGS = 5;
const MAX_HASH_TAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;

const SCALE_STEP = 25;
const SCALE_DEFAULT = 100;
const SCALE_MAX = 100;
const SCALE_MIN = 25;

const formElement = document.querySelector('.img-upload__form');

const pictureChoiceElement = document.querySelector('.img-upload__input');

const overlayElement = document.querySelector('.img-upload__overlay');

const scaleSmallerElement = document.querySelector('.scale__control--smaller');
const scaleBiggerElement = document.querySelector('.scale__control--bigger');
const scaleValueElement = document.querySelector('.scale__control--value');

const previewElement = document.querySelector('.img-upload__preview>img');

const hashTagsElement = document.querySelector('.text__hashtags');
const descriptionElement = document.querySelector('.text__description');

const cancelElement = document.querySelector('.img-upload__cancel');
const submitElement = document.querySelector('.img-upload__submit');

const effectElements = document.querySelectorAll('.effects__radio');

const pristine = new Pristine(formElement);

const validateHashTags = (hashTags) => {
  if (hashTags.length === 0) {
    return true;
  }

  const hashTagsList = hashTags.toLowerCase().split(' ');

  if (hashTagsList.length > MAX_NUMBER_OF_HASH_TAGS) {
    return false;
  }

  return hashTagsList.every((hashTag) => (/^#[a-zA-Z0-9]+$/g.test(hashTag) && hashTag.length <= MAX_HASH_TAG_LENGTH));
};

pristine.addValidator(hashTagsElement, validateHashTags, `Разрешено использовать до ${MAX_NUMBER_OF_HASH_TAGS} хэш-тегов разделённых пробелом. Хэщ-тег состоит из знака # после которого идут буквы и цифры, максимальная длина одного хэш-тега ${MAX_HASH_TAG_LENGTH} символов.`);

const validateDescription = (description) => {
  if (description.length > MAX_COMMENT_LENGTH) {
    return false;
  }
  
  return true;
};

pristine.addValidator(descriptionElement, validateDescription, `Максимум ${MAX_COMMENT_LENGTH} символов!`);

const resetForm = () => {
  pictureChoiceElement.value = null
  scaleValueElement.value = `${SCALE_DEFAULT}%`;
  effectElements.forEach((effect) => { effect.checked = effect.value === 'none'; });
  hashTagsElement.value = '';
  descriptionElement.value = '';
  
  previewElement.style.transform = '';
}

const onScaleSmaller = (event) => {
  let value = parseInt(scaleValueElement.value) - SCALE_STEP;
  if (value < SCALE_MIN) {
    value = SCALE_MIN;
  }
  scaleValueElement.value = `${value}%`;
  
  previewElement.style.transform = `scale(${value/100})`;
};

const onScaleBigger = (event) => {
  let value = parseInt(scaleValueElement.value) + SCALE_STEP;
  if (value > SCALE_MAX) {
    value = SCALE_MAX;
  }
  scaleValueElement.value = `${value}%`;
  
  previewElement.style.transform = `scale(${value/100})`;
};

const closeOverlay = () => {
  overlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  
  scaleSmallerElement.removeEventListener('click', onScaleSmaller);
  scaleBiggerElement.removeEventListener('click', onScaleBigger);
  
  cancelElement.removeEventListener('click', onCloseOverlay);
  window.removeEventListener('keydown', onCloseOverlay);
  
  resetForm();
}

const onCloseOverlay = (event) => {
  if (
    event.type === 'keydown' && (
      event.key !== 'Escape' ||
      document.activeElement === hashTagsElement ||
      document.activeElement === descriptionElement
    )
  ) {
    return false;
  }
  
  event.preventDefault();
  closeOverlay();
};

const onInvalidData = (message) => {
  submitElement.disabled = true;
  const oldText = submitElement.textContent;
  submitElement.textContent = message;
  setTimeout(() => {
    submitElement.textContent = oldText;
    submitElement.disabled = false;
  }, 3000);
}

const onSubmitForm = (event) => {
  if (!pristine.validate()) {
    event.preventDefault();
    onInvalidData('Неправильно заполнены поля!');
  }
}; 

const openOverlay = () => {
  overlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  
  scaleSmallerElement.addEventListener('click', onScaleSmaller);
  scaleBiggerElement.addEventListener('click', onScaleBigger);
  
  window.addEventListener('keydown', onCloseOverlay);
  cancelElement.addEventListener('click', onCloseOverlay);
  
  formElement.addEventListener('submit', onSubmitForm);
}

const onChangeFile = (event) => {
  event.preventDefault();
  openOverlay();
};

pictureChoiceElement.addEventListener('change', onChangeFile);

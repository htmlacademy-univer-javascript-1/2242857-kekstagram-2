import {sendPicture} from './api.js';
import {closeProcessing, showProcessing, showSuccess, showError} from './messages.js';

const MAX_NUMBER_OF_HASH_TAGS = 5;
const MAX_HASH_TAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;

const SCALE_STEP = 25;
const SCALE_DEFAULT = 100;
const SCALE_MAX = 100;
const SCALE_MIN = 25;

const Filters = {
  none: {
    effect: '',
    filter: '',
    min: 0,
    max: 0,
    step: 0,
    measurement: ''
  },
  chrome: {
    effect: 'chrome',
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    measurement: ''
  },
  sepia: {
    effect: 'sepia',
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    measurement: ''
  },
  marvin: {
    effect: 'marvin',
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    measurement: '%'
  },
  phobos: {
    effect: 'phobos',
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    measurement: 'px'
  },
  heat: {
    effect: 'heat',
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    measurement: ''
  }
};

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
const effectLevelElement = document.querySelector('.img-upload__effect-level');
const effectLevelSliderElement = document.querySelector('.effect-level__slider');
const effectLevelValueElement = document.querySelector('.effect-level__value');

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
  changeFilter(null);
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

const initSlider = () => {
  effectLevelElement.classList.add('hidden');
  noUiSlider.create(effectLevelSliderElement, {
    range: {
      min: 0,
      max: 0,
    },
    start: 0,
    step: 0,
    connect: 'lower',
    format: {
      to: function (value) {
        if (Number.isInteger(value)) {
          return value.toFixed(0);
        }
        return value.toFixed(1);
      },
      from: function (value) {
        return parseFloat(value);
      },
    },
  });
};

let currentFilter = null;

const changeFilter = (filter) => {
  if (currentFilter !== null && currentFilter.effect !== '') {
    previewElement.classList.remove(`effects__preview--${currentFilter.effect}`)
  }
  previewElement.style.filter = '';
  effectLevelValueElement.value = 0;
  effectLevelElement.classList.add('hidden');
  
  if (filter !== null) {
    currentFilter = filter;
    
    if (filter.step !== 0) {
      effectLevelElement.classList.remove('hidden');
      effectLevelSliderElement.noUiSlider.updateOptions({
        range: {
          min: filter.min,
          max: filter.max
        },
        start: filter.max,
        step: filter.step
      });
      
      changeFilterValue(filter.max);
    }
    
    if (filter.effect !== '') {
      previewElement.classList.add(`effects__preview--${currentFilter.effect}`)
    }
  }
};

const changeFilterValue = (value) => {
  effectLevelValueElement.value = value;
  
  if (currentFilter !== null && currentFilter.filter !== '') {
    previewElement.style.filter = `${currentFilter.filter}(${value}${currentFilter.measurement})`;
  } else {
    previewElement.style.filter = '';
  }
};

const onUpdateEffectValue = (values) => {
  changeFilterValue(values[0]);
};

const onChangeEffect = (event) => {
  event.preventDefault();
  changeFilter(Filters[event.target.value]);
};

const closeOverlay = () => {
  overlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  
  scaleSmallerElement.removeEventListener('click', onScaleSmaller);
  scaleBiggerElement.removeEventListener('click', onScaleBigger);
  
  effectElements.forEach((effect) => { effect.removeEventListener('change', onChangeEffect); });
  
  effectLevelSliderElement.noUiSlider.off('update');
  
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

const onSubmitForm = (event) => {
  event.preventDefault();
  
  if (!pristine.validate()) {
    showError('Неправильно заполнены поля!');
  } else {
    const processing = showProcessing('Загружаем...');
    sendPicture(new FormData(event.target), () => {
      closeProcessing(processing);
      closeOverlay();
      showSuccess('Изображение успешно загружено', 'Круто!');
    }, (errorMessage) => {
      closeProcessing(processing);
      showError('Ошибка загрузки файла', 'Загрузить другой файл');
    });
  }
}; 

const openOverlay = () => {
  overlayElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  
  previewElement.src = URL.createObjectURL(pictureChoiceElement.files[0]);
  
  scaleSmallerElement.addEventListener('click', onScaleSmaller);
  scaleBiggerElement.addEventListener('click', onScaleBigger);
  
  effectElements.forEach((effect) => { effect.addEventListener('change', onChangeEffect); });
  effectLevelSliderElement.noUiSlider.on('update', onUpdateEffectValue);
  changeFilter(Filters.none);
  
  window.addEventListener('keydown', onCloseOverlay);
  cancelElement.addEventListener('click', onCloseOverlay);
  
  formElement.addEventListener('submit', onSubmitForm);
}

const onChangeFile = (event) => {
  event.preventDefault();
  openOverlay();
};

pictureChoiceElement.addEventListener('change', onChangeFile);
initSlider();
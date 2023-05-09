const errorTemplate = document.querySelector('#error');

const onCloseError = (event) => {
  if (event.type === 'keydown' && event.key !== 'Escape') {
    return false;
  }
  
  const errorElement = event.target.closest('.error');
  
  if (
    event.type === 'click' &&
    event.target !== errorElement &&
    event.target !== errorElement.querySelector('.error__button')
  ) {
    return false;
  }
  
  event.preventDefault();
  closeError(errorElement);
};

export const closeError = (errorElement) => {
  errorElement.querySelector('.error__button').removeEventListener('click', onCloseError);
  window.removeEventListener('keydown', onCloseError);
  
  errorElement.remove();
};

export const showError = (text, buttonText = "OK") => {
  const fragment = errorTemplate.content.cloneNode(true);
  const errorElement = fragment.querySelector('.error');
  
  fragment.querySelector('.error__title').textContent = text;
  fragment.querySelector('.error__button').textContent = buttonText;
  
  errorElement.addEventListener('click', onCloseError);
  window.addEventListener('keydown', onCloseError);

  document.body.appendChild(fragment);
  
  return errorElement;
};



const successTemplate = document.querySelector('#success');

const onCloseSuccess = (event) => {
  if (event.type === 'keydown' && event.key !== 'Escape') {
    return false;
  }
  
  const successElement = event.target.closest('.success');
  
  if (
    event.type === 'click' &&
    event.target !== successElement &&
    event.target !== successElement.querySelector('.success__button')
  ) {
    return false;
  }
  
  event.preventDefault();
  closeSuccess(successElement);
};

export const closeSuccess = (successElement) => {
  window.removeEventListener('keydown', onCloseSuccess);
  successElement.removeEventListener('click', onCloseSuccess);
  
  successElement.remove();
};

export const showSuccess = (text, buttonText = "OK") => {
  const fragment = successTemplate.content.cloneNode(true);
  const successElement = fragment.querySelector('.success');
  
  fragment.querySelector('.success__title').textContent = text;
  fragment.querySelector('.success__button').textContent = buttonText;
  
  successElement.addEventListener('click', onCloseSuccess);
  window.addEventListener('keydown', onCloseSuccess);

  document.body.appendChild(fragment);
  
  return successElement;
};



const processingTemplate = document.querySelector('#messages');

export const closeProcessing = (closeElement) => {
  closeElement.remove();
};

export const showProcessing = (text) => {
  const fragment = processingTemplate.content.cloneNode(true);
  const processingElement = fragment.querySelector('.img-upload__message');
  
  processingElement.textContent = text;

  document.body.appendChild(fragment);
  
  return processingElement;
};

export const changeProcessingText = (processingElement, text) => {
  processingElement.textContent = text;
};
const ERROR_GET_PICTURES_MESSAGE = 'Не удалось загрузить картинки';
const ERROR_SEND_PICTURE_MESSAGE = 'Не удалось отправить форму. Попробуйте ещё раз';

const GET_PICTURES_URL = 'https://26.javascript.pages.academy/kekstagram/data';
const SEND_PICTURE_URL = 'https://26.javascript.pages.academy/kekstagram';

export const getPictures = (onSuccess, onFail) => {
  fetch(GET_PICTURES_URL)
    .then((response) => response.json())
    .then((photos) => {
      onSuccess(photos);
    }).catch(() => {
      onFail(ERROR_GET_PICTURES_MESSAGE);
    });
};

export const sendPicture = (data, onSuccess, onFail) => {
  fetch(SEND_PICTURE_URL, { method: 'POST', body: data })
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail(ERROR_SEND_PICTURE_MESSAGE);
      }
    })
    .catch(() => {
      onFail(ERROR_SEND_PICTURE_MESSAGE);
    });
};

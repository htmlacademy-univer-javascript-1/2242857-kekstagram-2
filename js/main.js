import {NUMBER_OF_PICTURES, generatePictureDescription} from './data.js';
import {addPictures} from './picture.js';
import './upload-image.js';

const pictureDescriptions = Array.from({length: NUMBER_OF_PICTURES}, generatePictureDescription);
addPictures(pictureDescriptions);

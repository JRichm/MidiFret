// base URL
const baseURL = `http://localhost:5550`

// import functions
import { openUploadMenu, uploadMidi } from './controller.mjs';


//id selectors
const uploadButton = document.getElementById('upload-button');
const submitBtn = document.getElementById('convert-button');

// event listeners
uploadButton.addEventListener('click', openUploadMenu);
submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    uploadMidi();
});



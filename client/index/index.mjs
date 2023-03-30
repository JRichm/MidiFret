// base URL
const baseURL = ``

// import functions
import { openUploadMenu, uploadMidi, loadSongs } from './index_controller.mjs';


//id selectors
const uploadButton = document.getElementById('upload-button');
const submitBtn = document.getElementById('convert-button');

// event listeners
uploadButton.addEventListener('click', openUploadMenu);
submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    uploadMidi();
});

loadSongs();
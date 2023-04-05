// base URL
const baseURL = ``

// import functions
import { openUploadMenu, uploadMidi, loadSongs } from './index_controller.mjs';


//id selectors
const uploadButton = document.getElementById('upload-button');
const submitBtn = document.getElementById('convert-button');
const siteTitle = document.getElementById('site-title');

// event listeners
siteTitle.addEventListener('click', goHome);
uploadButton.addEventListener('click', openUploadMenu);
submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    uploadMidi();
});

function goHome(e) {
    window.location.href = 'index.html';
}

loadSongs();
import { openTabs, uploadTabs } from './view_controller.mjs'

// document selectors
const popUpUploadButton = document.getElementById('final-upload-button');
const popUpBackButton = document.getElementById('final-back-button');
const publishButton = document.getElementById('publish-tabs-button');
const editButton = document.getElementById('edit-tabs-button');
const blackScreen = document.getElementById('blank');
const popUp = document.getElementById('pop-up');

const siteTitle = document.getElementById('site-title');
const homeButton = document.getElementById('home-button');



// event listeners
publishButton.addEventListener('click', showUploadMenu);
blackScreen.addEventListener('click', closeUploadScreen);
popUpBackButton.addEventListener('click', closeUploadScreen);
popUpUploadButton.addEventListener('click', uploadTabs);
siteTitle.addEventListener('click', goHome);
homeButton.addEventListener('click', goHome);


// front end functions
function showUploadMenu(e) {
    if (e) e.preventDefault();
    blackScreen.classList.remove('hidden');
    popUp.classList.remove('hidden');
}

function closeUploadScreen(e) {
    if (e) e.preventDefault();
    blackScreen.classList.add('hidden');
    popUp.classList.add('hidden');
}

function goHome(e) {
    window.location.href = 'index.html';
}

// open tabs when page opens
openTabs();
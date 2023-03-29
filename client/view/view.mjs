import { openTabs } from '../index/controller.mjs'

// open tabs when page opens
openTabs();

// document selectors
const publishButton = document.getElementById('publish-tabs-button');
const editButton = document.getElementById('edit-tabs-button');
const blackScreen = document.getElementById('blank');

// event listeners
publishButton.addEventListener('click', () => {
    blackScreen.classList.remove('hidden');
});

blackScreen.addEventListener('click', closeUploadScreen);

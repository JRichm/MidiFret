import { openTabs } from './controller.mjs'

// open tabs when page opens
openTabs();

// document selectors
const publishButton = document.getElementById('publish-tabs-button');
const editButton = document.getElementById('edit-tabs-button');
const blackScreen = document.getElementById('blank');

publishButton.addEventListener('click', () => {
    blackScreen.classList.remove('hidden');
});

import { openTabs, uploadTabs, closeEditor, saveEdit, saveTabEdits, updatePopUp, deleteTabs } from './view_controller.mjs'

// document selectors
const popUpUploadButton = document.getElementById('final-upload-button');
const popUpBackButton = document.getElementById('final-back-button');
const publishButton = document.getElementById('publish-tabs-button');
const saveTabsButton = document.getElementById('final-save-button');
const deleteTabsButton = document.getElementById('delete-tabs-button');
const finalDeleteButton = document.getElementById('delete');
const editButton = document.getElementById('edit-tabs-button');
const blackScreen = document.getElementById('blank');
const popUp = document.getElementById('pop-up');

const siteTitle = document.getElementById('site-title');
const homeButton = document.getElementById('home-button');
const tabBlock = document.getElementById(`tab-block`);

const editSaveButton = document.getElementById('save');
const editCloseButton = document.getElementById('close');

// event listeners
publishButton.addEventListener('click', showUploadMenu);
blackScreen.addEventListener('click', closeUploadScreen);
popUpBackButton.addEventListener('click', closeUploadScreen);
popUpUploadButton.addEventListener('click', uploadTabs);
siteTitle.addEventListener('click', goHome);
homeButton.addEventListener('click', goHome);
editButton.addEventListener('click', editTabs);
editSaveButton.addEventListener('click', saveEdit);
editCloseButton.addEventListener('click', closeEditScreen);
saveTabsButton.addEventListener('click', saveTabEdits);
deleteTabsButton.addEventListener('click', deleteTabsPopUp);
finalDeleteButton.addEventListener('click', deleteTabs);

// front end functions
function showUploadMenu(e) {
    if (e) e.preventDefault();
    blackScreen.classList.remove('hidden');
    popUp.classList.remove('hidden');
    if (publishButton.innerHTML === 'save tabs') {
        updatePopUp('Save Tabs?');
        saveTabsButton.classList.remove('hidden');
    }
}

function closeUploadScreen(e) {
    if (e) e.preventDefault();
    blackScreen.classList.add('hidden');
    popUp.classList.add('hidden');
    document.getElementById('noteEditor').classList.add('hidden');
    closeEditor();
}

function goHome(e) {
    window.location.href = 'index.html';
}

function editTabs() {
    if (tabBlock.className === 'hidden') {
        tabBlock.classList.remove('hidden');
    } else {
        tabBlock.classList.add('hidden');
    }
    
}

function closeEditScreen() {
    blackScreen.classList.add('hidden');
    document.getElementById('noteEditor').classList.add('hidden');
    closeEditor();
}

function deleteTabsPopUp() {
    document.getElementById('blank').classList.remove('hidden');
    document.getElementById('pop-up').classList.remove('hidden');
    updatePopUp('Delete Tabs?')
    finalDeleteButton.classList.remove('hidden');
}
// open tabs when page opens
openTabs();
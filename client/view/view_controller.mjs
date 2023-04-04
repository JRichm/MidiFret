// base URL
const baseURL = ``

const tabRow = document.getElementById('tab-row');
const noteEditor = document.getElementById('noteEditor');

var songName = document.getElementById('h2-song');
var artistName = document.getElementById('p-artist');

var songNameInput = document.getElementById('det-song-name');
var songArtistInput = document.getElementById('det-song-artist');
var songAuthorInput = document.getElementById('det-tab-author');


let tabData = []
let currentTabID;
let targetNoteID;
let editNoteInputs = document.getElementById('inputs').children;
let open;

export function openTabs() {
    currentTabID = undefined;
    axios.get(`${baseURL}/viewTab`).then((res) => {
        let tabInfo = res.data;

        songName.innerHTML = tabInfo[0][0];
        artistName.innerHTML = tabInfo[0][1];
        currentTabID = tabInfo[0][2];
        
        if (currentTabID > 0) {
            document.getElementById('publish-tabs-button').innerHTML = 'save tabs'
        } else {
            document.getElementById('delete-tabs-button').classList.add('hidden');
        }

        tabData = tabInfo[1]

        createTabDisplayElement(tabData);
    });
}

export function uploadTabs(e) {
    updatePopUp(`Uploading Tab...\nplease wait.`);
    if (e) e.preventDefault();
    let tabObj = {
        songName: songNameInput.value,
        songArtist: songArtistInput.value,
        songAuthor: songAuthorInput.value,
        tabData: tabData
    }
    axios.post(`${baseURL}/uploadTab`, tabObj).then((res) => {
        updatePopUp(res.data);
    }).catch((err) => console.log(err));
}

function createTabDisplayElement (tabData) {
    let measureData = [];
    let measures = 0;

    for (let c = 0; c < tabData.length; c++) {
        measureData.push(tabData[c]);

        if (measureData.length === 32) {
            let tabMeasure = document.createElement('div');
            tabMeasure.id = ('tab-measure');

            for (let i = 0; i < measureData.length; i++) { 
                let tabColumn = document.createElement('p');
                let columnData = '';
        
                for (let j in measureData[i]) {
                    columnData += measureData[i][j];
                }
            
                tabColumn.innerHTML = columnData;
                tabColumn.id = (`${c + i - 31}`);
                tabColumn.addEventListener('click', changeNote);

                tabMeasure.appendChild(tabColumn);
            }

            let measureEnd = document.createElement('p');
            measureEnd.innerHTML = '||||||';
            tabMeasure.appendChild(measureEnd);
            tabRow.appendChild(tabMeasure);
                    
            measures++;
            measureData = [] 
        } 
    } 
} 
 
export function updatePopUp(string) { 
    document.getElementById('detail-column').classList.add('hidden');
    document.getElementById('pop-up-banner').classList.add('hidden');
    document.getElementById('final-upload-button').classList.add('hidden');

    // let message = document.createElement('p');
    let message = document.getElementById('message');
    message.classList.remove('hidden');
    message.id = 'message'
    message.innerHTML = string;
    
    document.getElementById('details').appendChild(message);
}

function changeNote(e) {
    if (e.target.nodeName === 'P') {
        targetNoteID = e.target.id;
        let currentNote = e.target.innerHTML.split('');

        for (let i = 0; i < editNoteInputs.length; i++) {
            editNoteInputs[i].value = currentNote[i];
        }

        document.getElementById('blank').classList.remove('hidden');
        noteEditor.classList.remove('hidden');
        e.target.appendChild(noteEditor);
    }    
}

export function saveEdit(e) {
    let newColumn = tabData[targetNoteID];
    document.getElementById(`${targetNoteID}`).innerHTML = '';
    for (let i = 0; i < editNoteInputs.length; i++) {
        newColumn[i] = editNoteInputs[i].value;
        document.getElementById(`${targetNoteID}`).innerHTML += newColumn[i];
    }
    document.getElementById('blank').classList.add('hidden');
    noteEditor.classList.add('hidden');
    open = false;
}

export function closeEditor() {
    open = false;
}

export function saveTabEdits(e) {
    if (e) e.preventDefault();
    let editedTabObj = {
        tabID: currentTabID,
        songName: document.getElementById('h2-song').innerHTML,
        songArtist: document.getElementById('p-artist').innerHTML,
        tabData: tabData
    }
    axios.put(`/saveTabEdits?tabID=${currentTabID}`, editedTabObj).then(res => {
        document.getElementById('final-save-button').classList.add('hidden');
        updatePopUp(res.data);
    }).catch(err => console.log(err));
}

export function deleteTabs(e) {
    if (e) e.preventDefault();
    axios.delete(`/deleteTabs?tabID=${currentTabID}`).then(res => {
        console.log(res.data);
        updatePopUp(res.data);
        document.getElementById('delete').classList.add('hidden');
        setTimeout(() => window.location.href = 'index.html');
    }).catch(err => console.log(err));
}
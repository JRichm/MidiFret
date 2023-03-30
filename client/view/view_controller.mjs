
// base URL
const baseURL = `http://localhost:5550`

const tabRow = document.getElementById('tab-row');

var songName = document.getElementById('h2-song');
var artistName = document.getElementById('p-artist');

var songNameInput = document.getElementById('det-song-name');
var songArtistInput = document.getElementById('det-song-artist');
var songAuthorInput = document.getElementById('det-tab-author');

let tabData = []

export function openTabs() {
    axios.get(`${baseURL}/viewTab`).then((res) => {
        let tabInfo = res.data;

        songName.innerHTML = tabInfo[0][0];
        artistName.innerHTML = tabInfo[0][1];

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
                tabMeasure.appendChild(tabColumn);
            }

            let measureEnd = document.createElement('p');
            measureEnd.innerHTML = '||||||';
            tabMeasure.appendChild(measureEnd);
            tabRow.appendChild(tabMeasure);
                    
            measures++;
            console.log(measures);
            measureData = []
        }
    }
}

function updatePopUp(string) {
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

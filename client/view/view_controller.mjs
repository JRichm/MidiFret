
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

        createTabDisplayElement(tabInfo[1]);
    });
}

export function uploadTabs(e) {
    if (e) e.preventDefault();
    let tabObj = {
        songName: songNameInput.value,
        songArtist: songArtistInput.value,
        songAuthor: songAuthorInput.value,
        tabData: tabData
    }
    axios.post(`${baseURL}/uploadTab`, tabObj).then((res) => {
        res.status(200).send('tab sent successfully');
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
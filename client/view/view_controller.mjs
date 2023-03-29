
// base URL
const baseURL = `http://localhost:5550`

const tabRow = document.getElementById('tab-row');

var songName = document.getElementById('det-song-name');
var songArtist = document.getElementById('det-song-artist');
var songAuthor = document.getElementById('det-tab-author');

let tabData = []

export function openTabs() {
    axios.get(`${baseURL}/viewTab`).then((res) => {
        tabData = res;
        console.log(`fart`)
        console.log(res);
        createTabDisplayElement(tabData);
    });
}

export function uploadTabs(e) {
    if (e) e.preventDefault();
    let tabObj = {
        songName: songName.value,
        songArtist: songArtist.value,
        songAuthor: songAuthor.value,
        tabData: tabData
    }
    axios.post(`${baseURL}/uploadTab`, tabObj).then((res) => {
        res.status(200).send('tab sent successfully');
    }).catch((err) => console.log(err));
}

function createTabDisplayElement (res) {
    console.log(res.data);
    let measureData = [];
    let measures = 0;

    let tabInfo = res.data[0]
    let tabData = res.data[1];

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
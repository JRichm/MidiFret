
// base URL
const baseURL = `http://localhost:5550`

// document selectors
const uploadButton = document.getElementById('upload-button');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('fileInput');
const status = document.getElementById('status');
const loadingBar = document.getElementById('loading');

// import midi-parser-js
import { MidiParser } from '/midi-parser.js'

// hard coded tuning, converter will recommend a tuning after converting and ask user for changes
const standardTuning = [40, 45, 50, 55, 59, 64];
const dropTuning = [37, 42, 47, 52, 56, 61];
const noteTimeIncr = 48;

let tuning = standardTuning;

// front end functions
export function loadSongs() {
    axios.get(`/allTabs`).then((res) => {
        console.log(res.data);
        let songList = res.data;

        for (let i = 0; i < songList.length; i++) {
            let listElement = document.createElement('li');
            listElement.classList.add(`${songList[i].tab_id}`);

            let songInfo = document.createElement('div');
            songInfo.id = 'song-info';

            let songName = document.createElement('p');
            songName.innerHTML = songList[i].song_name;
            songInfo.appendChild(songName);

            let songArtist = document.createElement('p');
            songArtist.innerHTML = songList[i].artist_name;
            songInfo.appendChild(songArtist);

            let tabAuthor = document.createElement('p');
            tabAuthor.innerHTML = songList[i].username;
            songInfo.appendChild(tabAuthor);

            listElement.appendChild(songInfo);
            document.getElementById('song-list').appendChild(listElement);
            
            listElement.addEventListener('click', openTabFromList);
        }
    });
}

export function openUploadMenu() {
    document.getElementById('blank').classList.remove('hidden');
    uploadArea.classList.remove('hidden');
    uploadButton.style = 'width:100%;'
    uploadButton.id = 'upload-button-expanded';
    document.getElementById('search-area').classList.add('hidden');
    console.log('upload button clicked');
}

export function uploadMidi() {
    const file = fileInput.files[0];
    if (!file) {
        status.innerText = 'Please select a file.';
        return;
    }
    if (file.type !== 'audio/mid') {
        status.innerText = 'File must be .mid or .midi';
        return;
    }
    if (file.size > 1000000000) {
        status.innerText = 'File too large.';
        return;
    }
    status.innerText = 'Uploading file...';
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
        status.innerText = `Processing file...`

        //loading bar
        for( let i = 0; i < 10; i++) {
            setTimeout(() => loadingBar.innerText = `🎸|`, i * 1000);
            setTimeout(() => loadingBar.innerText = `🎸|-`, i * 1000 + 31);
            setTimeout(() => loadingBar.innerText = `🎸|-♩`, i * 1000 + 62);
            setTimeout(() => loadingBar.innerText = `🎸|-♩-`, i * 1000 + 93);
            setTimeout(() => loadingBar.innerText = `🎸|-♩--`, i * 1000 + 124);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---`, i * 1000 + 155);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩`, i * 1000 + 186);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-`, i * 1000 + 217);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫`, i * 1000 + 282);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-`, i * 1000 + 274);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|`, i * 1000 + 310);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-`, i * 1000 + 341);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩`, i * 1000 + 372);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩-`, i * 1000 + 403);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩--`, i * 1000 + 434);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---`, i * 1000 + 475);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩`, i * 1000 + 500);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-`, i * 1000 + 531);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫`, i * 1000 + 562);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫-`, i * 1000 + 593);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫-|`, i * 1000 + 624);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫-|-`, i * 1000 + 655);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫-|-♪`, i * 1000 + 686);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫-|-♪-`, i * 1000 + 717);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫-|-♪-♪`, i * 1000 + 748);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫-|-♪-♪-`, i * 1000 + 779);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫-|-♪-♪-♪`, i * 1000 + 810);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫-|-♪-♪-♪-`, i * 1000 + 841);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫-|-♪-♪-♪-♩`, i * 1000 + 872);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫-|-♪-♪-♪-♩-`, i * 1000 + 903);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫-|-♪-♪-♪-♩-|`, i * 1000 + 934);
            setTimeout(() => loadingBar.innerText = `🎸|-♩---♩-♫-|-♩---♩-♫-|-♪-♪-♪-♩-|-`, i * 1000 + 965);
        }

        setTimeout(() => convertMidi(reader.result), 500);
    }   
}

// converter functions
export function convertMidi(fileData) {
    let noteList = [];
    // convert file data into 8bit array
    const uint8Array = new Uint8Array(fileData);

    // parse midi file
    const midiFile = MidiParser.parse(uint8Array, (obj) => console.log(obj));

    for (let i in midiFile.track) {

        // loop through events of each track 
        for (let j in midiFile.track[i].event) {
            // handle various midi events
            let event = midiFile.track[i].event[j];
            let data = { type: -1, note: -1, delta: 0, };
            console.log(event);
            switch(event.type) {
            // note off
            case 8: 
                data = { type: 0, note: event.data[0], delta: event.deltaTime };
                noteList.push(data);
                // console.log(`${j} t:${event.type} ${event.data[0]} with delta:${event.deltaTime}`);
                break;
    
            // note on
            case 9: 
                data = { type: 1, note: event.data[0], delta: event.deltaTime };
                noteList.push(data);
                // console.log(`${j} t:${event.type} ${event.data[0]} with delta:${event.deltaTime}`);
                break;
    
            // controller
            case 11: 
                data = { type: `controller`, channel: event.channel, data: event.data };
                // console.log(` ${j} t:${event.type} ch:${event.channel} delta:${event.deltaTime} - ${event.data}`);
                break;
    
            // program change
            case 12: 
                data = { type: `program change`, channel: event.channel, data: event.data };
                // console.log(` ${j} t:${event.type} ch:${event.channel} delta:${event.deltaTime} - ${event.data}`);
                break;
    
                // meta event
            case 255: 
                data = { type: `meta event`, metaType: event.metaType, data: event.data };
                // console.log(` ${j} t:${event.type} m:${event.metaType} delta:${event.deltaTime} - ${event.data}`);
                break;
    
            default:
                // console.log(` ${j} t:${event.type} delta:${event.deltaTime} - ${event.data}`);
                data = { type: event.type, note: `index: ${j}`, delta: event.deltaTime };
                break;
            }
        }
    }

    console.log(noteList);
    axios.post(`/newTab`, noteList).then((res) => {
        window.location.href = 'view.html';
    }).catch((err) => console.log(err));
}

function openTabFromList(e) {
    let targetTabID = e.target.parentElement.className;
    console.log(targetTabID);
    if(!targetTabID) {
        location.reload();
        return;
    }

    axios.get(`/tab?tab_id=${targetTabID}`).then((res) => {
        window.location.href ='view.html';
    }).catch((err) => console.log(err));
}
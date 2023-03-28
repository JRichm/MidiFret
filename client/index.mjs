// base URL
const baseURL = `http://localhost:5550`

// import functions
import { openUploadMenu, uploadMidi } from './controller.mjs';


//id selectors
const uploadButton = document.getElementById('upload-button');
const submitBtn = document.getElementById('convert-button');
const songNameInput = document.getElementById('new-song-name');
const songArtistInput = document.getElementById('new-song-artist');

// event listeners
uploadButton.addEventListener('click', openUploadMenu);
submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    console.log(songNameInput.value);
    console.log(songArtistInput.value);

    if (!songNameInput.value)
        if(!songArtistInput.value) alert(`Please enter 'Song Name' and 'Artist Name'.`);
        else alert(`Please enter 'Song Name'.`);
    else if (!songArtistInput.value) alert(`Please enter 'Artist Name'.`)

    let songInfo = [songNameInput.value, songArtistInput.value];
    uploadMidi(songInfo);
});



const standardTuning = [40, 45, 50, 55, 59, 64];
const noteTimeIncr = 48;

let currentTabInView = [];
let currentSongInfo = [];

module.exports = {
    writeTabs: (noteData) => {
        let tuning = standardTuning;
        let tabData = [];
        let notes = 0;
        let writing = true;
        let emptyTabColumn = ['-', '-', '-', '-', '-', '-'];
    
        while (writing) {
            if (noteData[notes] === undefined) {
            console.log(`\n error reading note data`)
            console.log(`${noteData[notes]} @ ${notes}`);
            console.log(noteData);
            writing = false;
    
            // check if note event type is 'on'
            } else if (noteData[notes].type === 1) {
                let noteDelta = +noteData[notes].delta / noteTimeIncr;
    
                // add length to previous note if necessary 
                for (let i = 0; i < noteDelta; i++) {
                   tabData.push(emptyTabColumn);
                   tabData.push(emptyTabColumn);
                }

                //loop through tuning array, starting at last index and couting down
                for (let j = tuning.length - 1; j >= 0; j--) {
                    if (noteData[notes].note >= tuning[j]) {
                      let newTabColumn = [...emptyTabColumn];
                      newTabColumn[tuning.length - j - 1] = noteData[notes].note - tuning[j];
                      tabData.push(emptyTabColumn);
                      tabData.push(newTabColumn);
                      notes++;
                      j = 0;
                    }
                }

            // check if note event type is 'off'
            } else if (noteData[notes].type === 0) {
            notes++;
            }
    
            if (notes > noteData.length - 1) writing = false;
        }
        currentTabInView = tabData;
    },

    getCurrentTab: () => {
        return [currentSongInfo, currentTabInView];
    },

    setCurrentTabInfo: (name, artist) => {
        currentSongInfo = [name, artist];
    }
}

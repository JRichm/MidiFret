const Sequelize = require('sequelize');
require('dotenv').config();

const { CONNECTION_STRING } = process.env;
const {SERVER_PORT} = process.env;

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '8fcebd61630f476f99939534f9aac57b',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const standardTuning = [40, 45, 50, 55, 59, 64];
const noteTimeIncr = 48;

let currentTabInView = [];
let currentSongInfo = [];

module.exports = {
    writeTabs: (noteData) => {
        setCurrentTabInfo(undefined, undefined, undefined);
        let emptyTabColumn = ['-', '-', '-', '-', '-', '-'];
        let tuning = standardTuning;
        
        let tabData = [];

        // loop through data from midi converter
        for (let i = 0; i < noteData.length; i++) {

            // check if note event type is 'on'
            if (noteData[i].type === 1) {

                // check spacing between previous note
                if (noteData[i].delta > 0) {
                    let spacesToAdd = noteData[i].delta / 24;

                    // push empty spaces to data array
                    for (let h = 0; h < spacesToAdd; h++) {
                        tabData.push(emptyTabColumn);
                    }
                }
                
                // get data from note and select lowest playable fret
                for (let j = tuning.length - 1; j >= 0; j--) {
                    if (noteData[i].note >= tuning[j]) {
                      let newTabColumn = [...emptyTabColumn];

                      // push converted tab dat to data array
                      newTabColumn[tuning.length - j - 1] = noteData[i].note - tuning[j];
                      tabData.push(newTabColumn);
                      j = 0;
                    }
                }

            // check if note event type is 'off'
            } else if (noteData[i].type === 0) {

                // check how long note lasts
                let spacesToAdd = (noteData[i].delta / 24) - 1;
                console.log(spacesToAdd);

                // push empty spaces to data array
                for (let h = 0; h < spacesToAdd; h++) {
                    tabData.push(emptyTabColumn);
                }

            }
        }


        // let tuning = standardTuning;
        // let tabData = [];
        // let notes = 0;
        // let writing = true;
        // let emptyTabColumn = ['-', '-', '-', '-', '-', '-'];
    
        // while (writing) {
        //     if (noteData[notes] === undefined) {
        //     writing = false;
    
        //     // check if note event type is 'on'
        //     } else if (noteData[notes].type === 1) {
        //         console.log(noteData[notes].delta);
        //         let noteDelta = +noteData[notes].delta / noteTimeIncr;
    
        //         // add length to previous note if necessary 
        //         for (let i = 0; i < noteDelta; i++) {
        //            tabData.push(emptyTabColumn);
        //            tabData.push(emptyTabColumn);
        //         }

        //         //loop through tuning array, starting at last index and couting down
                // for (let j = tuning.length - 1; j >= 0; j--) {
                //     if (noteData[notes].note >= tuning[j]) {
                //       let newTabColumn = [...emptyTabColumn];
                //       newTabColumn[tuning.length - j - 1] = noteData[notes].note - tuning[j];
                //       tabData.push(emptyTabColumn);
                //       tabData.push(newTabColumn);
                //       notes++;
                //       j = 0;
                //     }
                // }

        //     // check if note event type is 'off'
        //     } else if (noteData[notes].type === 0) {
        //     notes++;
        //     }
    
            // if (notes > noteData.length - 1) writing = false;
        // }

        currentTabInView = tabData;
    },

    uploadTabs: (req, res) => {
        let { songName, songArtist, songAuthor, tabData } = req.body;
        let tabDataString = '';
        let artistID;
        let authorID;

        // check if artist exists in db
        sequelize.query(`
            SELECT * FROM artist_table
            WHERE artist_name = '${songArtist}'
        `).then(DBRES => {
            if (DBRES[0].length === 0) {
                sequelize.query(`
                    INSERT INTO artist_table (artist_name) VALUES
                    ('${songArtist}');
            `).then(DBRES => {
                sequelize.query(`
                    SELECT * FROM artist_table
                    WHERE artist_name = '${songArtist}'
            `).then(DBRES => {
                artistID = DBRES[0][0].artist_id;
            })});

            } else { sequelize.query(`
                SELECT * FROM artist_table
                WHERE artist_name = '${songArtist}'
            `).then(DBRES => {
                artistID = DBRES[0][0].artist_id
            })}
        });

        // check if username exists in db
        sequelize.query(`
            SELECT * FROM users_table
            WHERE username = '${songAuthor}'
        `).then(DBRES => {
            if (DBRES[0].length === 0) {
                sequelize.query(`
                    INSERT INTO users_table (username) VALUES
                    ('${songAuthor}');
            `).then(DBRES => { 
                sequelize.query(`
                    SELECT * FROM users_table
                    WHERE username = '${songAuthor}'
            `).then(DBRES => {
                authorID = DBRES[0][0].user_id
            })});

            } else { sequelize.query(`
                SELECT * FROM users_table
                WHERE username = '${songAuthor}'
            `).then(DBRES => {
                authorID = DBRES[0][0].user_id
            })}
        });

        // serialize tabData into a string for upload
        for (let c = 0; c < tabData.length; c++) {
            let newColumns = '['
            newColumns += tabData[c].toString() + ']';
            tabDataString += newColumns;
        }

        setTimeout(() => {
            sequelize.query(`
                INSERT INTO tab_table (song_name, artist_id, author_id, tab_data) VALUES
                ('${songName}', ${artistID}, ${authorID}, '${tabDataString}');
            `).then(DBRES => res.status(200).send('Tab uploaded successfully!'))
            .catch(err => res.status(400).send(err));
        }, 2000);
    },

    getCurrentTab: () => {
        return [currentSongInfo, currentTabInView];
    },
    
    returnAllTabs: (req, res) => {
        sequelize.query(`
            SELECT tab_table.tab_id, tab_table.song_name, artist_table.artist_name, users_table.username
            FROM tab_table
            JOIN artist_table ON tab_table.artist_id = artist_table.artist_id
            JOIN users_table ON tab_table.author_id = users_table.user_id;
            `).then(DBRES => {
                res.status(200).send(DBRES[0]);
            });
    },

    returnTab: (req, res) => {
        sequelize.query(`
            SELECT * FROM tab_table
            WHERE tab_id = ${req.query.tab_id}
        `).then(DBRES => {
            sequelize.query(`
                SELECT * FROM artist_table 
                WHERE artist_id = ${DBRES[0][0].artist_id}
            `).then(res => setCurrentTabInfo(DBRES[0][0].song_name, res[0][0].artist_name, DBRES[0][0].tab_id));            

            // Sample input string
            const input_str = DBRES[0][0].tab_data;

            // Split the input string into an array of repeating sections
            const sections = input_str.split('][');

            // Remove the opening and closing brackets from the first and last sections
            sections[0] = sections[0].replace('[', '');
            sections[sections.length-1] = sections[sections.length-1].replace(']', '');

            // Split each section into an array of values
            const values = sections.map(section => section.split(','));

            // Create the 2D array
            const tab_data = values.map(section => section.map(value => value.trim()));

            // Output the result
            currentTabInView = tab_data;

            res.status(200).send(`Tab opened successfully!`);
        });
    }, 

    updateTabs: (req, res) => {
        let { tabID, songName, songArtist, tabData } = req.body;
        let query = req.query;
        let serializedTabData = '';

        // console.log(query);
        // console.log(tabID);
        // console.log(songName);
        // console.log(songArtist);
        // console.log(tabData);

        // serialize tabData into a string for upload
        for (let c = 0; c < tabData.length; c++) {
            let newColumns = '['
            newColumns += tabData[c].toString() + ']';
            serializedTabData += newColumns;
        }

        sequelize.query(`
            UPDATE tab_table
            SET tab_data = '${serializedTabData}'
            WHERE tab_id = ${tabID}
        `).then(DBRES => res.send(`Tab edits saved successfully!`));
    }
}


function setCurrentTabInfo(name, artist, id) {
    console.log(`setCurrentTabInfo()`);
    currentSongInfo = [name, artist, id];
    console.log(currentSongInfo);
}
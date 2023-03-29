const Sequelize = require('sequelize');
require('dotenv').config();

const { CONNECTION_STRING } = process.env;

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});

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

    uploadTabs: (req, res) => {
        let { songName, songArtist, songAuthor } = req.body;
        let tabData = req.body.tabData.data[1];
        let tabDataString = '';
        let artistID;
        let authorID;

        console.log(tabDataString);

        // check if artist exists in db
        sequelize.query(`
            SELECT * FROM artist_table
            WHERE artist_name = '${songArtist}'
        `).then(DBRES => {
            if (DBRES[0].length === 0) {
                console.log(`artist ${songArtist} not found in db`)
                sequelize.query(`
                    INSERT INTO artist_table (artist_name) VALUES
                    ('${songArtist}');
            `).then(DBRES => {
                console.log(`${songArtist} inserted into db`)
                sequelize.query(`
                    SELECT * FROM artist_table
                    WHERE artist_name = '${songArtist}'
            `).then(DBRES => {
                artistID = DBRES[0][0].artist_id;
                console.log(`${songArtist}'s artist_is is ${artistID}`)
            })});

            } else { sequelize.query(`
                SELECT * FROM artist_table
                WHERE artist_name = '${songArtist}'
            `).then(DBRES => {
                artistID = DBRES[0][0].artist_id
                console.log(`artist ${songArtist} found in db with an id of ${artistID}`);
            })}

            
        });

        // check if username exists in db
        sequelize.query(`
            SELECT * FROM users_table
            WHERE username = '${songAuthor}'
        `).then(DBRES => {
            if (DBRES[0].length === 0) {
                console.log(`username ${songAuthor} not found in db`)
                sequelize.query(`
                    INSERT INTO users_table (username) VALUES
                    ('${songAuthor}');
            `).then(DBRES => { 
                console.log(`${songAuthor} inserted into db`);
                sequelize.query(`
                    SELECT * FROM users_table
                    WHERE username = '${songAuthor}'
            `).then(DBRES => {
                authorID = DBRES[0][0].user_id
                console.log(`${songAuthor}'s user_id is ${authorID}`)
            })});

            } else { sequelize.query(`
                SELECT * FROM users_table
                WHERE username = '${songAuthor}'
            `).then(DBRES => {
                authorID = DBRES[0][0].user_id
                console.log(`username ${songAuthor} found in db with an id of ${authorID}`);
                
                // serialize tabData into a string for upload
                for (let c = 0; c < tabData.length; c++) {
                    let newColumns = '['
                    newColumns += tabData[c].toString() + ']';
                    tabDataString += newColumns;
                }
            })}
        });

        setTimeout(() => {
            sequelize.query(`
                INSERT INTO tab_table (song_name, artist_id, author_id, tab_data) VALUES
                ('${songName}', ${artistID}, ${authorID}, '${tabDataString}');
            `).then(DBRES => res.status(200).send('tab uploaded successfully'))
        }, 2000);
    },

    getCurrentTab: () => {
        return [currentSongInfo, currentTabInView];
    },

    setCurrentTabInfo: (name, artist) => {
        currentSongInfo = [name, artist];
    },

    returnAllTabs: (req, res) => {
        sequelize.query(`
            SELECT tab_table.song_name, artist_table.artist_name, users_table.username
            FROM tab_table
            JOIN artist_table ON tab_table.artist_id = artist_table.artist_id
            JOIN users_table ON tab_table.author_id = users_table.user_id;
            `).then(DBRES => {
                console.log(DBRES[0]);
                res.status(200).send(DBRES[0])
            });
    }
}

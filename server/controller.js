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
        currentTabInView = [...tabData];
    },

    uploadTabs: (req, res) => {
        let { songName, songArtist, songAuthor, tabData } = req.body;
        let tabDataString = '';
        let artistID;
        let authorID;

        console.log(`\n this is my tab data:`);
        console.log(tabData);

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
            console.log(newColumns);
            tabDataString += newColumns;
        }

        setTimeout(() => {
            sequelize.query(`
                INSERT INTO tab_table (song_name, artist_id, author_id, tab_data) VALUES
                ('${songName}', ${artistID}, ${authorID}, '${tabDataString}');
            `).then(DBRES => res.status(200).send('tab uploaded successfully'))
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
            `).then(res => setCurrentTabInfo(DBRES[0][0].song_name, res[0][0].artist_name));            

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
    }
}


function setCurrentTabInfo(name, artist) {
    currentSongInfo = [name, artist];
}
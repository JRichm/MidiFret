const express = require('express');

const app = express();

app.use(express.json());

console.log(__dirname);

app.use(express.static(`${__dirname}/../client`));
app.use(express.static(`${__dirname}/../node_modules/midi-parser-js/src/`));

const { writeTabs, getCurrentTab, setCurrentTabInfo } = require('./controller')

app.post('/newTab', (req, res) => {
    let { songName, artistName } = req.query;
    setCurrentTabInfo(songName, artistName)
    writeTabs(req.body);
    res.status(200).send('request received on backend');
});

app.get('/viewTab', (req, res) => {
    console.log(getCurrentTab());
    res.status(200).send(getCurrentTab());
});

// app.get('/', (req, res) => {
//     res.sendFile(__dirname +'/../../client/index.html');
// });

// app.get('/view', (req, res) => {
//     res.sendFile(__dirname + '/../../client/view.html')
// })

// app.get('/css', (req, res) => {
//     res.sendFile(__dirname + '/../../client/css/main.css');
// });

// app.get('/js', (req, res) => {
//     res.sendFile(__dirname + '/../../client/index.mjs');
// });

app.listen(5550, () => console.log(`app is up on 5550`));
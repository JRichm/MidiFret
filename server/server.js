const express = require('express');

const app = express();
const {SERVER_PORT} = process.env;

app.use(express.json());

console.log(__dirname);

app.use(express.static(`${__dirname}/../client/index/`));
app.use(express.static(`${__dirname}/../client/view`));
app.use(express.static(`${__dirname}/../node_modules/midi-parser-js/src/`));

const { writeTabs, getCurrentTab, setCurrentTabInfo, returnAllTabs, uploadTabs, returnTab } = require('./controller')

app.post('/newTab', (req, res) => {
    writeTabs(req.body);
    res.status(200).send('request received on backend');
});

app.get('/viewTab', (req, res) => {
    console.log(getCurrentTab());
    res.status(200).send(getCurrentTab());
});

app.post('/uploadTab', uploadTabs);

app.get('/allTabs', returnAllTabs);

app.get('/tab', returnTab);

app.listen(5550, () => console.log(`app is up on 5550`));
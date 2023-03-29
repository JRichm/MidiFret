const express = require('express');

const app = express();

app.use(express.json());

console.log(__dirname);

app.use(express.static(`${__dirname}/../client/index/`));
app.use(express.static(`${__dirname}/../client/`));
app.use(express.static(`${__dirname}/../client/view`));
app.use(express.static(`${__dirname}/../node_modules/midi-parser-js/src/`));

const { writeTabs, getCurrentTab, setCurrentTabInfo } = require('./controller')

app.post('/newTab', (req, res) => {
    writeTabs(req.body);
    res.status(200).send('request received on backend');
});

app.get('/viewTab', (req, res) => {
    console.log(getCurrentTab());
    res.status(200).send(getCurrentTab());
});

app.post('/uploadTab', (req, res) => {
    console.log(req.body);
});

app.listen(5550, () => console.log(`app is up on 5550`));
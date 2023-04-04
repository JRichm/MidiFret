const express = require('express');

const app = express();
const { CONNECTION_STRING } = process.env;
const {SERVER_PORT} = process.env;

app.use(express.json());

app.use(express.static(`${__dirname}/../client/index/`));
app.use(express.static(`${__dirname}/../client/view`));
app.use(express.static(`${__dirname}/../node_modules/midi-parser-js/src/`));
app.use(express.static(`${__dirname}/../server`));

const { returnTab, returnAllTabs, getCurrentTab, writeTabs, uploadTabs, updateTabs, deleteTabs } = require('./controller');

// app.get('/', (req, res) => {
//     res.sendFile('/../client/index/index.html');
// })


app.get('/tab', returnTab);

app.get('/allTabs', returnAllTabs);

app.get('/viewTab', (req, res) => {
    res.status(200).send(getCurrentTab());
});

app.post('/newTab', (req, res) => {
    writeTabs(req.body);
    res.status(200).send('request received on backend');
});

app.post('/uploadTab', uploadTabs);

app.put('/saveTabEdits', updateTabs);

app.delete(`/deleteTabs`, deleteTabs);

app.listen(5550, () => console.log(`app is up on 5550`));
var express = require('express');
var app = express();
const inports = require("./data/testdata.json");
let port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('hello mother fuckers');
});

app.get('/ranks', (req, res) => {
    res.send(inports);
});

app.listen(port, () => {

    console.log('Server is listening on port 3000');
});
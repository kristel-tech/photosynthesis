var express = require('express');
var app = express();
const inports = require("./data/testdata.json");
let port = process.env.PORT || 3000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static("jsfiles"));
app.use(express.static("audio"));
app.use(express.static("css"));

app.get('/', (req, res) => {
    res.render("pages/index");
});


app.get('/ranks', (req, res) => {
    res.send(inports);
});

app.listen(port, () => {

    console.log('Server is listening on port 3000');
});
const express = require('express');
const app = express();



const connect = require("./database/databasesetup.js");
let port = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static("css"));
app.use(express.static("jsfiles"));
app.use(express.static("audio"));
app.use(express.static("assets"));

app.get('/', (req, res) => {
    res.render("pages/index");
});

// TODO use correct request method needs to be PUT
app.put('/addconfig', (req, res) => {
    let dbconnectinst = new connect();
    dbconnectinst.SetConfigData(req, res, '/addconfig');
});

// TODO use correct request method needs to be POST
app.post('/getconfig', (req, res) => {
    let dbconnectinst = new connect();
    dbconnectinst.GetConfigData(req, res, '/getconfig');
});

// TODO use correct request method needs to be PUT
app.post('/updateconfig', (req, res) => {
    let dbconnectinst = new connect();
    dbconnectinst.UpdateConfigData(req, res, '/updateconfig');
});

// TODO use correct request method needs to be DELETE
app.put('/deleteconfig', (req, res) => {
    let dbconnectinst = new connect();
    dbconnectinst.DeleteConfigData(req, res, '/deleteconfig');
});





app.listen(port, () => {

    console.log('Server is listening on port 3000');
});
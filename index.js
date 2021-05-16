const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const inports = require("./data/testdata.json");
const connect = require("./database/databasesetup.js");
let port = process.env.PORT || 3000;


// connect.SetConfigData({
//     USERID: 23452345,
//     CONFIGNAME: 'mods',
//     JSONDATA: 'sfasfasdfasasf'
// });
// console.log(connect({
//     USERID: 23452345,
// }))

app.set('views', './views');
app.set('view engine', 'ejs');


app.use(express.static("jsfiles"));
app.use(express.static("audio"));

app.get('/', (req, res) => {
    console.log(req.query);
    res.render("pages/index");
});

// TODO use correct request method needs to be PUT
app.get('/addconfig', (req, res) => {
    let dbconnectinst = new connect();
    dbconnectinst.SetConfigData(req, res, '/addconfig');
});

// TODO use correct request method needs to be POST
app.get('/getconfig', (req, res) => {
    let dbconnectinst = new connect();
    dbconnectinst.GetConfigData(req, res, '/getconfig');
});

// TODO use correct request method needs to be PUT
app.get('/updateconfig', (req, res) => {
    let dbconnectinst = new connect();
    dbconnectinst.UpdateConfigData(req, res, '/updateconfig');
});

// TODO use correct request method needs to be DELETE
app.get('/deleteconfig', (req, res) => {
    let dbconnectinst = new connect();
    dbconnectinst.DeleteConfigData(req, res, '/deleteconfig');
});

app.get('/ranks', (req, res) => {
    res.send(inports);
});

app.listen(port, () => {

    console.log('Server is listening on port 3000');
});
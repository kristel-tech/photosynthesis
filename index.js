const express = require('express');
const connect = require("./database/databasesetup.js");
const path = require('path');
const { auth, requiresAuth } = require('express-openid-connect');
let app = express();

const config = {
    authRequired: true,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'https://photosynthesynth.herokuapp.com',
    clientID: 'C9v7Jr7OGbnCvllmy5LqXtXadkISa59m',
    issuerBaseURL: 'https://dev-70k6l87u.us.auth0.com'
};


let port = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static("css"));
app.use(express.static("jsfiles"));
app.use(express.static("audio"));
app.use(express.static("assets"));
app.use(express.static(path.join(__dirname, 'public')));


app.use(auth(config));

app.get('/', (req, res) => {

    res.render("pages/index");
});

// TODO use correct request method needs to be PUT
app.put('/addconfig', requiresAuth(),  (req, res) => {
    let dbconnectinst = new connect();
    dbconnectinst.SetConfigData(req, res, '/addconfig');
});

// TODO use correct request method needs to be POST
app.post('/getconfig', requiresAuth(), (req, res) => {
    let dbconnectinst = new connect();
    dbconnectinst.GetConfigData(req, res, '/getconfig');
});

// TODO use correct request method needs to be PUT
app.post('/updateconfig', requiresAuth(), (req, res) => {
    let dbconnectinst = new connect();
    dbconnectinst.UpdateConfigData(req, res, '/updateconfig');
});

// TODO use correct request method needs to be DELETE
app.put('/deleteconfig', requiresAuth(), (req, res) => {
    let dbconnectinst = new connect();
    dbconnectinst.DeleteConfigData(req, res, '/deleteconfig');
});

app.get("/synth", requiresAuth(), (req, res) => {
    res.render("pages/index");
});

// app.get('/profile', requiresAuth(), (req, res) => {
//     res.send(JSON.stringify(req.oidc.user));
// });

app.get('/callback', (req, res) => {
    res.redirect("/synth");
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect("/");
});

app.listen(port, () => {
    console.log('Server is listening on port ' +
        port);
});

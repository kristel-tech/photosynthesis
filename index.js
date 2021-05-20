const express = require('express');
const path = require('path');
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'https://photosynthesynth.herokuapp.com',
  clientID: 'C9v7Jr7OGbnCvllmy5LqXtXadkISa59m',
  issuerBaseURL: 'https://dev-70k6l87u.us.auth0.com'
};

let app = express();
//const inports = require("data/testdata.json");
let port = process.env.PORT || 3000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static("jsfiles"));
app.use(express.static("audio"));
//app.use(express.static(path.join(__dirname, 'public')));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.get('/', (req, res) => {
    if (!req.oidc.isAuthenticated()) {
       res.render("Please login");
    }
});

app.get('/callback', (req, res) => {
    res.render("pages/index");
});

app.get('/signOut', (req, res) => {
    Amplify.Auth.signOut({global: true});
    //open("/");
});

app.listen(port, () => {

    console.log('Server is listening on port 3000');
});

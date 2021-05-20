const express = require('express');
require('./jsfiles/Amplify');
const Amplify = require('aws-amplify');
const path = require('path');
let app = express();
//const inports = require("data/testdata.json");
let port = process.env.PORT || 3000;
let user = null;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static("jsfiles"));
app.use(express.static("audio"));
//app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    console.log(user);
    if (user === null) {
      console.log("attempted sign in");
      Amplify.Auth.federatedSignIn().then(cred => {
        return Amplify.Auth.currentCredentials();
      }).then(u => {
        user = u.sessionToken;
        console.log("Token:" + u.sessionToken);
      }).catch(e => {
        res.render("failed to login. f5");
      });
    } else {
      res.render("pages/index");
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

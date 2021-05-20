const express = require('express');
require('./jsfiles/Amplify');
const Amplify = require('aws-amplify');
let app = express();
//const inports = require("data/testdata.json");
let port = process.env.PORT || 3000;
let user = null;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static("jsfiles"));
app.use(express.static("audio"));

app.get('/', (req, res) => {
    if (user == null) {
      console.log()
      Amplify.Auth.federatedSignIn().then(cred => {
        return Amplify.Auth.currentCredentials();
      }).then(u => {
        user = u;
        console.log(u);
      }).catch(e => {
        console.log(e);
      });
    }
    res.render("pages/index");
});

app.get('/callback', (req, res) => {
    res.render("pages/index");
});

app.get('/signOut', (req, res) => {
    Amplify.Auth.signOut({global: true});
    open("/");
});

app.listen(port, () => {

    console.log('Server is listening on port 3000');
});

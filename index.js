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
let user = null;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static("jsfiles"));
app.use(express.static("audio"));
//app.use(express.static(path.join(__dirname, 'public')));

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/', (req, res) => {
    console.log(user);
    if (user === null) {
      console.log("attempted sign in");
      Amplify.Auth.federatedSignIn().then(cred => {
        return Amplify.Auth.currentCredentials();
      }).then(u => {
        user = u.sessionToken;
        console.log(u);
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

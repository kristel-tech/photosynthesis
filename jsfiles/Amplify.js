const Amplify = require('aws-amplify');

const currentConfig = {
   Auth: {
    identityPoolId: 'us-east-2:71cce9c1-d659-4cea-afb6-630451d4f737',
    region: 'us-east-2',
    userPoolId: 'us-east-2_MGBIbIiVA',
    userPoolWebClientId: '3jor64kidr6sg3pbihjlam6ahh,5hqt6f4rt8bv5p3c34na39fl4j',
    mandatorySignIn: false,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    oauth: {
      domain: 'photosythesis.auth.us-east-2.amazoncognito.com',
      scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: 'http://localhost:3000/callback,https://photosynthesynth.herokuapp.com/callback',
      redirectSignOut: 'http://localhost:3000/,https://photosynthesynth.herokuapp.com/',
      responseType: 'code'
    }
  },
};

const isLocalhost = false;

const [
  localRedirectSignIn,
  productionRedirectSignIn,
] = currentConfig.Auth.oauth.redirectSignIn.split(",");

const [
  localRedirectSignOut,
  productionRedirectSignOut,
] = currentConfig.Auth.oauth.redirectSignOut.split(",");

const [
  localAppClient,
  productionAppClient,
] = currentConfig.Auth.userPoolWebClientId.split(",");

const updatedAwsConfig = {
  ...currentConfig,
  Auth: {
    ...currentConfig.Auth,
    userPoolWebClientId: isLocalhost ? localAppClient : productionAppClient,
    oauth: {
      ...currentConfig.Auth.oauth,
      redirectSignIn: isLocalhost ? localRedirectSignIn : productionRedirectSignIn,
      redirectSignOut: isLocalhost ? localRedirectSignOut : productionRedirectSignOut,
    }
  }
}

Amplify.Amplify.configure(updatedAwsConfig);

module.exports = { updatedAwsConfig }

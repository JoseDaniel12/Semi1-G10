const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const aws_keys = require('./keys');
let cognitoAttributeList = [];

const poolData = { 
    UserPoolId : aws_keys.cognito.grupoID,
    ClientId : aws_keys.cognito.gclientID,
};

const attributes = (key, value) => { 
  return {
    Name : key,
    Value : value
  }
};

function setCognitoAttributeList(name, email, ext) {
    let attributeList = [];
    attributeList.push(attributes('name', name));
    attributeList.push(attributes('email', email));
    attributeList.push(attributes('picture', ext));
    attributeList.push(attributes('custom:modo_bot', '0'));
    attributeList.forEach(element => {
        cognitoAttributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(element));
    });
}

function getCognitoAttributeList() {
    return cognitoAttributeList;
}

function getCognitoUser(usname) {
    const userData = {
      Username: usname,
      Pool: getUserPool()
    };
    return new AmazonCognitoIdentity.CognitoUser(userData);
}

function getUserPool(){
    return new AmazonCognitoIdentity.CognitoUserPool(poolData);
}
  
function getAuthDetails(email, password) {
    var authenticationData = {
        Username: email,
        Password: password,
    };
    return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
}
  
function initAWS (region = aws_keys.cognito.region, identityPoolId = aws_keys.cognito.identityPoolId) {
    AWS.config.region = region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
    });
}
  
function decodeJWTToken(token) {

    console.log(jwt_decode(token.idToken));

    const { email, name, 'cognito:username': username, 'custom:modo_bot': modo_bot, picture, exp, auth_time, token_use, sub} = jwt_decode(token.idToken);

    return { username, email, name, ext_foto: picture, modo_bot: parseInt(modo_bot), uid: sub };
}
  
module.exports = {
    initAWS,
    getCognitoAttributeList,
    getUserPool,
    getCognitoUser,
    setCognitoAttributeList,
    getAuthDetails,
    decodeJWTToken,
}
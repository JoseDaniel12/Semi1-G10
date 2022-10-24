var AWS = require('aws-sdk');
const { LexRuntimeV2 } = require("@aws-sdk/client-lex-runtime-v2");

const lexruntime = new LexRuntimeV2({ 
  region: process.env.AWS_REGION,                       // Set your Bot Region
  credentials: new AWS.Credentials({
    accessKeyId: process.env.LEX_AWS_ACCES_KEY,         // Add your access IAM accessKeyId
    secretAccessKey: process.env.LEX_AWS_SECRET_KEY     // Add your access IAM secretAccessKey
  })     
});


const lexparams = {
  "botAliasId": "TSTALIASID",   // Enter the botAliasId
  "botId": "QYOJUW1LKO",        // Enter the botId
  "localeId": "es_ES",
  "sessionId": "some_session_id",
  "text": "",
};


const talk_to_bot = async message_content => {
  lexparams.text = message_content
  let response  = await lexruntime.recognizeText(lexparams);
  if (!response.messages) {
    response.messages = [];
  }
  return response.messages;
}


module.exports = {
  talk_to_bot
}
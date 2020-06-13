require('dotenv').config();
const express = require('express');

const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

let app = express();

const assistant = new AssistantV2({
  version: process.env.ASSISTANT_API_VERSION,
  authenticator: new IamAuthenticator({
    apikey: process.env.ASSISTANT_API_KEY,
  }),
  url: process.env.ASSISTANT_API_URL,
});

app.post('/api/message', function(req, res) {
    assistant.message({
    assistantId: process.env.ASSISTANT_ID,
    sessionId: req.body.session_id,
    input: {
      'message_type': 'text',
      'text': req.body.input.text
    }
  }).then(res => {
    console.log(JSON.stringify(res.result, null, 2));
    return res.json(res.result);
  }).catch(err => {
    const status = err.code !== undefined && err.code > 0 ? err.code : 500;
    console.log(res.status(status).json(err));
    return res.status(status).json(err);
  });
});

app.get('/api/session', function(req, res) {

});


  assistant.createSession(
    {
      assistantId: process.env.ASSISTANT_ID,
    },
    function(err, res) {
      if (err) {
        return res.send(err);
      } else {
        return res.send(res);
      }
    }
  );

module.exports = app;
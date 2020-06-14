const AssistantV1 = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

async function main(params) {
    console.log("OI");
    const assistant = new AssistantV1({
      version: process.env.ASSISTANT_API_VERSION,
      authenticator: new IamAuthenticator({
        apikey: process.env.ASSISTANT_API_KEY,
      }),
      url: process.env.ASSISTANT_URL,
    });
    
    assistant.message({
      workspaceId: process.env.ASSISTANT_SKILL_ID,
      input: {'text': 'Hello'}
      })
      .then(res => {
        console.log(JSON.stringify(res.result, null, 2));
      })
      .catch(err => {
        console.log(err)
      });
}
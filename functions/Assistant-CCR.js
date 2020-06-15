const AssistantV1 = require('ibm-watson/assistant/v1');
const twilio = require('twilio');

const Cloudant = require('@cloudant/cloudant');

const cloudant = new Cloudant(
{ url: "<URL>", 
plugins: [ { iamauth: { iamApiKey: '<API>' } }, 
{ retry: { retryDelayMultiplier: 4 } } ]});
var sessions = cloudant.db.use('session')

const Path = require('path')
const Axios = require('axios')
  
async function main(params) {
    let user = {"_id":params.From, "context":{}};
    try {
        user = await sessions.get(params.From);
    } catch(err) {}
    console.log(user);
    const assistant = new AssistantV1({
        version: params.ASSISTANT_API_VERSION,
        iam_apikey: params.ASSISTANT_API_KEY,
        url: params.ASSISTANT_URL,
    });
    
    let text = params.text || params.Body;
    let assistantResponse;
    let additionalContext;
    //saving received data

    
    //processing medias
    if(params.NumMedia && params.NumMedia != '0'){
        text = 'STT transcript';
    }
    
    //processing location
    if(params.Latitude && params.Longitude){
        user.context = Object.assign(user.context, {"coords": {"lat":params.Latitude, "lon":params.Longitude}});
    }
    
    //sending text to watson assistant
    try {
        data = await assistant.message({
            workspace_id: params.ASSISTANT_SKILL_ID,
            input: { 'text': text },
            context: user.context
        });
        
        assistantResponse = data.output.generic[0].text;
        console.log(assistantResponse);
    } catch {
        assistantResponse = "Ops! Tive que sair pra resolver um problema, daqui a pouco estou de volta pra te ajudar";
    }
    
    //saving processed data
    
    
    //syntetizing voice
    if(params.NumMedia && params.NumMedia != '0'){
        text = 'TTS transcript';
        if (params.MediaUrl0) {
            text = 'url';
        }
    }
    
    //send response
    if(params.From){
        console.log(assistantResponse);
        client = new twilio(params.TWILIO_ACCOUNT_SID, params.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            from: params.TWILIO_NUMBER,
            body: assistantResponse,
            to: params.From
        })
        .then(message => console.log(message.sid))
        .catch(err => console.log(err));        
    }
    
    return { result : assistantResponse };
}
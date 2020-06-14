// Requests and decodes an OGG file
// Encodes the audio data as WAV
// Then triggers a download of the file
let toWav = require('audiobuffer-to-wav')
const fs = require('fs');
const Path = require('path')  
const Axios = require('axios')
let xhr = require('xhr')


// request the MP3 as binary
xhr({
  uri: 'audio/audio.ogg',
  responseType: 'arraybuffer'
}, function (err, body, resp) {
  if (err) throw err
  let audioContext = new AudioContext()
  // decode the MP3 into an AudioBuffer
  audioContext.decodeAudioData(resp, function (buffer) {
    // encode AudioBuffer to WAV
    let wav = toWav(buffer).toString('base64');
    
    // do something with the WAV ArrayBuffer ...
  })
})
// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START speech_quickstart]
async function main() {
  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');
  const fs = require('fs');
  const https = require('https');
  const Path = require('path')
  const Axios = require('axios')

  // Creates a client
  const client = new speech.SpeechClient();

  async function downloadAudio() {
    const url = 'https://api.twilio.com/2010-04-01/Accounts/AC4deff7a930f64cedb7585703f87a6b0a/Messages/MMff7c67343e42da3e81200ac8e9996c14/Media/ME719aabc40c7510d081aee96ef3b8d972'
    const path = Path.resolve(__dirname, './', 'audio.ogg')
    const writer = fs.createWriteStream(path)

    const response = await Axios({
      url,
      method: 'GET',
      responseType: 'stream'
    })

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }

  await downloadAudio()

  // The name of the audio file to transcribe
  const filename = 'audio.flac';
  const encoding = 'FLAC';
  const sampleRateHertz = 48000;
  const languageCode = 'pt-BR';

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };
  const audio = {
    content: fs.readFileSync(filename).toString('base64'),
  };

  const request = {
    config: config,
    audio: audio,
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log('Transcription: ', transcription);
}
main().catch(console.error);
// [END speech_quickstart]
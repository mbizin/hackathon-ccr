const fs = require('fs');
const Path = require('path')  
const Axios = require('axios')

async function downloadImage () {  
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
  
  downloadImage()  
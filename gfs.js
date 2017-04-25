const request = require('request')

let url = 'https://airbox.edimaxcloud.com/gfs.json'

request(url, (err, res, body) => {
  if (!err && res.statusCode === 200) {
    let data = JSON.parse(body)
    
    console.log(data)
  }
})
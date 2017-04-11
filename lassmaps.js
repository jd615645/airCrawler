let config = require('./config').config
const request = require('request')
const firebase = require('firebase')

firebase.initializeApp(config)

let db = firebase.database()

let url = 'https://data.lass-net.org/data/last-all-maps.json'

request(url, (err, res, body) => {
  if (!err && res.statusCode === 200) {
    let parseData = []
    let data = JSON.parse(body)
    let feeds = data['feeds']

    feeds.forEach((val) => {
      let value = {
        'SiteName': val['device_id'],
        'LatLng': {
          'lat': val['gps_lat'],
          'lng': val['gps_lon']
        },
        'SiteGroup': 'lass4u',
        'Data': {
          'pm25': val['s_d0'],
          'temp': val['s_t0']===undefined?0:val['s_t0'],
          'humi': val['s_h0']===undefined?0:val['s_h0']
        },
        'time': val['timestamp'],
        'uniqueKey': val['device_id']
      }
      if (val['s_d0'] !== undefined) {
        parseData.push(value)
      }
    })
    // console.log(parseData)
    firebase.database().ref('/lassmaps').push(parseData)
    firebase.database().goOffline()
    console.log('upload done')
  }
})
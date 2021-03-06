let config = require('./config').config
const request = require('request')
const firebase = require('firebase')

firebase.initializeApp(config)

let db = firebase.database()

let url = 'https://data.lass-net.org/data/last-all-indie.json'

request(url, (err, res, body) => {
  if (!err && res.statusCode === 200) {
    let parseData = []
    let data = JSON.parse(body)
    let feeds = data['feeds']

    feeds.forEach((val) => {
      let value = {
        'SiteName': val['SiteName'],
        'LatLng': {
          'lat': val['gps_lat'],
          'lng': val['gps_lon']
        },
        'SiteGroup': 'indie',
        'Data': {
          'temp': val['Temperature'],
          'humi': val['Humidity'],
          'pm25': val['PM25']
        },
        'time': val['timestamp'],
        'uniqueKey': val['device_id']
      }
      parseData.push(value)
    })
    console.log(parseData)
    firebase.database().ref('/indie').push(parseData)
    firebase.database().goOffline()
    console.log('upload done')
  }
})
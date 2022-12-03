const request = require('request')

const forcast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=64ad71ad07e8ec4ff45206f4442541f9&query='+ latitude + ',' + longitude

    request({url, json: true}, (error, {body}) => {
        if(error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location.', undefined)
        } else {
            callback(undefined, body.current.weather_descriptions[0] + '. It is currently ' + body.current.temperature + ' degrees here. It feels like ' + body.current.feelslike + ' degrees here.' + 'The humidity is ' + body.current.humidity + '%.')
        }
    })
}

module.exports = forcast
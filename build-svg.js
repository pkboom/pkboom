const WEATHER_API_KEY = process.env.WEATHER_API_KEY

let fs = require('fs')
let got = require('got')

const today = new Date()
const todayDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today)

// Today's weather
let WEATHER_DOMAIN = 'http://api.openweathermap.org'
let url = `data/2.5/weather?q=Ancaster,ON,Canada&APPID=${WEATHER_API_KEY}&units=metric`

;(async () => {
  try {
    const { body } = await got(url, {
      prefixUrl: WEATHER_DOMAIN,
      responseType: 'json',
    })

    const degC = Math.round(body.main.temp)
    const degF = Math.round(degC * 1.8 + 32)
    const feelsLike = Math.round(body.main.feels_like)
    const description = body.weather[0].description

    const response = await got(`http://openweathermap.org/img/wn/${body.weather[0].icon}@2x.png`, {
      responseType: 'buffer',
    })

    let icon = 'data:' + response.headers['content-type'] + ';base64,' + Buffer.from(response.body).toString('base64')

    fs.readFile('template.svg', 'utf-8', (error, data) => {
      if (error) {
        return
      }

      data = data.replace('{degF}', degF)
      data = data.replace('{degC}', degC)
      data = data.replace('{feelsLike}', feelsLike)
      data = data.replace('{description}', description)
      data = data.replace('{icon}', icon)
      data = data.replace('{todayDay}', todayDay)
      data = fs.writeFile('chat.svg', data, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    })
  } catch (error) {
    console.log(error)
  }
})()

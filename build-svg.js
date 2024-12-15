// https://home.openweathermap.org/api_keys
const WEATHER_API_KEY = process.env.WEATHER_API_KEY

let fs = require('fs')
let got = require('got')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const today = new Date()
const todayDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today)

// Today's weather
let WEATHER_DOMAIN = 'http://api.openweathermap.org'
let url = `data/2.5/weather?q=Ancaster,ON,Canada&APPID=${WEATHER_API_KEY}&units=metric`

const escape = (chr) => {
  return chr.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')
}

;(async () => {
  try {
    const { body } = await got(url, {
      prefixUrl: WEATHER_DOMAIN,
      responseType: 'json',
    })

    const degC = Math.round(body.main.temp)
    const degF = Math.round(degC * 1.8 + 32)
    const feelsLike = Math.round(body.main.feels_like)

    const icons = await got('https://raw.githubusercontent.com/pkboom/OpenWeather-icons/master/icons.json').json()

    // const { body: filmBody } = await got('https://top10.netflix.com/films')

    // let dom = new JSDOM(filmBody, {
    //   url: 'https://top10.netflix.com/films',
    //   contentType: 'text/html',
    // })

    // const topFilm = `Netflix top film is "${dom.window.document.querySelector('.list-table tbody tr td:nth-child(2)').textContent}"`

    // const { body: tvBody } = await got('https://top10.netflix.com/tv')

    // dom = new JSDOM(tvBody, {
    //   url: 'https://top10.netflix.com/tv',
    //   contentType: 'text/html',
    // })

    // const topTv = `and top tv show is "${dom.window.document.querySelector('.list-table tbody tr td:nth-child(2)').textContent}".`

    fs.readFile('template.svg', 'utf-8', (error, data) => {
      if (error) {
        return
      }

      data = data.replace('{degF}', degF)
      data = data.replace('{degC}', degC)
      data = data.replace('{feelsLike}', feelsLike)
      data = data.replace('{icon}', icons[body.weather[0].icon])
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

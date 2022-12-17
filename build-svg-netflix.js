let fs = require('fs')
let got = require('got')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

;(async () => {
  try {
    const { body: filmBody } = await got('https://top10.netflix.com/films')

    let dom = new JSDOM(filmBody, {
      url: 'https://top10.netflix.com/films',
      contentType: 'text/html',
    })

    const topFilm = `Netflix top film is "${dom.window.document.querySelector('.list-table tbody tr td:nth-child(2)').textContent}"`

    const { body: tvBody } = await got('https://top10.netflix.com/tv')

    dom = new JSDOM(tvBody, {
      url: 'https://top10.netflix.com/tv',
      contentType: 'text/html',
    })

    const topTv = `and top tv show is "${dom.window.document.querySelector('.list-table tbody tr td:nth-child(2)').textContent}".`

    fs.readFile('template.svg', 'utf-8', (error, data) => {
      if (error) {
        return
      }

      data = data.replace('{topFilm}', topFilm)
      data = data.replace('{topTv}', topTv)
      data = data.replace('{netflixLength}', Math.max(topFilm.length, topTv.length) * 9)
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

// })()

import puppeteer from 'puppeteer'

import * as movieScarpper from './MovieScrapper.js'

let freeDaysIs = null

/**
 * It scrapes the calendar of the users and finds the most common days that they are avaliable.
 *
 * @param {Array} urls - an array of urls to scrape
 * @param {Array} allLinks - An array of all the links on the page.
 */
export default async function scrapeCalendars (urls, allLinks) {
  const dataArray = []
  const namesArray = []
  const avaliableArray = []
  const usersCalander = []
  puppeteer.launch().then(async browser => {
    const page = await browser.newPage()
    await page.goto(urls[0].substring(urls[0].lastIndexOf('/') + 1, 0))

    browser = await puppeteer.launch({ headless: true })
    await page.waitForSelector('body')
    const allPosts = await page.$$eval('a', list => list.map(elm => elm.href))
    const linkArray = Array.from(allPosts)

    console.log('Scraping available days...OK')
    for (let index = 0; index < allPosts.length; index++) {
      const page2 = await browser.newPage()
      await page2.goto(allPosts[index])
      await page2.waitForSelector('body')

      const name = await page2.$$eval('h2', list => list.map(elm => elm.textContent))
      namesArray.push(name)

      const data = await page2.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('table tr td'))
        return tds.map(td => td.innerText)
      })
      dataArray.push(data)

      const data2 = await page2.evaluate(() => {
        const tds = Array.from(document.querySelectorAll('table tr th'))
        return tds.map(th => th.innerText)
      })
      avaliableArray.push(data2)

      for (let i = 0; i < data.length; i++) {
        if (data[i].toUpperCase() === 'OK' && name !== null && data2[i] !== null) {
          usersCalander.push(data2[i])

          usersCalander.push({ name: name, avaliable: data2[i] })
        }
      }
    }

    const output = usersCalander.reduce(function (result, value) {
      result[value.name] = result[value.name] || []
      result[value.name].push({ avaliable: value.avaliable })
      return result
    }, {})

    const s = [output.Paul, output.Peter, output.Mary]

    const merged = [].concat.apply([], s)

    const str = merged.map(function (item) {
      return item.avaliable
    })
    let words = ''

    str.forEach(element => {
      words += ' ' + element
    })
    freeDaysIs = findMostRepeatedWord2(words)

    movieScarpper.scrapeMovies(allLinks[1].substring(0, linkArray[1].length - 9), freeDaysIs, allLinks)

    freeDaysIs.forEach(function (item, index, array) {
      if (item + 1 === 5) {
        array[index] = 'Friday'
      } else if (item + 1 === 6) {
        array[index] = 'Saturday'
      } else if (item + 1 === 7) {
        array[index] = 'Sunday'
      }
    })

    await browser.close()
  }).catch(function (err) {
    console.error(err)
  })
}
export {
  scrapeCalendars
}

/**
 * Function to find most repeated word.
 *
 * @param {string} str - the string to search.
 * @returns {Array}  - an array of the most repeated words.
 */
function findMostRepeatedWord2 (str) {
  const words = str.match(/\w+/g)

  const arr = []

  const occurances = {}

  for (const word of words) {
    if (occurances[word]) {
      occurances[word]++
      arr.push({ name: word, count: occurances[word] })
    } else {
      occurances[word] = 1
      arr.push({ name: word, count: occurances[word] })
    }
  }

  const ids = arr.map(object => {
    return object.count
  })

  const max = Math.max(...ids)
  const indexes = []

  for (let index = 0; index < arr.length; index++) {
    if (arr[index].count === max) {
      indexes.push(arr[index].name)
    }
  }

  return indexes
}

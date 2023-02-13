
import puppeteer from 'puppeteer'
import fetch from 'node-fetch'
import * as dinner from './DinnerScrapper.js'

let dates = null
const result = []
let data
let ty = null
/**
 * It scrapes the movies from the website and then calls the checkMoviesHandler function.
 *
 * @param {Array} url - The url to the site you want to scrape.
 * @param {Array} freeDaysIs - An array of the days that are free.
 * @param {Array} allLinks - An array of all the links to the different pages.
 */
export default async function scrapeMovies (url, freeDaysIs, allLinks) {
  puppeteer.launch().then(async browser => {
    const movies = []

    const page = await browser.newPage()
    await page.goto(url)
    await page.waitForSelector('body')
    browser = await puppeteer.launch({ headless: true })
    const days = await page.$$eval('#day option', list => list.map(elm => elm.value))

    const moviesData = await page.$$eval('#movie option', list => list.map(elm => elm.innerText))

    for (let i = 1; i < days.length; i++) {
      movies.push({ day: days[i], movie: moviesData[i] })
    }

    let dayIndex = -1
    const moviesArray = []

    freeDaysIs.forEach(function (item, index, array) {
      if (item === 'Friday') {
        array[index] = '05'
      } else if (item === 'Saturday') {
        array[index] = '06'
      } else if (item === 'Sunday') {
        array[index] = '07'
      }
    })

    movies.forEach(element => {
      if ((element.day === '05' && freeDaysIs[freeDaysIs.length] === element.day) || (element.day === '05' && freeDaysIs[freeDaysIs.length - 1] === element.day)) {
        dayIndex = movies.indexOf(element)
        moviesArray.push(dayIndex)
      } else if ((element.day === '06' && freeDaysIs[0] === element.day) || (element.day === '06' && freeDaysIs[freeDaysIs.length - 1] === element.day)) {
        dayIndex = movies.indexOf(element)
        moviesArray.push(dayIndex)
      } else if ((element.day === '07' && freeDaysIs[0] === element.day) || (element.day === '07' && freeDaysIs[freeDaysIs.length - 1] === element.day)) {
        dayIndex = movies.indexOf(element)
        moviesArray.push(dayIndex)
      }
    })

    ty = allLinks
    dinner.checkDinner('https://courselab.lnu.se/scraper-site-1/dinner/', freeDaysIs, allLinks).then(function (data) {
      dates = data

      checkMoviesHandler(ty[1].substring(0, ty[1].length), movies, moviesArray, dates, freeDaysIs)
    })

    await browser.close()
  }).catch(function (err) {
    console.error(err)
  })
}
const rs = []
/**
 * It takes the data from the previous function and prints the results.
 *
 * @param {Array} url - The url of the server
 * @param {Array} day - The day of the week.
 * @param {Array} indeses - an array of the indexes of the days to check for free tables.
 * @param {Array} fromTo - an array of objects that contain the start and end time of the free table.
 * @param {Array} freeDaysIs - The day that the user wants to go to the cinema.
 */
async function checkMoviesHandler (url, day, indeses, fromTo, freeDaysIs) {
  let indexer = -1
  let iterator = 0
  let itSize = indeses.length

  if (indeses.length < 2) {
    indexer = 0
  } else {
    indexer = 1
    iterator = 1
    itSize = indeses.length + 1
  }

  for (let count = 0; count < 3; count++) {
    for (let index = iterator; index < itSize; index++) {
      const res = await fetch(url + '/check?day=' + day[indeses[index - indexer]].day + '&movie=0' + (
        count + 1))
      data = await res.json()

      if (day[index].day === data[count].day) {
        for (const movie of data) {
          if (movie.status === 1) {
            result.push(movie)
          }
        }
      }
    }
  }

  for (let index = 0; index < result.length; index++) {
    if (result[index].status === 1) {
      rs.push(result[index])
    }
  }

  console.log('Scraping showtimes...OK')
  console.log('\n\nRecommendations\n===============')

  rs.map(a => (
    a.day === '05'
      ? 'Friday'
      : a))
  if (freeDaysIs === 'Friday') {
    freeDaysIs = '05'
  }
  for (let i = 0; i < rs.length; i++) {
    if (rs[i].day === '05') {
      rs[i].day = 'Friday'
    }
    if (rs[i].day === '06') {
      rs[i].day = 'Saturday'
    }
    if (rs[i].day === '07') {
      rs[i].day = 'Sunday'
    }
    switch (freeDaysIs) {
      case '01':
        rs[i].movie = 'The Flying Deuces'
        break
      case '02':
        rs[i].movie = 'Keep Your Seats, Please'
        break
      case '03':
        rs[i].movie = 'A Day at the Races'
        break
    }
  }
  const mergedElementsArray = []

  const merged = [].concat.apply([], rs)

  const count = merged.length - 1

  merged.forEach(element => {
    if (parseInt(element.time.substring(0, 2)) <= merged[count].time.substring(0, 2)) {
      mergedElementsArray.push(merged[merged.indexOf(element)])
    }
    if (element.movie === '01') {
      element.movie = 'The Flying Deuces'
    }
    if (element.movie === '02') {
      element.movie = 'Keep Your Seats, Please'
    }
    if (element.movie === '03') {
      element.movie = 'A Day at the Races'
    }
  })
  let indexOf = -1

  fromTo.forEach(movie => {
    if (movie.from === (parseInt(mergedElementsArray[0].time.substring(0, 2)) + 2).toString()) {
      indexOf = fromTo.indexOf(movie)
    }
  })

  mergedElementsArray.forEach(movie => {
    console.log('* On ' + movie.day + ' the movie "' + movie.movie + '" starts at ' + movie.time + ' and there is a free table between ' + fromTo[indexOf].from + ' and ' + fromTo[indexOf].to)
  })

  process.exit(0)
}

export {
  scrapeMovies
}

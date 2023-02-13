import puppeteer from 'puppeteer'

const USERNAME_SELECTOR = 'input[name="username"]'
const PASSWORD_SELECTOR = 'input[name="password"]'
const CTA_SELECTOR = 'input[name="submit"]'

/**
 * It launches a browser and creates a new page.
 *
 * @returns {object} An object with two properties: browser and page.
 */
async function startBrowser () {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  return { browser, page }
}

const fromTime = []

// eslint-disable-next-line no-unused-vars
let links = null
/**
 * It takes in a url, a day and an array of links, then it returns an array of objects with the from and to time.
 *
 * @param {Array} url - The url of the website to scrape.
 * @param {Array} day - the day of the week check for availability.
 * @param {Array} allLinks - an array of all the links to the restaurants.
 * @returns {Array} An array of objects with the from and to times for the dinner slots.
 */
export default async function checkDinner (url, day, allLinks) {
  const { page } = await startBrowser()
  page.setViewport({ width: 1366, height: 768 })
  const availableDinner = []
  await page.goto(url)
  await page.click(USERNAME_SELECTOR)
  await page.keyboard.type('zeke')
  await page.click(PASSWORD_SELECTOR)
  await page.keyboard.type('coys')
  await page.click(CTA_SELECTOR)

  links = allLinks
  const days = await page.$$eval('.MsoNormal input', list => list.map(elm => elm.value))

  day.forEach(function (item, index, array) {
    if (item === '05') {
      array[index] = 'Friday'
    } else if (item === '06') {
      array[index] = 'Saturday'
    } else if (item === '07') {
      array[index] = 'Sunday'
    }
  })

  for (let index = 0; index < days.length; index++) {
    if (days[index].substring(0, 3).toUpperCase() === day[0].substring(0, 3).toUpperCase() || days[index].substring(0, 3).toUpperCase() === day[0].substring(0, 3).toUpperCase()) {
      availableDinner.push(days[index].substring(3))
    }
  }

  for (let index = 0; index < availableDinner.length; index++) {
    fromTime.push({
      from: availableDinner[index].substring(0, 4).slice(0, 2),
      to: availableDinner[index].substring(0, 4).slice(2, 5)
    })
  }

  return fromTime
}(async () => {})()

export {
  fromTime,
  checkDinner
}

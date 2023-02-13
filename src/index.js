
import puppeteer from 'puppeteer'

import * as hrefsCalendars from './Calendars.js'
let hrefs = []
let hrefs2 = []

let allLinks = []

const start = process.argv.slice(2)

/**
 * Function that takes the link from the terminal, scrapes all the links on that page, and then passes those links to another function.
 *
 * @param {string} start - The value of the input element.
 */
async function getCalndersHrefs (start) {
  let linkArray = []

  puppeteer
    .launch()
    .then(async (browser) => {
      const page = await browser.newPage()

      await page.goto(start[0])
      browser = await puppeteer.launch({ headless: true })
      await page.waitForSelector('body')

      hrefs = await page.$$eval('a', (list) => list.map((elm) => elm.href))

      allLinks = Array.from(hrefs)

      console.log('Scraping links...OK')

      const page2 = await browser.newPage()
      await page2.goto(allLinks[0])

      hrefs2 = await page2.$$eval('a', (list) => list.map((elm) => elm.href))

      linkArray = Array.from(hrefs2)

      return linkArray
    })
    .then(async function (data) {
      hrefsCalendars.scrapeCalendars(data, allLinks)
    })
}

getCalndersHrefs(start)
  .then((x) => {

  })
  .then(function (data) {

  })

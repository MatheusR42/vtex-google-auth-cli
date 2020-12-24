const dotenv = require('dotenv');
dotenv.config();

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// puppeteer usage as normal
puppeteer.launch({ headless: true }).then(async browser => {
  const page = await browser.newPage()

  await page.goto(`https://${process.env.ACCOUNT_NAME}.myvtex.com/`)
  await page.waitForSelector('div[data-testid="google-oauth"] > div')
  await page.click('div[data-testid="google-oauth"] > div')
  await page.waitForNavigation({ waitUntil: 'networkidle0' })

  await page.waitForSelector('input[type="email"]')
  await page.click('input[type="email"]')
  await page.type('input[type="email"]', process.env.GOOGLE_AUTH_EMAIL)
  await page.waitForSelector('#identifierNext')
  await page.click('#identifierNext')

  await page.waitForTimeout(3000)

  await page.waitForSelector('input[type="password"]')
  await page.click('input[type="password"]')
  await page.type('input[type="password"]', process.env.GOOGLE_AUTH_PASSWORD)
  
  await page.waitForSelector('#passwordNext')
  await page.click('#passwordNext')
  
  await page.waitForTimeout(500)
  await page.waitForNavigation({ waitUntil: 'networkidle0' })


  const { cookies } = await page._client.send('Network.getAllCookies')
  const VtexIdclientAutCookie = cookies.find(cookie => cookie.name === 'VtexIdclientAutCookie')
  
  await browser.close()

  if (VtexIdclientAutCookie) {
    console.log(VtexIdclientAutCookie.value)
  }
})
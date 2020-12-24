// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from 'puppeteer-extra'

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

import { PuppeteerCookie } from './typings/index'

puppeteer.use(StealthPlugin())

const getVtexIdclientAutCookie = async (
  ACCOUNT_NAME: string,
  GOOGLE_AUTH_EMAIL: string,
  GOOGLE_AUTH_PASSWORD: string
): Promise<string|null> => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.goto(`https://${ACCOUNT_NAME}.myvtex.com/`)
  await page.waitForSelector('div[data-testid="google-oauth"] > div')
  await page.click('div[data-testid="google-oauth"] > div')
  await page.waitForNavigation({ waitUntil: 'networkidle0' })

  await page.waitForSelector('input[type="email"]')
  await page.click('input[type="email"]')
  await page.type('input[type="email"]', GOOGLE_AUTH_EMAIL)
  await page.waitForSelector('#identifierNext')
  await page.click('#identifierNext')

  await page.waitForTimeout(3000)

  await page.waitForSelector('input[type="password"]')
  await page.click('input[type="password"]')
  await page.type('input[type="password"]', GOOGLE_AUTH_PASSWORD)

  await page.waitForSelector('#passwordNext')
  await page.click('#passwordNext')

  await page.waitForTimeout(500)
  await page.waitForNavigation({ waitUntil: 'networkidle0' })

  const { cookies }: { cookies: [PuppeteerCookie] } =
    // @ts-ignore
    await page._client.send('Network.getAllCookies')
  const VtexIdclientAutCookie =
    cookies.find((cookie) => cookie.name === 'VtexIdclientAutCookie')

  await browser.close()

  return VtexIdclientAutCookie ? VtexIdclientAutCookie.value : null
}

export {
  getVtexIdclientAutCookie
}

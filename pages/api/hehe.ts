import chrome from 'chrome-aws-lambda'
import { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer-core'
import { parse } from 'url'

export const generatePDF = async (url: string, token: string) => {
  const browser = await puppeteer.launch(
    process.env.NODE_ENV === 'production'
      ? {
          args: chrome.args,
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
        }
      : {}
  )
  const page = await browser.newPage()
  await page.setViewport({
    width: 1500,
    height: 2121,
    deviceScaleFactor: 2,
  })

  await page.setCookie({
    name: 'authorization',
    value: token,
    url,
    expires: Date.now() / 1000 + 10,
  })
  await page.goto(url, { waitUntil: 'networkidle2' })
  const pdf = await page.pdf({
    printBackground: true,
    height: 1216,
    width: 860,
  })

  await browser.close()
  return pdf
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const parsed = parse(req.url, true)

  if (!parsed.query.url || !req.headers.authorization) {
    return res.end('Please provide required infos')
  }

  try {
    const pdf = await generatePDF(
      decodeURIComponent(parsed.query.url as string),
      req.headers.authorization.replace('Bearer ', '')
    )
    res.end('ok')
  } catch (error) {
    console.log('error: ', error)
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('There was an error performing the action')
  }
}
import chrome from "chrome-aws-lambda";
import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer-core";
import { parse } from "url";

export const generatePDF = async (url: string, token: string) => {
  const browser = await puppeteer.launch(
    process.env.NODE_ENV === "production"
      ? {
          args: [
            "--no-sandbox", // Add this flag to disable the sandbox
            "--disable-setuid-sandbox",
          ],
          executablePath: await chrome.executablePath,
          headless: chrome.headless,
          ignoreDefaultArgs: ["--disable-extensions"],
        }
      : {}
  );
  const page = await browser.newPage();

  await page.goto("https://example.com");

  // your logic here ...
  console.info("DONE");
  await browser.close();
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const parsed = parse(req.url, true);

  if (!parsed.query.url || !req.headers.authorization) {
    return res.end("Please provide required infos");
  }

  try {
    await generatePDF(
      decodeURIComponent(parsed.query.url as string),
      req.headers.authorization.replace("Bearer ", "")
    );
    // const pdf = await generatePDF(
    //   decodeURIComponent(parsed.query.url as string),
    //   req.headers.authorization.replace('Bearer ', '')
    // )
    res.end("ok");
  } catch (error) {
    console.log("error: ", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("There was an error performing the action");
  }
}

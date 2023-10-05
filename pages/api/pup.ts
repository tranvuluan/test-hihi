import type { NextApiRequest, NextApiResponse } from "next";
// we import our `helloWorld()` background function
// import pup from "../../defer/puppeteerJob";
import chromium from "chrome-aws-lambda";
import playwright from "playwright-core";

type Data = {
  ok: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // calling a background function triggers an execution on Defer Platform
  console.log("API :", req.headers);
  // await pup();
  const browser = await playwright.chromium.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  const page = await browser.newPage();

  await page.goto("https://example.com");

  // your logic here ...
  console.info("DONE");
  await browser.close();
  res.end('ok');
}

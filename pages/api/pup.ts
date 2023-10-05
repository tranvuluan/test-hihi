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
  // Create a page with the recommended Open Graph image size
  const page = await browser.newPage({
    viewport: {
      width: 1200,
      height: 720,
    },
  });

  // Extract the url from the query parameter `path`
  const url = "https://ndo.dev/posts/link-screenshot";

  await page.goto(url);

  const data = await page.screenshot({
    type: "png",
  });

  await browser.close();
  res.setHeader("Cache-Control", "s-maxage=31536000, public");
  res.setHeader("Content-Type", "image/png");
  res.end(data);
}

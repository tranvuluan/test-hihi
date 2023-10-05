// // defer/puppeteerJob.js
// import { defer } from "@defer/client";
// import puppeteer from "puppeteer";

// async function helloPuppeteer() {
//   let browser;
//   try {
//     const launchConfig = {
//       headless: "new",
//       args: [
//         "--no-sandbox", // Add this flag to disable the sandbox
//         "--disable-setuid-sandbox",
//       ],
//     } as any;

//     browser = (await puppeteer.launch(launchConfig)) as any;

//     const page = await browser.newPage();

//     await page.goto("https://example.com");

//     // your logic here ...
//     console.info('DONE')
//   } catch (error) {
//     console.log(error);
//     throw error;
//   } finally {
//     await browser.close();
//   }
// }

// // the function must be wrapped with `defer()` and exported as default
// export default defer(helloPuppeteer);

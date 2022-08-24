const fs = require("fs");
const download = require("download");
const Scraper = require("images-scraper");

const google = new Scraper({
  puppeteer: {
    headless: false,
  },
});

let result = [];

(async () => {
  const results = await google.scrape("banana", 50);
  //   console.log("results", results);

  for (let i in results) {
    // console.log(results[i].url);
    // result.push(results[i].url);
    // console.log(result);

    // Url of the image
    const file = results[i].url;
    // Path at which image will get downloaded
    const filePath = `${__dirname}/files`;

    try {
      const getImage = await download(file, filePath);
      console.log("download ok!");
    } catch (e) {
      console.error(e);
    }
    // .then(() => {
    //   console.log("Download Completed");
    // });
  }
})();

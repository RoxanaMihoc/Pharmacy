const axios = require("axios");
const cheerio = require("cheerio");
const url = require("url");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const readline = require('readline');

async function extractItemInfo(itemPageUrl, category) {
  try {
    console.log("Fetching item page:", itemPageUrl);
    const response = await axios.get(itemPageUrl);
    console.log("Response status code:", response.status);

    const $ = cheerio.load(response.data);

    // Extract information from specific HTML elements
    const title = $(".pr-detail__title").text().trim().replace(/\n/g, "");
    const brand = $('a[data-test-id="pr-brand-link"]')
      .text()
      .trim()
      .replace(/\n/g, "");

    // Extract availability from within the <strong> tag
    const availability = $(".avaliability.mb-3.mb-lg-4 strong")
      .text()
      .trim()
      .replace(/\n/g, "");

    const priceElement = $(".price-info-footer-final-price").filter(
      (index, element) => {
        return $(element).children("span").length === 0; // Filter out elements with <span>
      }
    );

    const price = priceElement.text().trim().replace(/\n/g, "");

    // Extract the description text excluding content within <style> tags
    const description = $(".text.pagebuilder-text")
      .clone() // Clone to prevent modification of the original elements
      .find("style")
      .remove() // Remove content within <style> tags
      .end() // Return to the original set of elements
      .text()
      .trim()
      .replace(/\n/g, "");

    // Extract the photo link from <figure data-test-id="product-detail-gallery-image" data-v-c2544cbc>
    const photo =
      $(
        'figure[data-test-id="product-detail-gallery-image"] picture[data-v-056e82f4][data-v-c2544cbc] img'
      ).attr("src") || "";

    // Prepend the base URL to the photo link
    const fullPhotoUrl = photo
      ? url.resolve("https://www.drmax.ro", photo)
      : "";


    const itemInfo = {
      category: category,
      title: title,
      brand: brand,
      availability: availability,
      price: price,
      description: description,
      photo: fullPhotoUrl,
    };

    // Split the category string using "*"
    const categoryParts = itemInfo.category.split("*");

    // Remove the word "Farmacie" from the first part (if it exists)
    if (categoryParts.length > 0) {
      categoryParts[0] = categoryParts[0].replace(/^Farmacie\s*/i, "").trim();
    }

    // Create an object to store the transformed values
    const transformedItemInfo = {
      category: categoryParts.length > 1 ? categoryParts[1] : "", // Category is now words2
    };

    // Loop through the remaining parts to create subcategories dynamically
    for (let i = 2; i < categoryParts.length-1; i++) {
      transformedItemInfo[`subcategory${i - 1}`] = categoryParts[i].trim();
    }

    // Clean up the price field
    if (itemInfo.price) {
      transformedItemInfo.price =
        parseFloat(itemInfo.price.replace(/[^\d.,]/g, "").replace(",", ".")) ||
        0;
    }
    transformedItemInfo.title = itemInfo.title;
    transformedItemInfo.brand = itemInfo.brand;
    transformedItemInfo.availability = itemInfo.availability;
    transformedItemInfo.description = itemInfo.description;
    transformedItemInfo.photo = itemInfo.photo;

    return transformedItemInfo;
  } catch (error) {
    console.error(`Failed to fetch item page. Error: ${error.message}`);
    return null;
  }
}

async function crawlAndSaveJson(listingPageUrl, outputFolder) {
  try {
    const response = await axios.get(listingPageUrl);
    const $ = cheerio.load(response.data);

    const items = [];

    // Extract all categories from breadcrumb items with data-test-id="navigation-breadcrumb-item"
    const breadcrumbItems = $(
      '[data-test-id="navigation-breadcrumb-item"] span'
    );
    const categories = breadcrumbItems
      .map((index, element) => $(element).text().trim())
      .get();

    // Concatenate categories with an asterisk
    const formattedCategory = categories.join("*");

    // Extract information from each item
    $(".tile__name a").each(async (index, element) => {
      const relativeItemPageUrl = $(element).attr("href");
      const absoluteItemPageUrl = url.resolve(
        listingPageUrl,
        relativeItemPageUrl
      );

      await delay(1000); // Add a delay of 1 second between requests
      const itemInfo = await extractItemInfo(
        absoluteItemPageUrl,
        formattedCategory,
        `subcategory${index + 1}`
      );

      if (itemInfo) {
        items.push(itemInfo);
      }

      // Save the JSON to a file when all items are processed
      if (index === $(".tile__name a").length - 1) {
        const result = {
          items: items,
        };

        // Convert the result to a JSON string
        const jsonData = JSON.stringify(result, null, 2);

        // Create the "database" folder if it doesn't exist
        if (!fs.existsSync(outputFolder)) {
          fs.mkdirSync(outputFolder);
        }

        const timestamp = new Date().getTime();
        const outputFile = path.join(
          outputFolder,
          `output_page_${timestamp}.json`
        );
        fs.writeFileSync(outputFile, jsonData, "utf-8");
      }
    });
  } catch (error) {
    console.error(`Failed to fetch listing page. Error: ${error.message}`);
  }
}

// async function downloadAndSaveImage(photoUrl) {
//   try {
//     if (photoUrl) {
//       const response = await axios.get(photoUrl, {
//         responseType: "arraybuffer",
//       });
//       const imageBuffer = Buffer.from(response.data);

//       // Create the "images" folder if it doesn't exist
//       const imagesFolder = "images";
//       if (!fs.existsSync(imagesFolder)) {
//         fs.mkdirSync(imagesFolder);
//       }

//       // Save the image to the "images" folder with a unique filename
//       const imageName = `image_${Date.now()}.jpg`;
//       const imagePath = path.join(imagesFolder, imageName);
//       await sharp(imageBuffer).jpeg().toFile(imagePath);
//       console.log(`Image saved: ${imagePath}`);
//     }
//   } catch (error) {
//     console.error(`Failed to download and save image. Error:`, error);
//   }
// }

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Example usage
const startPage = 0;
const endPage = 1;
const outputFolder = "database";

// for (let page = startPage; page <= endPage; page++) {
//   const pageUrl = `https://www.drmax.ro/medicamente-fara-reteta/durere`;
//   crawlAndSaveJson(pageUrl, outputFolder);
// }


const urlFilePath = 'url.txt'; // Adjust the file path accordingly

const rl = readline.createInterface({
    input: fs.createReadStream(urlFilePath),
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    // For each line in the file, call crawlAndSaveJson
    // for (let page = startPage; page <= endPage; page++) {
        const pageUrl = line.trim();
        console.log(pageUrl);
        crawlAndSaveJson(pageUrl, outputFolder);
      // }
});

rl.on('close', () => {
    console.log('Finished processing all URLs.');
});
"use server"
import puppeteer from "puppeteer";
import { Cluster } from "puppeteer-cluster";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import axios from "axios";
import UserAgent from "user-agents";

let categoryHost;
export const ExtractProductLiknsAndExecute = async (browser, page, link) => {
    try {
        const { host } = new URL(link);
        categoryHost = host
        await page.setUserAgent(await mockUserAgent());
        const headers = { referer: "https://www.amazon.in" };
        await page.setExtraHTTPHeaders(headers);
        await page.goto(link, { waitUntil: "networkidle2" });
        try {
            await page.waitForSelector("#nav-logo-sprites", { timeout: 2000 })
        } catch (error) {
            await page.reload()
            // await page.waitForNetworkIdle();  
        }
        // await page.waitForSelector("#gridItemRoot", { timeout: 10000 });
        let productLinks = await page.$$eval(
            "#gridItemRoot",
            (elements) => {
                return elements.map((element) => {
                    console.log('getting product link...');
                    const productLink = element.querySelector("a")?.getAttribute("href");
                    return productLink;
                });
            }
        );

        if (productLinks.length < 1) {
            productLinks = await page.$$eval(
                '[data-component-type="s-search-result"]:not(.AdHolder)',
                (elements) => {
                    return elements.map((element) => {
                        const anchor = element.querySelector("a");
                        const productLink = anchor ? anchor.getAttribute("href") : null;
                        return productLink;
                    });
                }
            );
        }
        const products = await ClusterExecution(productLinks)
        await browser.close()
        return products;
    }
    catch (e) {
        await browser.close()
        console.log("Error While Category Execution :" + e.message);
        return null;
    }
};


export const ClusterExecution = async (links) => {
    try {
        let data = [];
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            maxConcurrency: parseInt(process.env.MAX_CONCURRENCY),
            puppeteerOptions: {
                headless: false,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            }
        });

        await cluster.task(async ({ page, data: url }) => {
            try {
                const headers = { referer: "https://www.google.com" };
                await page.setExtraHTTPHeaders(headers);
                const product = await scrapeSingleProduct(url, page)
                data.push(product)
            } catch (error) {
                console.log(error)
            }
        });
        for (let link of links) {
            try {
                new URL(link);
            } catch (error) {
                link = "https://" + categoryHost + link
            }
            cluster.queue(link);
        }

        await cluster.idle();
        await cluster.close();
        return data;
    } catch (error) {
        console.log("Error while clustring: " + error)
    }
}

export const scrapeSingleProduct = async (link, page) => {
    try {
        await page.setUserAgent(await mockUserAgent());
        const headers = { referer: "https://www.google.com" };
        await page.setExtraHTTPHeaders(headers);
        await page.setViewport({ width: 1200, height: 700 })
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if (request.url() == link || request.url().includes("https://www.amazon.in/product-reviews/") || request.url().includes("product-reviews")) {
                request.continue();
            } else {
                request.abort();
            }
        });
        await page.goto(link, { waitUntil: 'networkidle2' })
        await page.setCacheEnabled(false);
        try {
            await page.waitForSelector("span#productTitle", { timeout: 5000 })
        } catch (error) {
            await page.reload()
            await page.waitForNetworkIdle();
        }
        let pageLink = page.url();
        const productID = pageLink.split("/dp/")[1].split("/")[0].split("?")[0];

        const productFolder = path.join(process.cwd(), `/public/images/products/${productID}`);
        if (!fs.existsSync(productFolder)) {
            fs.mkdirSync(productFolder, { recursive: true });
        }

        await page.exposeFunction("saveImageToLocal", (imageSrc, imageName, folderPath) =>
            saveImageToLocal(imageSrc, imageName, folderPath))

        // try {
        //     await page.waitForSelector("div.a-box-group", { timeout: 2000 });
        // } catch (error) {
        //     // this is different layout product scrape with other way!!
        //     return refreshForNotRegularLayout(page, link, productFolder)
        // }

        let productDetail = await page.evaluate(async (link, folderPath) => {

            let productDetail = { url: link }
            const productID = link.split("/dp/")[1].split("/")[0].split("?")[0];
            productDetail.productID = productID

            const titleElement = document.querySelector("#productTitle");
            const title = titleElement ? titleElement.textContent?.trim() : "";
            productDetail.title = title

            const priceToPayElm = document.querySelector("span.a-price-whole")
            if (priceToPayElm) {
                const priceToPay = priceToPayElm.textContent.replace(/[₹,$€,]/g, '').trim();
                productDetail.priceToPay = Number(priceToPay)
            }

            const mrpElement = document.querySelector('span.a-text-price.a-price[data-a-strike="true"]>span[aria-hidden="true"]')
            if (mrpElement) {
                const mrp = mrpElement.textContent.replace(/[₹,$€,]/g, '').trim();
                productDetail.mrp = Number(mrp)
            }
            const savingsPercentageElm1 = document.querySelector('span.reinventPriceSavingsPercentageMargin')
            const savingsPercentageElm2 = document.querySelector('td.a-span12.a-color-price.a-size-base > span.a-color-price')
            if (savingsPercentageElm1) {
                const savingsPercentage = savingsPercentageElm1.textContent.replace(/[-,%]/g, '').trim();
                productDetail.savingsPercentage = Number(savingsPercentage)
            }
            if (!savingsPercentageElm1 && savingsPercentageElm2) {
                const savingsPercentage = savingsPercentageElm2.textContent?.split("(").pop().replace(/[-,%,(,)]/g, '').trim();
                productDetail.savingsPercentage = Number(savingsPercentage)
            }

            const ratingElement = document.querySelector("#averageCustomerReviews span.a-icon-alt");
            let rating = ratingElement ? ratingElement.textContent?.trim() : "";
            rating = parseFloat(rating.replace(/[^0-9.]/g, ""));
            productDetail.rating = rating;

            const reviewCountElement = document.querySelector("#acrCustomerReviewText");
            let reviewCount = reviewCountElement ? reviewCountElement.textContent?.trim() : "";
            reviewCount = parseInt(reviewCount.replace(/[^0-9]/g, ""), 10);
            productDetail.reviewCount = reviewCount;

            const brandElement = document.querySelector("#bylineInfo");
            if (brandElement) {
                data = brandElement.textContent?.trim() || "";
                const regex = /Brand:\s*(.*)|Visit the\s*(.*)\s*Store/;
                const matches = data.match(regex);
                if (matches) {
                    const brandName = matches[1] || matches[2];
                    brand = brandName.trim();
                    productDetail.brand = brand
                }
            }

            const warrantyElement = document.querySelector("#WARRANTY");
            let warrantyInfo = "No Warranty";
            if (warrantyElement) {
                const spanElement = warrantyElement.querySelector("span");
                if (spanElement) {
                    warrantyInfo = spanElement.textContent?.trim() || "";
                    productDetail.warrantyInfo = warrantyInfo
                }
            }
            const replacementElement =
                document.querySelector("#RETURNS_POLICY");
            let replacementInfo = "Non Returnable";
            if (replacementElement) {
                const spanElement = replacementElement.querySelector("span");
                if (spanElement) {
                    replacementInfo = spanElement.textContent?.trim() || "";
                    productDetail.replacementInfo = replacementInfo
                }
            }
            const sellerElement = document.querySelector("#merchant-info a");
            let seller = "";
            if (sellerElement) {
                seller = sellerElement.textContent?.trim() || "";
                productDetail.seller = seller
            }

            const descriptionElement = document.querySelector("#feature-bullets");
            const description = descriptionElement ? descriptionElement.textContent?.trim()
                : "";
            productDetail.description = description

            const imageElement = document.querySelector(".imgTagWrapper >img");
            let mainImageSrc = "";
            if (imageElement) {
                mainImageSrc = imageElement.getAttribute("src") || "";
                const imageName = `mainImage.png`;
                const imgs = await saveImageToLocal(
                    mainImageSrc,
                    imageName,
                    folderPath
                );
                if (!imgs) throw new Error("Error saving image of " + productID)
                mainImageSrc = imgs.pngImagePath;
                productDetail.mainImageSrc = mainImageSrc
            }

            const availabilityElement = document.querySelector("#availability");
            if (availabilityElement) {
                const spanElement = availabilityElement.querySelector("span");
                const aElement = availabilityElement.querySelector("a");
                if (spanElement) {
                    availability = spanElement.textContent?.trim() || "";
                } else if (aElement) {
                    availability = aElement.textContent?.trim() || "";
                    productDetail.availability = availability
                }
            }

            

            const timesBoughtElement = document.querySelector(".social-proofing-faceout");
            let soldInPastMonth;
            if (timesBoughtElement != null || timesBoughtElement != undefined) {
                const timesBoughtText = timesBoughtElement
                    ? timesBoughtElement.textContent
                        ? timesBoughtElement.textContent.trim()
                        : ""
                    : "";
                const regex = /^(\d*\.?\d+)([KkMm])?\+?.*$/;
                const match = timesBoughtText.match(regex);

                if (match) {
                    const number = parseFloat(match[1]);
                    const multiplier = match[2] ? match[2].toLowerCase() : null;

                    if (multiplier === "k") {
                        soldInPastMonth = Math.floor(number * 1000);
                    } else if (multiplier === "m") {
                        soldInPastMonth = Math.floor(number * 1000000);
                    } else {
                        soldInPastMonth = number;
                    }
                }
                productDetail.soldInPastMonth = soldInPastMonth
            }
            return productDetail
        }, link, productFolder);
        productDetail.reviews = await productReviews(page, productID)
        return productDetail
    } catch (error) {
        console.log("Error while Scraping Siingle Product: " + error.message);
        return null;
    }
}

export const saveImageToLocal = async (imageSrc, imageName, folderPath) => {
    try {
        const response = await axios.get(imageSrc, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        const imagesFolder = folderPath || path.join(process.cwd(), 'public', 'images','products');
        if (!fs.existsSync(imagesFolder)) {
            fs.mkdirSync(imagesFolder, { recursive: true });
        }

        imageName = imageName.replace(/\.[^/.]+$/, '');
        const pngImagePath = path.join(imagesFolder, `${imageName}.png`);
        fs.writeFileSync(pngImagePath, buffer);

        const webpImagePath = path.join(imagesFolder, `${imageName}.webp`);
        await sharp(buffer).toFormat('webp').toFile(webpImagePath);

        return { pngImagePath, webpImagePath };
    } catch (error) {
        console.error(`Error saving image ${imageName}:`, error);
        throw new Error("error while saving image: " + error.message);
    }
};

export const refreshForNotRegularLayout = async (page, link, folderPath) => {
    try {
        let productDetail = await page.evaluate(async (link, folderPath) => {

            let productDetail = { url: link }
            const productID = link.split("/dp/")[1].split("/")[0].split("?")[0];
            productDetail.productID = productID

            const titleElement = document.querySelector("#btAsinTitle > span[title]");
            const title = titleElement.getAttribute("title") ? titleElement.textContent?.trim() : "";
            productDetail.title = title

            const pageDetails = document.querySelector("head > script[type='application/ld+json']")
            let pageJsonData = pageDetails?.textContent;
            pageJsonData = JSON.parse(pageJsonData);
            productDetail.priceToPay = Number(pageJsonData.offers[0].price)
            productDetail.description = pageJsonData.description
            productDetail.rating = pageJsonData.aggregateRating.ratingValue
            productDetail.reviewCount = pageJsonData.aggregateRating.ratingCount

            const brandElement = document.querySelector("a#brand");
            if (brandElement) {
                productDetail.brand = brandElement.textContent?.trim() || "";
            }
            const sellerElement = document.querySelector(" div.atf-dp-content-text > div:nth-child(2) > span:nth-child(2)");
            let seller = "";
            if (sellerElement) {
                seller = sellerElement.textContent?.trim() || "";
                productDetail.seller = seller
            }

            const imageElement = document.querySelector("img#js-masrw-main-image");
            let mainImageSrc = "";
            if (imageElement) {
                mainImageSrc = imageElement.getAttribute("src") || "";
                const imageName = `mainImage.png`;
                const imgs = await saveImageToLocal(
                    mainImageSrc,
                    imageName,
                    folderPath
                );
                if (!imgs) throw new Error("Error saving image of " + productID)
                mainImageSrc = imgs.pngImagePath;
                productDetail.mainImageSrc = mainImageSrc
            }

            const availabilityElement = document.querySelector("div[data-outofstock]");
            if (availabilityElement) {
                const isOutOFStock = availabilityElement.getAttribute("data-outofstock");
                if (!isOutOFStock) {
                    productDetail.availability = "In stock"
                } else {
                    productDetail.availability = "Out of stock"
                }
            }
            return productDetail
        }, link, folderPath);
        // console.log(productDetail)
        return productDetail
    } catch (error) {
        console.log(error);
        return;
    }
}

export const productReviews = async function (page, productId) {
    try {
        // scraping top reviews and verified purchases only (change as needed)
        const reviewLink = `https://www.amazon.in/product-reviews/${productId}/ref=cm_cr_arp_d_viewopt_rvwer?reviewerType=avp_only_reviews&pageNumber=1`
        try {
            await page.goto(reviewLink, { waitUntil: 'networkidle0' });
        } catch (error) {
            console.log(error)
        }
        try {
            await page.waitForSelector('div.review[data-hook="review"]')
        } catch (error) {
            throw new Error("product doesn't has any review yet!")
        }
        let nextPage = true;
        let reviewPage = 1;
        let allReviews = []
        while (nextPage) {
            const reviews = await reviewScraper();
            allReviews = [...allReviews, ...reviews];
            try {
                await page.waitForSelector('li.a-last>a', { timeout: 2000 });
                await page.click("li.a-last>a");
                await page.waitForTimeout(500);
            } catch (error) {
                nextPage = false;
            }
            reviewPage++;
        }
        return allReviews;

        async function reviewScraper() {
            const reviews = await page.evaluate(() => {
                const reviewBlocks = document.querySelectorAll('div.review[data-hook="review"]')
                return Array.from(reviewBlocks, block => {
                    let review = {};
                    const reviewRatingElm = block.querySelector('i[data-hook="review-star-rating"]');
                    if (reviewRatingElm) {
                        review.ratingOutOf5 = Number(reviewRatingElm.textContent.split("out")[0].trim())
                    }

                    const titleElm = block.querySelector('a[data-hook="review-title"]');
                    if (titleElm) {
                        const title = titleElm.querySelector("span.a-letter-space").nextElementSibling?.textContent?.trim()
                        review.title = title.replace(/\\n|\+/g, "");
                    }
                    const reviewTextElm = block.querySelector('span[data-hook="review-body"]');
                    if (reviewTextElm) {
                        review.comment = reviewTextElm.textContent?.trim().replace(/\\n|\+/g, "");
                    }
                    return review;
                })
            })
            return reviews
        }
    } catch (error) {
        console.log("Error While getting review: " + error)
    }

}


export const createBrowserAndPage = async function () {
    const browser = await puppeteer.launch({ headless: false });
    const newPage = await browser.newPage();
    return { newPage, browser }
}

export const mockUserAgent = async function () {
    return  new UserAgent({ platform: 'Win32' }).toString();
}




import Product from "@/models/product";
import puppeteer from "puppeteer";
import path from 'path';
import fs from 'fs';
import sharp from "sharp";
import { connectToDB } from "@/utils/db";
import { NextResponse } from "next/server";

connectToDB()

export async function GET(request, { params }) {
    let productId = await params.productId;
    try {
        let product = await Product.findById(productId).select("-variants").populate({
            path: 'category',
            select: 'categoryName'
          });
        if(!product||!Array.isArray(product)&&product.length) {
            throw new Error("No product found of given id")
        }
        const {data, success, message} = await scrape(product);
        if(success){
            Object.keys(data).forEach(async (key) => {
                if (product[key] !== data[key]) {
                  product[key] = data[key];
                }
              });
        
              await product.save();
            return NextResponse.json({
                data,
                success,
                message
            })
        }else{
            return NextResponse.json({
                message,
                success
            })
        }
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            message: error.message,
            success: false
        });
    }
}

const saveImageToLocal = async (imageSrc, imageName, folderPath) => {
    try {
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      await page.goto(imageSrc, { waitUntil: "networkidle0" });
  
      const imageHandle = await page.$("img");
      if (!imageHandle) {
        throw new Error("Could not find the image element");
      }
  
      const buffer = await imageHandle.screenshot();
      // await page.close();
      await browser.close();
  
      const imagesFolder = folderPath || path.join(process.cwd(), 'public', 'images');
      if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder, { recursive: true });
      }
      
      imageName = imageName.replace(/\.[^/.]+$/, '')
      const pngImagePath = path.join(imagesFolder, `${imageName}.png`);
      fs.writeFileSync(pngImagePath, buffer);
  
      // console.log(`${imageName}.png saved successfully!`);
  
      const webpImagePath = path.join(imagesFolder, `${imageName}.webp`);
      await sharp(buffer)
        .toFormat('webp')
        .toFile(webpImagePath);
  
      // console.log(`${imageName}.webp saved successfully!`);
  
      return { pngImagePath, webpImagePath };
      // return imagePath;
    } catch (error) {
      console.error(`Error saving image ${imageName}:`, error);
    }
  };

async function scrape (product) {
    const browser = await puppeteer.launch({ headless: false });
    const productPage = await browser.newPage();
    try {
        await productPage.exposeFunction(
            "saveImageToLocal",
            (imageSrc, imageName,productFolder) =>
              saveImageToLocal(imageSrc, imageName, productFolder)
          );
        const productFolder = path.join(process.cwd(), `/public/${product.productID}`);
        if (!fs.existsSync(productFolder)) {
          fs.mkdirSync(productFolder, { recursive: true });
        }
        await productPage.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36"
          );
      
          const headers = {
            referer: "https://www.google.com",
          };
      
          await productPage.setExtraHTTPHeaders(headers);
          await productPage.goto(product.url, { waitUntil: "networkidle2" });
          let productDetail = await productPage.evaluate(async (product,folderPath) => {
            const extractVariantInfo = (divElement, label) => {
              let variantLink = divElement.getAttribute("data-dp-url");
              variantLink = `https://www.amazon.in${variantLink}`;
              const variantImageElement =
                divElement.querySelector("img.imgSwatch");
              let variantImageSrc =
                variantImageElement?.getAttribute("src") || "";
              const variantImageAlt =
                variantImageElement?.getAttribute("alt") || "";
              const variantTextButton =
                divElement.querySelector(".twisterTextDiv.text p")?.textContent ||
                "";
  
              return {
                variantLink,
                variantImageSrc,
                variantImageAlt,
                variantTextButton,
                label,
              };
            };
            const productIDElement = document.querySelector(
              "#imageBlock_feature_div"
            );
            const productID = productIDElement
              ? productIDElement.getAttribute("data-csa-c-asin")
              : "";
            const titleElement = document.querySelector("#productTitle");
            const title = titleElement ? titleElement.textContent?.trim() : "";
            const priceElements = document.evaluate(
              "//div[contains(@id, 'corePriceDisplay_desktop_feature_div')]",
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            );
            const priceElement = priceElements.singleNodeValue;
            let savingsPercentage = priceElement
              ? priceElement.querySelector(".savingsPercentage").textContent?.trim()
              : "";
            let priceToPay = priceElement
              ? priceElement.querySelector(".a-price-whole").textContent?.trim()
              : "";
            let mrp = priceElement
              ? priceElement
                  .querySelector(".a-price.a-text-price")
                  .textContent?.trim()
              : "";
            const regex = /₹([0-9,]+)/;
            const match = mrp.match(regex);
            if (match) {
              mrp = match[1];
            }
            mrp = Number(mrp.replace(/[^0-9]/g, ""));
            savingsPercentage = Number(savingsPercentage.replace(/[^\d-]/g, ""));
            priceToPay = Number(priceToPay.replace(/[^0-9]/g, ""));
            const ratingElement = document.querySelector(
              "#averageCustomerReviews span.a-icon-alt"
            );
            let rating = ratingElement ? ratingElement.textContent?.trim() : "";
            const reviewCountElement = document.querySelector(
              "#acrCustomerReviewText"
            );
            let reviewCount = reviewCountElement
              ? reviewCountElement.textContent?.trim()
              : "";
            rating = parseFloat(rating.replace(/[^0-9.]/g, ""));
    
            // Convert the review count to a number
            reviewCount = parseInt(reviewCount.replace(/[^0-9]/g, ""), 10);
            const brandElement = document.querySelector("#bylineInfo");
            let brand = "";
            if (brandElement) {
              data = brandElement.textContent?.trim();
              const regex = /Brand:\s*(.*)|Visit the\s*(.*)\s*Store/;
              const matches = data.match(regex);
              if (matches) {
                const brandName = matches[1] || matches[2];
                brand = brandName.trim();
              }
            }
            const warrantyElement = document.querySelector("#WARRANTY");
            let warrantyInfo = "No Warranty";
            if (warrantyElement) {
              const spanElement = warrantyElement.querySelector("span");
              if (spanElement) {
                warrantyInfo = spanElement.textContent?.trim();
              }
            }
            const replacementElement = document.querySelector("#RETURNS_POLICY");
            let replacementInfo = "Non Returnable";
            if (replacementElement) {
              const spanElement = replacementElement.querySelector("span");
              if (spanElement) {
                replacementInfo = spanElement.textContent?.trim();
              }
            }
            const sellerElement = document.querySelector("#merchant-info a");
            let seller = "";
            if (sellerElement) {
              seller = sellerElement.textContent?.trim();
            }
            const descriptionElement = document.querySelector("#feature-bullets");
            const description = descriptionElement
              ? descriptionElement.textContent?.trim()
              : "";
              const imageElement = document.querySelector(".imgTagWrapper img");
              let mainImageSrc = "";
              if (imageElement) {
                mainImageSrc = imageElement.getAttribute("src") || "";
                const imageName = `mainImage.png`;
                const imgs = await saveImageToLocal(
                  mainImageSrc,
                  imageName,
                  folderPath
                );
                mainImageSrc = imgs.pngImagePath
              }
            const availabilityElement = document.querySelector("#availability");
            let availability = "";
            if (availabilityElement) {
              const spanElement = availabilityElement.querySelector("span");
              const aElement = availabilityElement.querySelector("a");
    
              if (spanElement) {
                availability = spanElement.textContent?.trim();
              } else if (aElement) {
                availability = aElement.textContent?.trim();
              }
            }
            const variantElement = document.querySelector("#twister");
            let variants = [];
            if (variantElement) {
              const variantGroupsDivs = variantElement.querySelectorAll(
                "div.a-spacing-small"
              );
    
              for (const variantGroupDiv of variantGroupsDivs) {
                const variantLabelElement =
                  variantGroupDiv.querySelector("label.a-form-label");
                const label = variantLabelElement
                  ? variantLabelElement.textContent?.trim()
                  : "";
    
                const variantItems = variantGroupDiv.querySelectorAll(
                  "ul.a-button-list li[data-csa-c-type='item']"
                );
    
                for (const variantItem of variantItems) {
                  const variantInfo = extractVariantInfo(variantItem, label);
    
                  console.log(variantInfo.variantImageSrc,' - issue');
                  if (variantInfo.variantImageSrc) {
                    const absoluteImageSrc = new URL(variantInfo.variantImageSrc).href;
  
                    // const imgs = await saveImageToLocal(
                    //   absoluteImageSrc,
                    //   `variant_${variantInfo.variantImageAlt || "image"}.png`,
                    //   folderPath
                    // );
                    // variantInfo.variantImageSrc = imgs.pngImagePath
                  }
    
                  variants.push(variantInfo);
                }
              }
            }
            const timesBoughtElement = document.querySelector(
              ".social-proofing-faceout"
            );
            let soldInPastMonth;
    
            if (timesBoughtElement) {
              const timesBoughtText = timesBoughtElement.textContent?.trim() || "";
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
            }
    
            return {
              productID,
              title,
              brand,
              mainImageSrc,
              savingsPercentage,
              priceToPay,
              mrp,
              rating,
              reviewCount,
              description,
              availability,
              warrantyInfo,
              replacementInfo,
              seller,
              url: product.url,
              variants,
              soldInPastMonth,
            };
          },product,productFolder);
          await productPage.close();
          await browser.close();
          return {data: productDetail, success: true, message: 'Scraped Successfully.'}
    } catch (error) {
        await productPage.close()
        await browser.close()
        return error
    }
}
import path from "path";
import fs from "fs";
import sharp from "sharp";
import axios from "axios";

export const saveImageToLocal = async (imageSrc, imageName, folderPath) => {
    try {
      const response = await axios.get(imageSrc, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);
  
      const imagesFolder = folderPath || path.join(process.cwd(), 'public', 'images');
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
    }
  };
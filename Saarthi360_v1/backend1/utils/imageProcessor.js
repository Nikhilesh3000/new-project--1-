// utils/imageProcessor.js
import sharp from "sharp";

/**
 * Process a base64 image: resize and compress it.
 * @param {string} base64Image - The image as a base64 string.
 * @returns {Promise<string|null>} - The processed base64 image string or original.
 */
export default async function processImage(base64Image) {
  if (!base64Image) return null;

  const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return base64Image;

  const imageBuffer = Buffer.from(matches[2], "base64");
  const processedImageBuffer = await sharp(imageBuffer)
    .resize(300, 300, { fit: "inside" })
    .jpeg({ quality: 70 })
    .toBuffer();

  return `data:${matches[1]};base64,${processedImageBuffer.toString("base64")}`;
}

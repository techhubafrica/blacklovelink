/**
 * crop_collage.mjs
 * Splits a 2x2 photo collage into 4 individual images.
 * Usage: node crop_collage.mjs <input_image> <person_slug>
 * Example: node crop_collage.mjs "C:/Users/pc/Downloads/Gemini_Generated_Image_ds3pytds3pytds3p.png" amara-osei
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const [,, inputPath, personSlug] = process.argv;

if (!inputPath || !personSlug) {
  console.error('Usage: node crop_collage.mjs <input_image_path> <person-slug>');
  process.exit(1);
}

const outDir = path.join(__dirname, 'demo-photos', personSlug);
fs.mkdirSync(outDir, { recursive: true });

// Labels: top-left=profile pic, others are gallery photos
const labels = ['profile', 'photo-2', 'photo-3', 'photo-4'];

async function crop() {
  const meta = await sharp(inputPath).metadata();
  const { width, height } = meta;

  const halfW = Math.floor(width / 2);
  const halfH = Math.floor(height / 2);

  const quadrants = [
    { left: 0,     top: 0,     width: halfW, height: halfH }, // top-left  → profile pic
    { left: halfW, top: 0,     width: halfW, height: halfH }, // top-right → photo-2
    { left: 0,     top: halfH, width: halfW, height: halfH }, // bot-left  → photo-3
    { left: halfW, top: halfH, width: halfW, height: halfH }, // bot-right → photo-4
  ];

  for (let i = 0; i < quadrants.length; i++) {
    const outFile = path.join(outDir, `${labels[i]}.jpg`);
    await sharp(inputPath)
      .extract(quadrants[i])
      .jpeg({ quality: 90 })
      .toFile(outFile);
    console.log(`✅  Saved: ${outFile}`);
  }

  console.log(`\nDone! 4 images saved to: ${outDir}`);
  console.log('Next: run upload_photos.mjs to push them to Supabase Storage.');
}

crop().catch(err => { console.error(err); process.exit(1); });

/**
 * upload_photos.mjs
 * Uploads all demo-photos/<person-slug>/ folders to Supabase Storage.
 * Each folder must contain: profile.jpg, photo-2.jpg, photo-3.jpg, photo-4.jpg
 *
 * Usage (run from project root):
 *   node --env-file=.env supabase/seeds/upload_photos.mjs               → upload all folders
 *   node --env-file=.env supabase/seeds/upload_photos.mjs amara-osei    → upload only amara-osei/
 *
 * Requires in .env (project root):
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ...
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'profile-photos';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌  Missing env vars. Make sure .env has VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const photosDir = path.join(__dirname, 'demo-photos');

// Which slugs to process — from CLI arg or all folders
const slugArg = process.argv[2];
const slugs = slugArg
  ? [slugArg]
  : fs.readdirSync(photosDir).filter(d =>
      fs.statSync(path.join(photosDir, d)).isDirectory()
    );

// Photo filenames inside each folder
const PHOTO_FILES = ['profile.jpg', 'photo-2.jpg', 'photo-3.jpg', 'photo-4.jpg'];

// Results: { slug -> [url1, url2, url3, url4] }
const results = {};

async function uploadFolder(slug) {
  const folderPath = path.join(photosDir, slug);
  const urls = [];

  for (const filename of PHOTO_FILES) {
    const localPath = path.join(folderPath, filename);
    if (!fs.existsSync(localPath)) {
      console.warn(`  ⚠️  Missing: ${localPath} — skipping`);
      urls.push(null);
      continue;
    }

    const storagePath = `demo/${slug}/${filename}`;
    const fileBuffer = fs.readFileSync(localPath);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error(`  ❌  Upload failed for ${storagePath}:`, error.message);
      urls.push(null);
      continue;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    urls.push(data.publicUrl);
    console.log(`  ✅  ${storagePath}`);
  }

  results[slug] = urls;
}

async function main() {
  console.log(`\n📦  Bucket: ${BUCKET}`);
  console.log(`📁  Uploading ${slugs.length} profile(s): ${slugs.join(', ')}\n`);

  for (const slug of slugs) {
    console.log(`👤  ${slug}`);
    await uploadFolder(slug);
  }

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋  PUBLIC URLs (paste into 02_demo_profiles.sql)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  for (const [slug, urls] of Object.entries(results)) {
    console.log(`-- ${slug}`);
    const safeUrls = urls.map(u => u ? `'${u}'` : 'NULL');
    console.log(`ARRAY[${safeUrls.join(', ')}]`);
    console.log();
  }
}

main().catch(err => { console.error(err); process.exit(1); });

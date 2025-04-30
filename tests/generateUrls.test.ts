import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { getSitemapUrls } from '../utils/siteMap';
import { reportToSitemap } from '../utils/reportToSitemap';




test('🛠 Generate URL list from sitemap.xml', async ({ request }) => {
  const sitemapUrl = 'https://yourdomain.com/sitemap.xml'; // Replace with your actual one

  // Check sitemap.xml is accessible
  const sitemapResponse = await request.get(sitemapUrl);
  expect(sitemapResponse.status()).toBe(200);

  //Log success to report
  await reportToSitemap('Sitemap.xml Check', 'sitemap.xml is accessible');

  // ✅ Step 2: Extract URLs
  const urls = await getSitemapUrls();
  fs.writeFileSync(path.join(__dirname, '../urls.json'), JSON.stringify(urls, null, 2));
  expect(urls.length).toBeGreaterThan(0);
});

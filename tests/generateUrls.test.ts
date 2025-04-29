import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { getSitemapUrls } from '../utils/siteMap';

test('🛠 Generate URL list from sitemap.xml', async () => {
  const urls = await getSitemapUrls();
  fs.writeFileSync(path.join(__dirname, '../urls.json'), JSON.stringify(urls, null, 2));
  expect(urls.length).toBeGreaterThan(0);
});

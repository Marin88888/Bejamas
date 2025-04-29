
import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Define the report file path
const reportPath = 'sitemap-crawl-report.md';


// Create the empty sections for the report
fs.writeFileSync(reportPath, [
  'Sitemap Crawl Report',
  '',
  'Broken Pages:',
  '',
  'Noindex Pages:',
  '',
  'Timeout Pages:',
  '',
  'Broken Internal Links:', 
  '',
  'Request Failures:',
  '',
].join('\n'), 'utf-8');


// Insert the lines under the correct section
function insertIntoSection(sectionHeader: string, lineToInsert: string) {
  // Read the entire contents of the existing report file into memory as a string
  const content = fs.readFileSync(reportPath, 'utf-8');

  // Split the content into an array of lines, based on newline characters
  const lines = content.split('\n');

  // Find the index of the section header where we want to insert the new line
  const sectionIndex = lines.findIndex(line => line.trim() === sectionHeader);

  if (sectionIndex !== -1) { 
    // If the section header was found
    // Insert the new line right after the section header (at index + 1)
    lines.splice(sectionIndex + 1, 0, lineToInsert);

    // Join the modified array of lines back into a single string
    // Then write (overwrite) the updated content back to the report file
    fs.writeFileSync(reportPath, lines.join('\n'), 'utf-8');
  }
}


//Load the URLs from urls.json file
const urls: string[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../urls.json'), 'utf-8')
);

// Start the tests in parallel
//Test Case 2: Sitemap and Crawlability Verification
test.describe.parallel('🌐 Sitemap Page Verification', () => {
  for (const url of urls.slice(0, 50)) {
    
    test(`🔍 Check: ${url}`, async ({ page, request }) => {
      try {
       
        //Check page response status
        
        const res = await request.get(url);
        const status = res.status();

        if (status !== 200) {
          insertIntoSection('Broken Pages:', `- ${url} - Broken (Status: ${status})`);
          return; // Stop if the page is broken
        }

        // Go to page page to check meta robots tag
        
        await page.goto(url, {
          timeout: 10000,
          waitUntil: 'domcontentloaded',
        });

        // Find meta[robots] tag
        const robotTag = page.locator('meta[name="robots"]');
        if (await robotTag.count() > 0) {
          const content = await robotTag.first().getAttribute('content');
          if (content?.includes('noindex')) {
            insertIntoSection('Noindex Pages:', `- ${url} - Marked as noindex`);
          }
        }

       
      // Test Case 3: 404 Link verification

      // Locate all internal links on the page that start with "http"
      const internalLinks = page.locator('a[href^="http"]');
      // Count how many internal links were found
      const linkCount = await internalLinks.count();
      // Loop through each internal link found on the page
      for (let i = 0; i < linkCount; i++) {
      // Get the href attribute (URL) of the current link
      const href = await internalLinks.nth(i).getAttribute('href');
      // If href is null or undefined, skip to the next link
      if (!href) continue; 
      // Send a GET request to the link's URL to check if it is accessible
      const linkResponse = await request.get(href);

      // If the response status is 404
      if (linkResponse.status() === 404) {
      // Insert a line into the 'Broken Internal Links' section of the report
      insertIntoSection('## 🔗 Broken Internal Links:', `- ${url} ➔ Broken internal link to ${href} (404)`);
  }
}


      } catch (error) {
        
        // If anything else fails - log as request failure
        insertIntoSection('Request Failures:', `- ${url} - Request failed (${(error as Error).name})`);
      }
    });
  }
});

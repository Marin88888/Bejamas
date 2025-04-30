
import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';


// Define the report file path
const reportPath = 'sitemap-crawl-report.md';


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
  for (const url of urls) { 
    
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

      const internalLinks = await page.locator('a[href^="http"]').all();

      const hrefs = await Promise.all(
        internalLinks.map(link => link.getAttribute('href'))
      );
      
      const cleanHrefs = hrefs.filter(href => href);
      
      // Limit concurrency to 10 at a time
      const concurrencyLimit = 10;
      
      const checkLink = async (href: string | null) => {
        if (!href) return; // Skip nulls
      
        try {
          const res = await request.get(href, { timeout: 3000 });
          if (res.status() === 404) {
            insertIntoSection('Broken Internal Links:', `- ${url} ➔ Broken internal link to ${href} (404)`);
          }
        } catch {
          //insertIntoSection('Timeout Pages:', `- ${url} ➔ Link to ${href} timed out`);
        }
      };
      
      
      for (let i = 0; i < cleanHrefs.length; i += concurrencyLimit) {
        const chunk = cleanHrefs.slice(i, i + concurrencyLimit);
        await Promise.allSettled(chunk.map(checkLink));
      }
      

      } catch (error) {
        
      }
    });
  }
});

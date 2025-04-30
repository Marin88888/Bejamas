
import fs from 'fs';
import path from 'path';

export async function reportToSitemap(testName: string, message: string) {
  const filePath = path.join(process.cwd(), 'sitemap-crawl-report.md');
  const timestamp = new Date().toISOString();
  const entry = `- [${timestamp}] ${testName}: ${message}`;

  // If the report file doesn't exist, create full structure
  if (!fs.existsSync(filePath)) {
    const header = `Sitemap Crawl Report

Broken Pages:

Noindex Pages:

Broken Internal Links:

Successful Checks:

Unsuccessful Checks:

Sitemap check:
`;
    fs.writeFileSync(filePath, header);
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Determine which section to write to
  let sectionTitle: string;
  if (message.trim().startsWith('-+-')) {
    sectionTitle = 'Successful Checks:';
  } else if (message.trim().startsWith('xx')) {
    sectionTitle = 'Unsuccessful Checks:';
  } else {
    sectionTitle = 'Sitemap check:';
  }

  const lines = content.split('\n');
  let sectionIndex = lines.findIndex(line => line.trim() === sectionTitle);

  // Insert section if it does not exist
  if (sectionIndex === -1) {
    const insertBefore = lines.findIndex(line => line.trim() === 'Request Failures:');
    const insertionPoint = insertBefore !== -1 ? insertBefore : lines.length;
    lines.splice(insertionPoint, 0, sectionTitle, '');
    sectionIndex = lines.findIndex(line => line.trim() === sectionTitle);
  }

  lines.splice(sectionIndex + 1, 0, entry);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');

  console.log(`📄 Logged to '${sectionTitle}': ${message}`);
}

export async function logSuccess(testName: string, message: string) {
  await reportToSitemap(testName, ` ${message}`);
}

export async function logWarning(testName: string, message: string) {
  await reportToSitemap(testName, ` ${message}`);
}

export async function logFailure(testName: string, message: string) {
  await reportToSitemap(testName, message); // no symbol = failure
}


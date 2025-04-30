// utils/initializeReport.ts
import fs from 'fs';
import path from 'path';

export function initializeReportFile() {
  const filePath = path.join(process.cwd(), 'sitemap-crawl-report.md');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, [
      'Sitemap Crawl Report',
      '',
      'Broken Pages:',
      '',
      'Noindex Pages:',
      '',
      'Broken Internal Links:',
      '',
      'Successful Checks:',
      '',
      'Unsuccessful Checks:',
      '',
      'Sitemap xml check:',
      ''
    ].join('\n'), 'utf-8');
  }
}

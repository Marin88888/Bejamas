// globalSetup.ts
import fs from 'fs';
import path from 'path';

export default async function globalSetup() {
  const reportPath = path.join(process.cwd(), 'sitemap-crawl-report.md');
  if (!fs.existsSync(reportPath)) {
    fs.writeFileSync(reportPath, [
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
      'SiteMap check:',
      ''
    ].join('\n'), 'utf-8');
  }
}

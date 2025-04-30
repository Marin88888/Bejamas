Playwright Test Suite for Netlify Website

• This repository contains an automated test suite for verifying critical functionality and SEO compliance of the Netlify website using Playwright.

• Features

    1) Lead capture form validation (valid and invalid input handling)

    2) Sitemap accessibility and SEO metadata verification

    3) Detection of internal broken links (404s)

    4) Generates a categorized Markdown report

• Setup Instructions

    1) Clone the repository

        git clone https://github.com/Marin88888/Bejamas.git
        cd netlify-playwright-tests

    2)Install dependencies

        npm install

    3)Ensure Playwright browsers are installed

        npx playwright install  

• Test Execution Instructions


    Step-by-step Run Order

    • Test Case 1: Lead Capture Form ValidationThis test validates the email subscription form on the Netlify homepage.

            npx playwright test tests/leadForm.test.ts

    • Test Case 2.1: Generate URL List from SitemapThis script fetches URLs from https://www.netlify.com/sitemap.xml and stores them in 
      urls.json.

            npx playwright test tests/generateUrls.test.ts

    • Test Case 2.2 + 3: Sitemap Verification & 404 Link CheckThis test:

        • Verifies all sitemap URLs respond with 200

        • Checks for robots meta tags containing noindex

        • Detects broken internal links returning 404

        • Categorizes failures into an auto-generated sitemap-crawl-report.md

            npx playwright test tests/siteMapVerification.test.ts


• Test Cases Summary

    Test Case 1: Lead Capture Form Validation

        • Navigate to Netlify homepage

        • Submit newsletter form with invalid email

        • Validate no redirection occurs to success page

        • Submit with valid email and confirm success redirection

        • Validate page loads, title includes "Netlify" and HTTP 200

    Test Case 2: Sitemap and Crawlability Verification

        • Ensure sitemap.xml is accessible and parsed

        • Validate each page responds with HTTP 200

        • Ensure no meta[name="robots"] tag includes noindex

    Test Case 3: 404 Internal Link Verification

        • Crawl every page listed in the sitemap

        • For each page, collect all <a href="http..."> links

        • Send HTTP requests to those links

        • Log if any return 404 into report

• Brief Explanation of Approach

    I used a modular structure with:

        • leadForm.test.ts --> for UI form validation
        • generateUrls.test.ts --> for sitemap processing
        • siteMapVerification.test.ts --> for SEO & link validation
        • utils/siteMap.ts --> for sitemap parsing
        • pages/HomePage.ts --> as Page Object Model abstraction

    A Markdown report is dynamically updated during test execution with categorized results (broken links, noindex, timeout, internal 404s, etc.).  

• Sample Report Output

        See sitemap-crawl-report.md after test execution.
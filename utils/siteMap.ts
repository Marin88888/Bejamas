import axios from 'axios';

import { parseStringPromise } from 'xml2js';

//Declare an async function that returns a list of string URLs
export async function getSitemapUrls(): Promise<string[]> {
  //fetch the siteMap
  const res = await axios.get('https://www.netlify.com/sitemap.xml');
  const xml = res.data;
  //convert it into a Javascript object
  const parsed = await parseStringPromise(xml);
  //Go through the list of URLs and pick the first loc value from each.
  return parsed.urlset.url.map((entry: any) => entry.loc[0]);
}

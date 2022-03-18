import { parse } from "yaml";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import * as loki from "lokijs";
import { GumtreeAd, GumtreeSearch } from "./type";
import * as fs from "fs";
import * as path from "path";
import { v4 } from "uuid";

let currentStatus: string;

function log(...items: string[]) {
  console.log(...items);
  currentStatus = items.join(" ");
}

export function getCrawlStatus() {
  return currentStatus;
}

async function download(
  collection: Collection<GumtreeAd>,
  query: GumtreeSearch
) {
  try {
    let href = query.url;

    while (!!href) {
      log("Requesting:", href);
      const page = await fetch(href);
      log("Parsing:", href);
      const $ = cheerio.load(await page.text());

      const rows = $(".user-ad-row-new-design");

      const ads: GumtreeAd[] = rows
        .toArray()
        .map((row) => {
          const $row = cheerio.load(row);
          return {
            id: v4(),
            title: $row(".user-ad-row-new-design__title-span").text(),
            price: $row(".user-ad-price-new-design__price").text(),
            location: $row(".user-ad-row-new-design__location").text(),
            url: $row("a.user-ad-row-new-design").attr("href"),
          };
        })
        .filter((item) => !collection.findOne({ url: item.url }));

      console.log(ads);

      collection.insert(ads);

      const nextPage = $(
        ".page-number-navigation__link:has(.icon-slider-arrow)"
      );
      href = nextPage.attr("href");
    }
  } catch (ex) {
    log(ex);
  }
}

async function checkData(collection: Collection<GumtreeAd>) {
  log(
    "Finished, new items: ",
    collection.where((data) => !data.seen && !data.garbage).length.toString()
  );
}

export async function crawl(db: loki) {
  log("Loading searches");
  const list = fs
    .readFileSync(path.join(__dirname, "../gumtree-queries.yaml"))
    .toString("utf-8");

  const queries: GumtreeSearch[] = parse(list);
  const gumtreeAds = db.getCollection("gumtree");
  for (const query of queries) {
    await download(gumtreeAds, query);
  }
  await checkData(gumtreeAds);
}

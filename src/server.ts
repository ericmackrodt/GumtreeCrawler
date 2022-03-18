import * as express from "express";
import { getDb } from "./db";
import { GumtreeAd } from "./type";
import * as bodyParser from "body-parser";
import { crawl, getCrawlStatus } from "./crawler";
import {
  cleanGarbage,
  cleanNoLongerAvailableFavorites,
  clearGarbageDb,
  getCleanupStatus,
} from "./clean";

import fetch from "node-fetch";
import cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || 8002;

app.use(bodyParser.urlencoded());
app.set("view engine", "vash");

app.use("/assets", express.static("assets"));

app.get("/start_crawl", (req, res) => {
  const db = getDb();
  crawl(db);
  res.status(200);
  res.send({});
});

app.get("/crawl_status", (req, res) => {
  const status = getCrawlStatus();
  res.status(200);
  res.send(status);
});

app.get("/cleanup", (req, res) => {
  const db = getDb();
  cleanGarbage(db);
  res.status(200);
  res.send({});
});

app.get("/cleanup_favorites", (req, res) => {
  const db = getDb();
  cleanNoLongerAvailableFavorites(db);
  res.status(200);
  res.send({});
});

app.get("/clear_garbage", (req, res) => {
  const db = getDb();
  clearGarbageDb(db);
  res.status(200);
  res.send({});
});

app.get("/cleanup_status", (req, res) => {
  const status = getCleanupStatus();
  res.status(200);
  res.send(status);
});

app.get("/mark_favorite", async (req, res) => {
  console.log(req.query);

  const db = getDb();
  const col = db.getCollection<GumtreeAd>("gumtree");
  const item = col.findOne({ id: req.query.id as string });

  if (!item) {
    res.status(404);
    res.send({});
    return;
  }

  col.update({
    ...item,
    favorite: true,
  });

  res.status(200);
  res.send({});
});

app.get("/mark_garbage", async (req, res) => {
  console.log(req.query);

  const db = getDb();
  const col = db.getCollection<GumtreeAd>("gumtree");
  const item = col.findOne({ id: req.query.id as string });

  if (!item) {
    res.status(404);
    res.send({});
    return;
  }

  col.update({
    ...item,
    garbage: true,
  });

  res.status(200);
  res.send({});
});

app.get("/", async (req, res) => {
  const showFav = req.query.show_fav;
  const db = getDb();
  let query = (item: GumtreeAd) => !item.garbage && !item.favorite;

  if (showFav) {
    query = (item: GumtreeAd) => !item.garbage && !!item.favorite;
  }

  const items = db
    .getCollection<GumtreeAd>("gumtree")
    .where(query)
    .map((i) => {
      const url = "https://www.gumtree.com.au" + i.url;

      return {
        ...i,
        url: i.url,
        fullUrl: url,
      };
    });
  res.render("home", {
    items: items,
    count: items.length,
  });
});

app.get("/img", async (req, res) => {
  const url = req.query.url;

  const page = await fetch(url as string);
  const $ = cheerio.load(await page.text());

  const meta = $("meta[property='og:image']");
  const src = meta.attr("content");

  if (!src) {
    res.sendStatus(404);
    return;
  }

  const image = await fetch(src as string);

  res.contentType("image/jpeg");
  const buffer = Buffer.from(await image.arrayBuffer());
  res.send(buffer);
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

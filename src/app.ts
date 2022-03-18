import { initializeDb } from "./db";
// import { GumtreeAd } from "./type";
// import * as path from "path";
// import * as fs from "fs";
// import { v4 } from "uuid";

import "./server";

initializeDb().then(async (db) => {
  // const col = db.getCollection<GumtreeAd>("gumtree");
  // const file = fs.readFileSync(path.join(__dirname, "backup.json"), {
  //   encoding: "utf-8",
  // });
  // const items: GumtreeAd[] = JSON.parse(file);
  // col.insert(
  //   items.map((i) => ({
  //     ...i,
  //     id: v4(),
  //   }))
  // );
  // const items = col
  //   .where((i) => !i.id && (!!i.garbage || !!i.favorite))
  //   .map((item) => ({
  //     title: item.title,
  //     price: item.price,
  //     location: item.location,
  //     url: item.url,
  //     garbage: item.garbage,
  //     favorite: item.favorite,
  //   }));
  // fs.writeFileSync(path.join(__dirname, "backup.json"), JSON.stringify(items), {
  //   encoding: "utf-8",
  // });
  // console.log(col.count());
  // console.log("done");
  // process.exit();
});

import * as loki from "lokijs";
import * as path from "path";
import { GumtreeAd } from "./type";
let db: loki;

export function getDb() {
  return db;
}

// export function initializeDb(): Promise<loki> {
//   return new Promise((resolve) => {
//     // implement the autoloadback referenced in loki constructor
//     const databaseInitialize = () => {
//       let gumtreeAds = db.getCollection<GumtreeAd>("gumtree");

//       if (!gumtreeAds) {
//         console.log("Creating view");
//         gumtreeAds = db.addCollection<GumtreeAd>("gumtree", {
//           indices: ["url"],
//         });
//       }

//       // kick off any program logic or start listening to external events
//       resolve(db);
//     };

//     db = new loki(path.join(__dirname, "../crawler.db"), {
//       autoload: true,
//       autoloadCallback: databaseInitialize,
//       autosave: true,

//       autosaveInterval: 4000,
//     });
//   });
// }

export function initializeDb(): Promise<loki> {
  return new Promise((resolve) => {
    // implement the autoloadback referenced in loki constructor
    const databaseInitializez = () => {
      let gumtreeAds = db.getCollection<GumtreeAd>("gumtree");

      if (!gumtreeAds) {
        console.log("Creating view");
        gumtreeAds = db.addCollection<GumtreeAd>("gumtree", {
          indices: ["id", "url"],
        });
      }

      // kick off any program logic or start listening to external events
      resolve(db);
    };

    db = new loki(path.join(__dirname, "../gumtree.db"), {
      autoload: true,
      autoloadCallback: databaseInitializez,
      autosave: true,

      autosaveInterval: 4000,
    });
  });
}

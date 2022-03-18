import cheerio = require("cheerio");
import * as loki from "lokijs";
import { GumtreeAd } from "./type";
import fetch from "node-fetch";

const GARBAGE = [
  "ps3",
  "playstation 3",
  "ps4",
  "playstation 4",
  "windows 10",
  "windows 11",
  "quad core",
  "nintendo switch",
  "xbox 360",
  "xbox one",
  "ryzen",
  "core 2 duo",
  "core duo",
  "core i3",
  "core i5",
  "core i7",
  "core i9",
  "lenovo",
  "dell pavillion",
  "dell dimension",
  "ps2",
  "playstation 2",
  "macbook",
  "laptop sleeve",
  "karaoke",
  "2.1ghz",
  "2.2ghz",
  "2.3ghz",
  "2.4ghz",
  "2.5ghz",
  "2.6ghz",
  "2.7ghz",
  "2.8ghz",
  "3.9ghz",
  "3ghz",
  "laptop case",
  "bluetooth",
  "laptop carry case",
  "leather case",
  "case/bag",
  "camera",
  "night vision",
  "wanted: ",
  "wanted - ",
  "charger",
  "charging station",
  "xeon",
  "firewall",
  "router",
  "dell optiplex",
  "netgear",
  "logitech mouse",
  "optical mouse",
  "zte",
  "laptop bag",
  "cooling fan",
  "ddr4",
  "ddr3",
  "ipad",
  "ipod",
  "iphone",
  "android",
  "zenbook",
  "mac book",
  "mac pro",
  "macpro",
  "officejet",
  "cd cases",
  "docking station",
  "dell xps",
  "alienware",
  "htpc",
  "displayport",
  "display port",
  "hdmi",
  "usb type c",
  "1tb",
  "2tb",
  "3tb",
  "4tb",
  "usb c hub",
  "usb hub",
  "microsoft surface",
  "fortnite",
  "csgo",
  "telstra",
  "gtx 1080",
  "gtx 2080",
  "gtx 2060",
  "gtx1080",
  "gtx2080",
  "gtx2060",
  "case for imac",
  "tp-link",
  "gtx i7",
  "i7",
  "gtx1060",
  "gtx 1660",
  "gtx1660",
  "phanteks",
  "lian li",
  "acer predator",
  "wacom",
  "firewire",
  "usb 2",
  "surface pro",
  "apple imac 27",
  "google",
  "hp spectre",
  "core 2 extreme",
  "core2 duo",
  "core2 extreme",
  "lga11",
  "thinkpad yoga",
  "hp pavilion",
  "hp inspirion",
  "battery on sale",
  "wireless mouse",
  "display stand",
  "type-c",
  "usb 3",
  "huawei",
  "usb keyboard",
  "photocopier",
  "sandisk",
  "airpod",
  "air pod",
  "aorus",
  "rtx 1080",
  "rtx 2080",
  "rtx 2060",
  "rtx1080",
  "rtx2080",
  "rtx2060",
  "lga775",
  "usb-c",
  "apple watch",
  "socket 1151",
  "socket 1150",
  "hp elite 8000",
  "mini itx",
  "mid range gaming pc",
  "i9-10900k",
  "core i7",
  "core i9",
  "asus eee pc",
  "microsoft surface pro",
  "surface pro",
  "macbook pro",
  "gear vr",
  "hp elitebook",
  "acer veriton",
  "i5 5300",
  "fractal design",
  "corsair obsidian",
  "i5 4460",
  "inwin",
  "nzxt",
  "core 2 quad",
  "i3 9th gen",
  "gtx 960",
  "gtx 980",
  "esports",
  "hp elitedesk",
  "all in one",
  "intel i5",
  "dell",
  "windows 10",
  "win10",
  "brand new",
  "hp touchsmart",
  "windows 8",
  "touchscreen",
  "laser printer",
  "inkjet",
  "projector",
  "dash cam",
  "virtual reality",
  "dvd player",
  "camcorder",
  "wireless speaker",
  "wireless portable speaker",
  "bluetooth",
  "hdtv",
  "phone case",
  "galaxy s",
  "oneplus",
  "switch lite",
  "nintendo switch",
  "microscope",
  "microphone",
  "bar code reader",
  "bar code scan",
  "gpd win",
  "usb powerboard",
  "usb hub",
  "intel i3",
  "car socket",
  "fast charge",
  "power point socket",
  "wireless pa speaker",
  "phone system",
  "am4",
  "kogan",
  "bluray",
  "blu-ray",
  "galaxy note",
  "kindle",
  "samsung s9",
  "samsung note",
  "galaxy tab",
  "headphone",
  "noise cancellation",
  "i phone",
  "samsung galaxy",
  "itx",
  "noctua",
  "sennheiser",
  "galaxy watch",
  "nikon",
  "jabra elite sport",
  "beats by dre",
  "xperia",
  "gopro",
  "galaxy buds",
  "jbl",
  "galaxy z",
  "xiaomi",
  "garmin",
  "action cam",
  "samsung s11",
  "samsung s6",
  "samsung s7",
  "samsung s9",
  "samsung s5",
  "samsung s4",
  "samsung a20",
  "ultrabook",
  "automotive",
  "telephoto lens",
  "acer aspire",
  "android phone",
  "samsung s10",
  "samsung s2",
  "go pro",
  "snapchat",
  "asus rog",
  "google nexus",
  "tablet case",
  "lighting kit",
  "pixel 4",
  "pixel 3",
  "samsung a",
  "oppo",
  "call of duty",
  "carry case",
  "neewer",
  "fitbit",
  "sony alpha",
  "tablet case",
  "lg v30",
  "drone",
  "spark dji",
  "thunderbolt 3",
  "thunderbolt 4",
  "2way radio",
  "two way radio",
  "thermal transfer printer",
  "gimbal",
  "earphones",
  "set top box",
  "cordless phone",
  "type c usb",
  "water cooler",
  "water cpu cooler",
  "socket 1155",
  "broadlink",
  "smart home",
  "remote control",
  "power socket",
  "power strip",
  "power board",
  "voice recorder",
  "dslr",
  "liquid cooler",
  "harmony hub",
  "teleprompter",
  "webcam",
  "samsung tab",
  "powerbank",
  "razer",
  "dji mavic",
  "chromebook",
  "realme",
  "optus",
  "nokia",
  "moto g",
  "gaming keyboard",
  "vodafone",
  "telstra",
  "mouse pad",
  "konica",
  "canon f1",
  "mm lens",
  "3 in 1 printer",
  "gaming mouse",
  "emergency radio",
  "amd a8",
  "motorola",
  "vacuum",
  "tv wall mount",
  "gaming monitor",
  "turntable",
  "behringer",
  "cctv",
  "printer cartrige",
  "robot cleaner",
  "pokemon go",
  "apple pencil",
  "prepaid sim",
  "plasma tv",
  "mobile number",
  "chromecast",
  "dash cam",
  "wall mount tv",
  "bookshelf speakers",
  "fm tuner",
  "ubiquiti",
  "subwoofer",
  "air-condition",
  "full hd tv",
  "full hd lcd tv",
  "alcatel",
  "blu ray",
  "rgb led",
  "500gb",
  "corsair hydro",
  "27inch monitor",
  "gtx 1060",
  "waterproof",
  "atari flashback",
  "power bank",
  "powerbank",
  "acer iconia",
  "deskjet",
  "nvme",
  "ultra notebook",
  "ink cartridge",
  "cherry mx",
  "radeon r9",
  "led monitor",
  "gddr5",
  "gddr6",
  "1tb",
  "2tb",
  "4tb",
  "6tb",
  "8tb",
  "10tb",
  "12tb",
  "14tb",
  "16tb",
  "apple tv",
  "barcode scanner",
  "xerox",
  "surveillance",
  "laserjet",
  "cable modem",
  "wd elements",
  "telecom",
  "deepcool",
  "1920x1080",
  "1920 x 1080",
  "apple magic mouse",
  "sagemcom",
  "gtx 1070",
  "logitech",
  "printer",
  "monitor mount",
  "thrustmaster",
  "used hp laptop",
  "washing machine",
  "soniq",
  "scanner",
  "canon pixma",
  "fatal1ty",
];

const ands = [
  "imac,mid,2007~2021",
  "imac,early,2007~2021",
  "imac,late,2007~2021",
  "apple,mac,2007~2021",
  "mac,mini,mid,2007~2021",
  "mac,mini,early,2007~2021",
  "mac,mini,late,2007~2021",
  "mac,computer,2007~2021",
  "monitor,21~40,inch",
  "monitor,21~40,inches",
  'monitor,21~40,"',
  'monitor,21~40,"',
  "monitor,21~40,”",
  "acer,21~40,inch",
  'acer,21~40,"',
  "samsung,21~40,inch",
  'samsung,21~40,"',
  'philips,21~40,"',
  "philips,21~40,inch",
  'viewsonic,21~40,"',
  "viewsonic,21~40,inch",
  "viewsonic,21~40,”",
  "lg,20~40,inch",
  'lg,20~40,"',
  "4k,monitor",
  "4~128,gb,ram",
  "power supply,500~1000,w",
  "power supply,500~1000,watt",
  "i3,4~32,gb",
  "i5,8~32,gb",
  "i7,8~32,gb",
  "i3,desktop",
  "i5,desktop",
  "i7,desktop",
  "canon,pixma,printer",
  "nbn,modem",
  "opal,card",
  "hp,elite",
  "windows,server,2008~2029",
  "hp,desktop",
  "hp,aio",
  "usb,cd,drive",
  "usb,dvd,drive",
  "printer,cartridge",
  "hp,all-in-one",
  "usb,mouse",
  "usb,cable",
  "ssd,128gb",
  "ssd,256gb",
  "ssd,512gb",
  "garage,sale,paddington",
  "it,support,service",
  "will,build,computer",
  "canon,jet,printer",
  "laser,printer",
  "broadband,voip",
  "monitor,arm",
  "colour,printer,scanner",
  "wi-fi,extender",
  "keyboard,cherry",
  "rgb,fan",
  "fujitsu,300gb",
  "hp,pavillion",
  "all-in-one,pc",
  "synology,nas",
  "samsung,print",
  "asus,transformer",
  "monitor,stand",
  "apple,magic,mouse",
];

const isMultiterm = (input: string) => {
  return ands.some((and) => {
    const terms = and.split(",");

    return terms.every((term) => {
      const range = term.split("~").map((o) => parseInt(o));
      if (range.length === 2) {
        for (let index = range[0]; index <= range[1]; index++) {
          if (input.toLocaleLowerCase().includes(index.toString())) {
            return true;
          }
        }
        return false;
      }

      return input.toLocaleLowerCase().includes(term);
    });
  });
};

function isModernGaming(input: string) {
  const includes = [
    "office pc",
    "office computer",
    "gaming pc",
    "gaming computer",
    "gaming desktop",
    "work from home",
    "school",
    "wireless",
    "wifi",
    "radio",
    "satellite",
    "camera",
  ].some((g) => input.toLowerCase().includes(g));
  const butNot = ["retro", "vintage", "old", "486", "386", "k6"].every(
    (g) => !input.toLowerCase().includes(g)
  );
  return includes && butNot;
}

const MAX_PRICE = 550;

let currentStatus: string;

function log(...items: string[]) {
  console.log(...items);
  currentStatus = items.join(" ");
}

function getPrice(input: string) {
  const match = /\d+(,\d+)?(\.\d+)?/g.exec(input);
  if (match && match.length) {
    return parseFloat(match[0].replace(",", ""));
  }

  return 0;
}

export function getCleanupStatus() {
  return currentStatus;
}

export async function cleanGarbage(db: loki) {
  const col = db.getCollection<GumtreeAd>("gumtree");

  log(
    "Starting cleaning for current items:",
    col.where((o) => !o.garbage).length.toString()
  );

  const garbo = col.where(
    (o) =>
      (GARBAGE.some((g) => o.title.toLowerCase().includes(g)) ||
        getPrice(o.price) > MAX_PRICE ||
        isModernGaming(o.title) ||
        isMultiterm(o.title)) &&
      !o.garbage
  );

  log("Current Garbage:", garbo.length.toString());

  garbo.forEach((g) => {
    g.garbage = true;
    col.update(g);
  });

  log(
    "Garbage Removed, items left:",
    col.where((o) => !o.garbage).length.toString()
  );
}

export async function clearGarbageDb(db: loki) {
  const col = db.getCollection<GumtreeAd>("gumtree");

  log(
    "Starting cleaning for current items:",
    col.where((o) => !!o.garbage).length.toString()
  );

  col.removeWhere((o) => !!o.garbage);

  log(
    "Garbage Removed, items left:",
    col.where((o) => !!o.garbage).length.toString()
  );
}

export async function cleanNoLongerAvailableFavorites(db: loki) {
  const col = db.getCollection<GumtreeAd>("gumtree");

  const favos = col.where((o) => o.favorite && !o.garbage);

  const stillExisting: GumtreeAd[] = [];
  const nonExistant: GumtreeAd[] = [];

  for (let i = 0; i < favos.length; i++) {
    const favo = favos[i];

    console.log(favo.url);
    const page = await fetch("https://www.gumtree.com.au" + favo.url);
    const $ = cheerio.load(await page.text());

    const container = $(".vip-ad__container");
    if (!container.length) {
      nonExistant.push(favo);
      continue;
    }
    const $container = cheerio.load(container[0]);
    const hasPrice = $container(".user-ad-price").length;
    const title = $container(".vip-ad-title__header").text();
    console.log(title);
    const hasTitle = !!title;

    const hasAd = hasPrice && hasTitle;
    console.log(hasPrice);
    console.log(hasTitle);
    console.log(hasAd);

    if (!hasAd) {
      nonExistant.push(favo);
    } else {
      stillExisting.push(favo);
    }
  }

  console.log("Gone", nonExistant.length);
  console.log("still here", stillExisting.length);

  nonExistant.forEach((g) => {
    g.garbage = true;
    col.update(g);
  });

  log("Done!");
}

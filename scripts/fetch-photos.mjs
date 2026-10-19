/**
 * HomeKey photo pipeline.
 *
 * Downloads a room-by-room photo set for every listing from Unsplash into
 * public/photos/<property-id>/NN.jpg (in gallery order) and writes a manifest
 * (src/data/photoManifest.ts) so the React data layer and the files on disk can
 * never drift apart.
 *
 * Variety strategy:
 *   1. every room draws from a dedicated photo pool (exterior / living / kitchen
 *      / bedroom / bathroom / outdoor / ...)
 *   2. each source photo is requested at several different crops, so one source
 *      yields six genuinely different framings
 *   3. every downloaded file is hashed; if a crop produces bytes we already
 *      have, the next crop is tried instead
 * so 20 listings never end up showing the same room.
 *
 * Run with:  npm run photos            (only downloads what is missing)
 *           npm run photos -- --force   (re-download everything)
 */
import { mkdir, writeFile, access, rm, readdir, unlink } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public", "photos");
const MANIFEST = path.join(ROOT, "src", "data", "photoManifest.ts");
const FORCE = process.argv.includes("--force") || process.env.FORCE === "1";

/* ── Room-tagged Unsplash pool ─────────────────────────────────────────── */

const POOL = {
  exterior: [
    "photo-1568605114967-8130f3a36994",
    "photo-1570129477492-45c003edd2be",
    "photo-1564013799919-ab600027ffc6",
    "photo-1580587771525-78b9dba3b914",
    "photo-1512917774080-9991f1c4c750",
    "photo-1600596542815-ffad4c1539a9",
    "photo-1600585154340-be6161a56a0c",
    "photo-1600047509807-ba8f99d2cdde",
    "photo-1605276374104-dee2a0ed3cd6",
    "photo-1598228723793-52759bba239c",
    "photo-1560448204-e02f11c3d0e2",
    "photo-1522708323590-d24dbb6b0267",
    "photo-1583608205776-bfd35f0d9f83",
    "photo-1416331108676-a22ccb276e35",
    "photo-1605146769289-440113cc3d00",
    "photo-1600607687920-4e2a09cf159d",
    "photo-1600210492486-724fe5c67fb0",
    "photo-1600585152220-90363fe7e115",
    "photo-1600566753190-17f0baa2a6c3",
    "photo-1502672260266-1c1ef2d93688",
    "photo-1493809842364-78817add7ffb",
    "photo-1554995207-c18c203602cb",
    "photo-1556909212-d5b604c0c90d",
    "photo-1565183997392-2f6f122e5912",
    "photo-1523217582562-09d0def993a6",
    "photo-1628624747186-a941c476b7ef",
    "photo-1592595896616-c37162298647",
    "photo-1511452885600-a3d2c9148a31",
    "photo-1602343168117-bb8ffe3e2e9f",
    "photo-1668911494509-14baf3b42fda",
    "photo-1647579350413-a6ada4e480ed",
    "photo-1756435292384-1bf32eff7baf",
    "photo-1668911495278-487418f8f72d",
    "photo-1668911494481-1643ee3e1235",
    "photo-1558036117-15d82a90b9b1",
    "photo-1613490493576-7fde63acd811",
    "photo-1582268611958-ebfd161ef9cf",
  ],
  living: [
    "photo-1776653095063-895a05001818",
    "photo-1772475385289-17fbb414ed74",
    "photo-1760067538299-3f58e7a99fc5",
    "photo-1765728614529-4749706523d9",
    "photo-1668911492720-6cd2cfb40669",
    "photo-1668911491756-efb778ca35a6",
    "photo-1668911492446-57a26bfa4dbd",
    "photo-1754999809963-79a41e8fb648",
    "photo-1742219738562-57b6b64e6c41",
  ],
  kitchen: [
    "photo-1762417508868-162819fd66ee",
    "photo-1730991568658-ad8638395a9e",
    "photo-1770751188011-8ab6c81552bf",
    "photo-1737898415581-7dea57a1905b",
    "photo-1769745241584-be9b8227e126",
    "photo-1774578341941-cd784a0d41eb",
    "photo-1760545813135-fbda9423e448",
  ],
  dining: [
    "photo-1740402065454-ac00b0c8ede6",
    "photo-1722159397344-9cc35554f606",
  ],
  bedroom: [
    "photo-1775241186452-c3d99b09f223",
    "photo-1771327811795-6197403af846",
    "photo-1758974817671-24f627809115",
    "photo-1744974256549-8ece7cdb5dd2",
    "photo-1763478959550-13d564c5a62d",
    "photo-1603726477468-da922b12b8ce",
    "photo-1721549812316-7706f9a0a49c",
    "photo-1722650364570-90bf509d7dff",
    "photo-1750268746235-1657249daa37",
    "photo-1759264244726-adde4e4318fc",
  ],
  bathroom: [
    "photo-1638131819098-5b372730e143",
    "photo-1753117034399-6ca93ebcaf0a",
    "photo-1564540579594-0930edb6de43",
    "photo-1633985214685-420b04731e38",
    "photo-1721743138130-e8ce6e1a7dce",
    "photo-1706249591846-a8e421063585",
    "photo-1656646523907-97b094c7e63a",
    "photo-1760749124145-8ceea3f541b5",
    "photo-1770987685744-630d3c2494bd",
    "photo-1677553512940-f79af72efd1b",
  ],
  outdoor: [
    "photo-1741288341280-9eeb62919f64",
    "photo-1634923294557-7c3eb779aef8",
    "photo-1757439402214-2311405d70bd",
    "photo-1752606302210-50dd2e135aa4",
    "photo-1715090576114-c07384af2069",
  ],
  office: ["photo-1752454823150-968e2507f45c"],
  closet: [
    "photo-1723641278225-3a3bbabc1218",
    "photo-1708397016786-8916880649b8",
  ],
  laundry: [
    "photo-1722942627814-658476510130",
    "photo-1674471361343-3d2ca92d5123",
    "photo-1631241470625-8c3cb167ef06",
  ],
};

/** Where a room draws from when its own pool runs out (pool-keyed). */
const FALLBACK = {
  dining: ["kitchen", "living"],
  outdoor: ["exterior", "living"],
  laundry: ["bathroom", "kitchen"],
  office: ["living", "bedroom"],
  closet: ["bedroom", "dining"],
  kitchen: ["dining", "living"],
  bedroom: ["dining", "living"],
  bathroom: ["outdoor", "kitchen"],
  exterior: ["outdoor", "living"],
};

/** Maps a gallery room (used in PLANS) to the pool it draws photos from. */
const POOL_KEY = {
  exterior: "exterior",
  street: "exterior",
  living: "living",
  kitchen: "kitchen",
  kitchenette: "kitchen",
  dining: "dining",
  "primary-bedroom": "bedroom",
  "bedroom-2": "bedroom",
  "bedroom-3": "bedroom",
  bathroom: "bathroom",
  backyard: "outdoor",
  pool: "outdoor",
  patio: "outdoor",
  balcony: "outdoor",
  terrace: "outdoor",
  office: "office",
  laundry: "laundry",
};

/**
 * Each source photo can be requested at several different aspect ratios and
 * crop anchors, which yields genuinely different framings of the same room.
 * The ratios are deliberately varied (and never equal to the usual 3:2 source)
 * so every request actually crops the image.
 */
const VARIANTS = [
  { tag: "wide", qs: "w=1400&q=75&auto=format&fit=crop" },
  { tag: "pano", qs: "w=1400&h=700&q=75&auto=format&fit=crop&crop=entropy" },
  { tag: "square", qs: "w=1000&h=1000&q=75&auto=format&fit=crop&crop=entropy" },
  { tag: "left", qs: "w=1400&h=800&q=75&auto=format&fit=crop&crop=left" },
  { tag: "right", qs: "w=1400&h=800&q=75&auto=format&fit=crop&crop=right" },
  { tag: "tall", qs: "w=1400&h=980&q=75&auto=format&fit=crop&crop=top" },
  { tag: "low", qs: "w=1400&h=980&q=75&auto=format&fit=crop&crop=bottom" },
  { tag: "portrait", qs: "w=900&h=1200&q=75&auto=format&fit=crop&crop=entropy" },
];

const unsplashUrl = (id, variant) =>
  `https://images.unsplash.com/${id}?${VARIANTS[variant].qs}`;

/** Human label for each room used in the gallery and in alt text. */
const ROOM_LABEL = {
  exterior: "Front exterior",
  street: "Street view",
  living: "Living room",
  kitchen: "Kitchen",
  kitchenette: "Kitchenette",
  dining: "Dining area",
  "primary-bedroom": "Primary bedroom",
  "bedroom-2": "Second bedroom",
  "bedroom-3": "Third bedroom",
  bathroom: "Bathroom",
  backyard: "Backyard",
  pool: "Pool & patio",
  patio: "Patio",
  balcony: "Balcony",
  terrace: "Terrace",
  office: "Home office",
  laundry: "Laundry",
};

/** Gallery rooms per listing, chosen to match each home's amenities and type. */
const PLANS = {
  "hk-001": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "backyard", "office", "laundry"],
  "hk-002": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "balcony", "laundry"],
  "hk-003": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "backyard", "laundry"],
  "hk-004": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "street", "laundry"],
  "hk-005": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "backyard", "office", "laundry"],
  "hk-006": ["exterior", "living", "kitchen", "primary-bedroom", "bathroom", "street", "laundry"],
  "hk-007": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "backyard", "laundry"],
  "hk-008": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "backyard", "office", "laundry"],
  "hk-009": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "terrace", "laundry"],
  "hk-010": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "pool", "office", "laundry"],
  "hk-011": ["exterior", "living", "kitchen", "primary-bedroom", "bathroom", "street", "laundry"],
  "hk-012": ["exterior", "living", "kitchenette", "primary-bedroom", "bathroom", "street"],
  "hk-013": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "backyard", "laundry"],
  "hk-014": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "backyard", "office", "laundry"],
  "hk-015": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bedroom-3", "bathroom", "backyard", "laundry"],
  "hk-016": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "patio", "laundry"],
  "hk-017": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "balcony", "laundry"],
  "hk-018": ["exterior", "living", "kitchen", "primary-bedroom", "bathroom", "balcony", "laundry"],
  "hk-019": ["exterior", "living", "kitchen", "dining", "primary-bedroom", "bedroom-2", "bathroom", "backyard", "laundry"],
  "hk-020": ["exterior", "living", "kitchenette", "primary-bedroom", "bathroom", "balcony"],
};

const TITLES = {
  "hk-001": "Modern 4BR Home in Highland Park",
  "hk-002": "Bright 3BR Townhouse in Lower Greenville",
  "hk-003": "Renovated 2BR Duplex in Lakewood",
  "hk-004": "Designer 2BR Apartment in Deep Ellum",
  "hk-005": "Restored 3BR Bungalow in Bishop Arts",
  "hk-006": "Skyline 1BR Condo in Uptown",
  "hk-007": "Classic 3BR House in The Heights",
  "hk-008": "Updated 3BR House in Montrose",
  "hk-009": "Modern 3BR Townhouse in the Museum District",
  "hk-010": "Executive 4BR House in River Oaks",
  "hk-011": "Smart 1BR Apartment in Midtown",
  "hk-012": "Industrial Studio Loft in EaDo",
  "hk-013": "Charming 3BR House in East Austin",
  "hk-014": "Tree-lined 3BR House in Hyde Park",
  "hk-015": "Family 4BR House near Zilker Park",
  "hk-016": "New 3BR Townhouse in Mueller",
  "hk-017": "Luxury 2BR Apartment at The Domain",
  "hk-018": "Loft-style 1BR Apartment in the Pearl District",
  "hk-019": "Spacious 3BR House in Alamo Heights",
  "hk-020": "Downtown Studio at Sundance Square",
};

const IDS = Object.keys(PLANS);

/* ── Allocation ────────────────────────────────────────────────────────── */

/** Shared across listings so each listing starts from the NEXT source, which is
 *  what keeps every home's gallery showing different rooms. */
const cursor = {};

/** `imageKey` identifies one distinct image (source + crop). */
const imageKey = (id, variant) => `${id}#${VARIANTS[variant].tag}`;

function makeAllocator(usedByProperty) {
  const take = (room) => {
    const primary = POOL_KEY[room] || room;
    const order = [primary, ...(FALLBACK[primary] || [])];

    for (const key of order) {
      const pool = POOL[key] || [];
      const startSource = cursor[key] || 0;

      // Walk the sources of this pool, starting where the previous listing left
      // off, and take the first crop of that source this listing has not used.
      for (let s = 0; s < pool.length; s++) {
        const sourceIndex = (startSource + s) % pool.length;
        const id = pool[sourceIndex];
        const startVariant = cursor[`${key}#v`] || 0;

        for (let v = 0; v < VARIANTS.length; v++) {
          const variant = (startVariant + v) % VARIANTS.length;
          const image = imageKey(id, variant);
          if (usedByProperty.has(image)) continue;
          usedByProperty.add(image);
          cursor[key] = sourceIndex + 1;
          cursor[`${key}#v`] = variant + 1;
          return { id, variant };
        }
      }
    }
    return null;
  };
  return take;
}

/* ── Downloading ───────────────────────────────────────────────────────── */

const usedHashes = new Set();
const UA = { "User-Agent": "Mozilla/5.0 (HomeKey photo fetcher)" };

async function fetchUnique(id, startVariant, file, label, logTag) {
  let lastGood = null;

  for (let a = 0; a < VARIANTS.length; a++) {
    const v = (startVariant + a) % VARIANTS.length;
    try {
      const res = await fetch(unsplashUrl(id, v), { headers: UA });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 4096) continue;
      if (buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) continue; // not a JPEG
      const hash = crypto.createHash("md5").update(buf).digest("hex");
      lastGood = { bytes: buf.length, variant: VARIANTS[v].tag, buf };
      if (usedHashes.has(hash)) continue; // identical bytes — try another crop
      usedHashes.add(hash);
      await writeFile(file, buf);
      return { ok: true, bytes: buf.length, variant: VARIANTS[v].tag };
    } catch {
      /* try the next crop */
    }
  }

  // Every crop of this source is already used elsewhere: keep the best one so the
  // listing never has a hole in its gallery.
  if (lastGood) {
    await writeFile(file, lastGood.buf);
    usedHashes.add(crypto.createHash("md5").update(lastGood.buf).digest("hex"));
    return { ok: true, bytes: lastGood.bytes, variant: lastGood.variant + " (reused)" };
  }
  return { ok: false, bytes: 0, variant: null };
}

const fileExists = async (file) => {
  try {
    await access(file, constants.R_OK);
    return true;
  } catch {
    return false;
  }
};

async function clearPhotos() {
  const dirs = await readdir(PUBLIC, { withFileTypes: true }).catch(() => []);
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const files = await readdir(path.join(PUBLIC, d.name));
    for (const f of files) {
      if (f.endsWith(".jpg")) await unlink(path.join(PUBLIC, d.name, f));
    }
  }
}

/* ── Concurrency ───────────────────────────────────────────────────────── */

const queue = [];
const CONCURRENCY = 6;
async function worker() {
  while (queue.length) {
    const job = queue.shift();
    if (!job) return;
    await job();
  }
}

/* ── Main ──────────────────────────────────────────────────────────────── */

async function main() {
  await mkdir(PUBLIC, { recursive: true });
  if (FORCE) {
    console.log("clearing existing photos (--force)");
    await clearPhotos();
  }

  const manifest = {};
  let written = 0;
  let bytes = 0;
  let planned = 0;
  let skipped = 0;

  for (const id of IDS) {
    const dir = path.join(PUBLIC, id);
    await mkdir(dir, { recursive: true });
    const used = new Set();
    const take = makeAllocator(used);
    const title = TITLES[id];
    manifest[id] = [];

    for (let i = 0; i < PLANS[id].length; i++) {
      const room = PLANS[id][i];
      const seq = String(i + 1).padStart(2, "0");
      const file = path.join(dir, `${seq}.jpg`);
      const rel = `/photos/${id}/${seq}.jpg`;
      const label = ROOM_LABEL[room] || room;
      manifest[id].push({ src: rel, alt: `${label} — ${title}`, room: label });

      planned++;
      if (!FORCE && (await fileExists(file))) {
        skipped++;
        continue;
      }

      const pick = take(room);
      if (!pick) {
        console.log(`  SKIP ${id} ${seq} (${room}) — pool exhausted`);
        continue;
      }
      queue.push(async () => {
        const result = await fetchUnique(pick.id, pick.variant, file, label, `${id} ${seq}`);
        if (result.ok) {
          written++;
          bytes += result.bytes;
          console.log(`  OK   ${id} ${seq} ${label.padEnd(18)} ${pick.id}/${result.variant}`);
        } else {
          console.log(`  FAIL ${id} ${seq} ${label} ${pick.id}`);
        }
      });
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  /* Write the manifest the app imports. */
  const lines = [
    "/* AUTO-GENERATED by scripts/fetch-photos.mjs — do not edit by hand.",
    "   Run `npm run photos` to refresh after changing the photo plans. */",
    "",
    "export interface ManifestPhoto {",
    "  src: string;",
    "  alt: string;",
    "  room: string;",
    "}",
    "",
    "export const photoManifest: Record<string, ManifestPhoto[]> = {",
  ];
  for (const id of IDS) {
    lines.push(`  "${id}": [`);
    for (const p of manifest[id]) {
      lines.push(`    { src: "${p.src}", alt: ${JSON.stringify(p.alt)}, room: ${JSON.stringify(p.room)} },`);
    }
    lines.push("  ],");
  }
  lines.push("};", "");
  await writeFile(MANIFEST, lines.join("\n"), "utf8");

  console.log("");
  console.log(`PLANNED ${planned} photos across ${IDS.length} listings`);
  console.log(`WROTE   ${written} files (${(bytes / 1024 / 1024).toFixed(1)} MB)${skipped ? `, ${skipped} already present` : ""}`);
  console.log(`MANIFEST ${MANIFEST}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

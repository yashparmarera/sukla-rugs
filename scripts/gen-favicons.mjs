import sharp from "sharp";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public/favicon-v2.jpg");
const outDir = path.join(root, "public");

// Square sizes to emit onto a transparent, aspect-preserving canvas.
const targets = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-48x48.png", size: 48 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

for (const t of targets) {
  await sharp(src)
    .resize(t.size, t.size, { fit: "contain", background: transparent })
    .png()
    .toFile(path.join(outDir, t.name));
  console.log("wrote", t.name);
}

// Build a multi-resolution .ico (16/32/48) for broad browser support.
const icoSizes = [16, 32, 48];
const pngBuffers = await Promise.all(
  icoSizes.map((s) =>
    sharp(src)
      .resize(s, s, { fit: "contain", background: transparent })
      .png()
      .toBuffer()
  )
);

// Minimal ICO encoder (PNG-compressed entries, supported by all modern browsers).
function buildIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const dirEntrySize = 16;
  const dir = Buffer.alloc(dirEntrySize * count);
  let offset = 6 + dirEntrySize * count;
  const bodies = [];

  images.forEach((img, i) => {
    const { buf, size } = img;
    const o = i * dirEntrySize;
    dir.writeUInt8(size >= 256 ? 0 : size, o + 0); // width
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1); // height
    dir.writeUInt8(0, o + 2); // colors in palette
    dir.writeUInt8(0, o + 3); // reserved
    dir.writeUInt16LE(1, o + 4); // color planes
    dir.writeUInt16LE(32, o + 6); // bits per pixel
    dir.writeUInt32LE(buf.length, o + 8); // size of image data
    dir.writeUInt32LE(offset, o + 12); // offset of image data
    offset += buf.length;
    bodies.push(buf);
  });

  return Buffer.concat([header, dir, ...bodies]);
}

const ico = buildIco(pngBuffers.map((buf, i) => ({ buf, size: icoSizes[i] })));
writeFileSync(path.join(root, "src/app/favicon.ico"), ico);
console.log("wrote src/app/favicon.ico", ico.length, "bytes");

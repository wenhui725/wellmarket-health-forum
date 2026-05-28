const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const roots = [path.join(__dirname, "public", "img")];
const extensions = new Set([".jpg", ".jpeg", ".png"]);
const excludedDirs = new Set([path.join(__dirname, "public", "img", "假圖ˋ")]);

function walk(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && excludedDirs.has(fullPath)) return [];
    if (entry.isDirectory()) return walk(fullPath);
    if (entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase())) {
      return [fullPath];
    }
    return [];
  });
}

async function convert(filePath) {
  const outputPath = filePath.replace(/\.(jpe?g|png)$/i, ".webp");
  await sharp(filePath).webp({ quality: 82 }).toFile(outputPath);
  return outputPath;
}

async function main() {
  const files = roots.flatMap(walk);

  if (files.length === 0) {
    console.log("No jpg, jpeg, or png images found.");
    return;
  }

  for (const file of files) {
    const output = await convert(file);
    console.log(`${path.relative(__dirname, file)} -> ${path.relative(__dirname, output)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

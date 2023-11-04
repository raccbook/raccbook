const JSZip = require("jszip");
const fs = require("fs").promises;

const extractId = async (zipPath) => {
  const buffer = await fs.readFile(zipPath);
  const zip = new JSZip();
  await zip.loadAsync(buffer);

  let tlid;
  zip.forEach((relativePath, file) => {
    if (!file.dir && relativePath.includes("tlid")) {
      tlid = file.async("string");
    }
  });

  if (!tlid) throw new Error("No talent layer id was found in the zip.");

  return tlid;
};

module.exports = extractId;

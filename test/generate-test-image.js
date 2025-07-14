const fs = require("fs");
const { PNG } = require("pngjs");

const png = new PNG({ width: 10, height: 10 });
for (let y = 0; y < 10; y++) {
  for (let x = 0; x < 10; x++) {
    const idx = (10 * y + x) << 2;
    png.data[idx] = 255; // R
    png.data[idx + 1] = 0; // G
    png.data[idx + 2] = 0; // B
    png.data[idx + 3] = 255; // A
  }
}
png.pack().pipe(fs.createWriteStream(__dirname + "/test-image.png"));

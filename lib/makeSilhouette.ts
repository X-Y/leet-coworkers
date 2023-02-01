import sharp from "sharp";

const makeSilhouette = async (
  input: string | sharp.Sharp,
  outputPath: string,
  {
    fgColor = "#1E1E9D" as sharp.Color,
    bgColor = "#0c0c91" as sharp.Color,
    size = 100,
    bgThreshold = 15,
    fgThreshold = 128,
  } = {}
) => {
  const file = typeof input === "string" ? sharp(input) : input;

  const base = await file.resize(size).png().toBuffer();

  const bgMask = await sharp(base)
    .negate()
    .threshold(bgThreshold)
    .extractChannel("red")
    .toBuffer();

  const fgThresholded = sharp(base).threshold(fgThreshold);

  const fgMask = await fgThresholded.extractChannel("red").toBuffer();

  // const foreground = await fgThresholded
  // 	.toBuffer()

  const coloredFgNoAlpha = await sharp(base)
    .composite([
      {
        input: {
          create: {
            width: 1,
            height: 1,
            channels: 3,
            background: fgColor,
          },
        },
        tile: true,
        blend: "over",
      },
    ])
    .removeAlpha()
    .toBuffer();

  const coloredFgWithMask = await sharp(coloredFgNoAlpha)
    .joinChannel(fgMask)
    .toBuffer();

  const fgbgNoAlpha = await sharp(coloredFgWithMask)
    .composite([
      {
        input: {
          create: {
            width: 1,
            height: 1,
            channels: 3,
            background: bgColor,
          },
        },
        tile: true,
        blend: "dest-over",
      },
    ])
    .removeAlpha()
    .toBuffer();

  const fgbgWithMask = sharp(fgbgNoAlpha)
    .joinChannel(bgMask)
    .toFile(outputPath);

  return fgbgWithMask;
};

export default makeSilhouette;

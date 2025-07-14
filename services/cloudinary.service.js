const cloudinary = require("../utils/cloudinary");
const { Readable } = require("stream");
const slugify = require("slugify");

// Accepts imageBuffer, optional filename, and optional folder
const cloudinaryImageUpload = (
  imageBuffer,
  filename = null,
  folder = null,
  forceFolder = false
) => {
  return new Promise((resolve, reject) => {
    let public_id = undefined;
    let uploadFolder = folder;
    if (filename) {
      // Remove extension and slugify
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
      const uniqueSuffix = Date.now();
      const slug = `${slugify(nameWithoutExt, {
        lower: true,
        strict: true,
      })}-${uniqueSuffix}`;
      public_id = slug; // Do NOT prepend folder here
    }
    // Always set the folder param if forceFolder is true or folder is provided
    const uploadOptions = {
      resource_type: "image",
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      unique_filename: false, // Do not add random characters
      overwrite: false, // Do not overwrite if exists
      ...(public_id ? { public_id } : {}),
      ...(uploadFolder ? { folder: uploadFolder } : {}),
      format: "webp", // Faster format than avif
      transformation: [
        { width: 600, height: 600, crop: "limit" }, // Smaller size for faster upload
        { fetch_format: "auto", quality: "auto:low" }, // Lower quality for speed
      ],
      // 🚀 PERFORMANCE OPTIMIZATIONS
      eager: "f_auto,q_auto", // Auto format and quality
      eager_async: true, // Async transformation
      eager_notification_url: null, // Disable notifications
    };
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(imageBuffer);
    bufferStream.push(null);

    bufferStream.pipe(uploadStream);
  });
};

// cloudinaryImageDelete (still useful for manual/utility use)
const cloudinaryImageDelete = async (public_id) => {
  const deletionResult = await cloudinary.uploader.destroy(public_id);
  return deletionResult;
};

exports.cloudinaryServices = {
  cloudinaryImageDelete,
  cloudinaryImageUpload,
};

const { body, validationResult } = require("express-validator");
const Product = require("../model/Product");

// Middleware to handle color array from form data
const handleColorArray = (req, res, next) => {
  // Handle color[] field (from form data)
  if (req.body["color[]"]) {
    // Convert to array if it's a single value
    req.body.color = Array.isArray(req.body["color[]"])
      ? req.body["color[]"]
      : [req.body["color[]"]];
    delete req.body["color[]"];
  }
  // Ensure color is always an array
  else if (req.body.color && !Array.isArray(req.body.color)) {
    req.body.color = [req.body.color];
  }
  // Filter out any empty values
  if (req.body.color) {
    req.body.color = req.body.color.filter(Boolean);
  }
  next();
};

// Middleware to handle subsuitable array from form data
const handleSubsuitableArray = (req, res, next) => {
  // Handle subsuitable[] field (from form data)
  if (req.body["subsuitable[]"]) {
    // Convert to array if it's a single value
    req.body.subsuitable = Array.isArray(req.body["subsuitable[]"])
      ? req.body["subsuitable[]"]
      : [req.body["subsuitable[]"]];
    delete req.body["subsuitable[]"];
  }
  // Ensure subsuitable is always an array if provided
  else if (req.body.subsuitable && !Array.isArray(req.body.subsuitable)) {
    req.body.subsuitable = [req.body.subsuitable];
  }
  // Filter out any empty values
  if (req.body.subsuitable) {
    req.body.subsuitable = req.body.subsuitable.filter(Boolean);
  }
  next();
};

// Middleware to handle leadtime array from form data
const handleLeadtimeArray = (req, res, next) => {
  // Handle leadtime[] field (from form data)
  if (req.body["leadtime[]"]) {
    // Convert to array if it's a single value
    req.body.leadtime = Array.isArray(req.body["leadtime[]"])
      ? req.body["leadtime[]"]
      : [req.body["leadtime[]"]];
    delete req.body["leadtime[]"];
  }
  // Ensure leadtime is always an array if provided
  else if (req.body.leadtime && !Array.isArray(req.body.leadtime)) {
    // Handle comma-separated strings
    if (
      typeof req.body.leadtime === "string" &&
      req.body.leadtime.includes(",")
    ) {
      req.body.leadtime = req.body.leadtime
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      req.body.leadtime = [req.body.leadtime];
    }
  }
  // Filter out any empty values
  if (req.body.leadtime) {
    req.body.leadtime = req.body.leadtime.filter(Boolean);
  }
  next();
};

// Middleware to handle productTag array from form data
const handleProductTagArray = (req, res, next) => {
  // Handle productTag[] field (from form data)
  if (req.body["productTag[]"]) {
    // Convert to array if it's a single value
    req.body.productTag = Array.isArray(req.body["productTag[]"])
      ? req.body["productTag[]"]
      : [req.body["productTag[]"]];
    delete req.body["productTag[]"];
  }
  // Ensure productTag is always an array if provided
  else if (req.body.productTag && !Array.isArray(req.body.productTag)) {
    // Handle comma-separated strings
    if (
      typeof req.body.productTag === "string" &&
      req.body.productTag.includes(",")
    ) {
      req.body.productTag = req.body.productTag
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      req.body.productTag = [req.body.productTag];
    }
  }
  // Filter out any empty values
  if (req.body.productTag) {
    req.body.productTag = req.body.productTag.filter(Boolean);
  }
  next();
};

const Substructure = require("../model/Substructure");
const Content = require("../model/Content");
const Design = require("../model/Design");
const Subfinish = require("../model/Subfinish");
const Vendor = require("../model/Vendor");
const Groupcode = require("../model/Groupcode");
const Color = require("../model/Color");
const Category = require("../model/Category");
const Motif = require("../model/Motif");
const Seo = require("../model/Seo");
const Topicpage = require("../model/topicpage");
const { cloudinaryServices } = require("../services/cloudinary.service.js");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// Update multer middleware to accept any file field
const multiUpload = upload.any();
const slugify = require("slugify");
const path = require("path");
const ALLOWED_IMAGE_EXTENSIONS = (
  process.env.ALLOWED_IMAGE_EXTENSIONS || "jpg,jpeg,png,webp"
).split(",");
const ALLOWED_VIDEO_EXTENSIONS = (
  process.env.ALLOWED_VIDEO_EXTENSIONS || "mp4,webm"
).split(",");
const MAX_IMAGE_SIZE = process.env.MAX_IMAGE_SIZE
  ? parseInt(process.env.MAX_IMAGE_SIZE)
  : 5 * 1024 * 1024; // 5MB default
const MAX_VIDEO_SIZE = process.env.MAX_VIDEO_SIZE
  ? parseInt(process.env.MAX_VIDEO_SIZE)
  : 10 * 1024 * 1024; // 10MB default

function isValidExtension(filename, allowedExts) {
  const ext = path.extname(filename).replace(".", "").toLowerCase();
  return allowedExts.includes(ext);
}

// 🚀 VALIDATION - All fields are optional
const validate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("category")
    .optional()
    .isString()
    .trim()
    .withMessage("Category must be a string"),
  body("substructure")
    .optional()
    .isString()
    .trim()
    .withMessage("Substructure must be a string"),
  body("content")
    .optional()
    .isString()
    .trim()
    .withMessage("Content must be a string"),
  body("design")
    .optional()
    .isString()
    .trim()
    .withMessage("Design must be a string"),
  body("subfinish")
    .optional()
    .isString()
    .trim()
    .withMessage("Subfinish must be a string"),
  body("subsuitable")
    .optional()
    .isArray()
    .withMessage("Subsuitable must be an array of strings"),
  body("subsuitable.*")
    .optional()
    .isString()
    .withMessage("Each subsuitable item must be a string"),
  body("vendor")
    .optional()
    .isString()
    .trim()
    .withMessage("Vendor must be a string"),
  body("groupcode")
    .optional()
    .isMongoId()
    .withMessage("Groupcode must be a valid Mongo ID"),
  body("color").optional().isArray().withMessage("Color must be an array"),
  body("color.*")
    .optional()
    .isString()
    .withMessage("Each color must be a string"),
  body("motif")
    .optional()
    .isString()
    .trim()
    .withMessage("Motif must be a string"),
  body("um").optional().isString().withMessage("UM must be a string"),
  body("currency")
    .optional()
    .isString()
    .withMessage("Currency must be a string"),
  body("gsm").optional().isNumeric().withMessage("GSM must be a number"),
  body("oz").optional().isNumeric().withMessage("OZ must be a number"),
  body("cm").optional().isNumeric().withMessage("CM must be a number"),
  body("inch").optional().isNumeric().withMessage("Inch must be a number"),
  // Leadtime should be an array of strings (e.g. ["7 days", "14 days"]) if provided
  body("leadtime")
    .optional()
    .isArray()
    .withMessage("Leadtime must be an array"),
  body("leadtime.*")
    .optional()
    .isString()
    .withMessage("Each leadtime item must be a string"),
  // ProductTag should be an array of strings if provided
  body("productTag")
    .optional()
    .isArray()
    .withMessage("ProductTag must be an array"),
  body("productTag.*")
    .optional()
    .isString()
    .withMessage("Each productTag item must be a string"),
  // Video URL (optional) - if provided should be a valid URL
  body("videourl")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isURL()
    .withMessage("videourl must be a valid URL"),
  // Video alt text (optional)
  body("videoalt")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isString()
    .withMessage("videoalt must be a string"),
  // Product Q&A fields (all optional)
  body("productquestion1")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isString()
    .withMessage("productquestion1 must be a string"),
  body("productquestion2")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isString()
    .withMessage("productquestion2 must be a string"),
  body("productquestion3")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isString()
    .withMessage("productquestion3 must be a string"),
  body("productquestion4")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isString()
    .withMessage("productquestion4 must be a string"),
  body("productquestion5")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isString()
    .withMessage("productquestion5 must be a string"),
  body("productquestion6")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isString()
    .withMessage("productquestion6 must be a string"),
  body("productanswer1")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isString()
    .withMessage("productanswer1 must be a string"),
  body("productanswer2")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isString()
    .withMessage("productanswer2 must be a string"),
  body("productanswer3")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isString()
    .withMessage("productanswer3 must be a string"),
  body("productanswer4")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isString()
    .withMessage("productanswer4 must be a string"),
  body("productanswer5")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isString()
    .withMessage("productanswer5 must be a string"),
  body("productanswer6")
    .optional({ checkFalsy: false })
    .if((value) => value !== null && value !== undefined && value !== "")
    .isString()
    .withMessage("productanswer6 must be a string"),
  body("espoid")
    .optional()
    .isString()
    .trim()
    .withMessage("espoid must be a string"),
];

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Validation errors:", errors.array());
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  try {
    // Convert req.files array to object with fieldname keys if needed
    if (Array.isArray(req.files)) {
      const filesObj = {};
      for (const file of req.files) {
        if (!filesObj[file.fieldname]) filesObj[file.fieldname] = [];
        filesObj[file.fieldname].push(file);
      }
      req.files = filesObj;
    }
    // Debug: Log all request body and files for inspection
    console.log("[DEBUG] Product create request body:", req.body);
    console.log("[DEBUG] Product create request files:", req.files);
    // Validate image files
    const imageFields = ["file", "image1", "image2"];
    for (const field of imageFields) {
      if (req.files && req.files[field] && req.files[field][0]) {
        const fileObj = req.files[field][0];
        if (fileObj.size > MAX_IMAGE_SIZE) {
          return res.status(400).json({
            success: false,
            message: `Image file size for ${field} exceeds limit (${
              MAX_IMAGE_SIZE / (1024 * 1024)
            }MB)`,
          });
        }
        if (!isValidExtension(fileObj.originalname, ALLOWED_IMAGE_EXTENSIONS)) {
          return res.status(400).json({
            success: false,
            message: `Invalid image extension for ${field}. Allowed: ${ALLOWED_IMAGE_EXTENSIONS.join(
              ", "
            )}`,
          });
        }
      }
    }
    // Validate video file
    if (req.files && req.files.video && req.files.video[0]) {
      const videoObj = req.files.video[0];
      if (videoObj.size > MAX_VIDEO_SIZE) {
        return res.status(400).json({
          success: false,
          message: `Video file size exceeds limit (${
            MAX_VIDEO_SIZE / (1024 * 1024)
          }MB)`,
        });
      }
      if (!isValidExtension(videoObj.originalname, ALLOWED_VIDEO_EXTENSIONS)) {
        return res.status(400).json({
          success: false,
          message: `Invalid video extension. Allowed: ${ALLOWED_VIDEO_EXTENSIONS.join(
            ", "
          )}`,
        });
      }
    }
    const {
      name,
      category,
      substructure,
      content,
      design,
      subfinish,
      subsuitable,
      vendor,
      groupcode,
      color,
      motif,
      um,
      currency,
      gsm,
      oz,
      cm,
      inch,
      vendorFabricCode,
      leadtime,
      productTitle,
      productTagline,
      shortProductDescription,
      fullProductDescription,
      productTag,
      altimg1,
      altimg2,
      altimg3,
      altvideo,
      videourl,
      videoalt,
      productquestion1,
      productquestion2,
      productquestion3,
      productquestion4,
      productquestion5,
      productquestion6,
      productanswer1,
      productanswer2,
      productanswer3,
      productanswer4,
      productanswer5,
      productanswer6,
      espoid,
    } = req.body;
    // quantity removed — no longer stored on Product

    // 🚀 VALIDATION - Only validate groupcode since it's still a reference
    if (groupcode) {
      const groupcodeExists = await Groupcode.exists({ _id: groupcode });
      if (!groupcodeExists) {
        return res
          .status(400)
          .json({ success: false, message: "Groupcode not found" });
      }
    }

    // Validate subsuitable as an array of non-empty strings (if provided)
    if (subsuitable) {
      const items = Array.isArray(subsuitable) ? subsuitable : [subsuitable];
      const invalid = items.filter((s) => typeof s !== "string" || !s.trim());
      if (invalid.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid subsuitable values: ${invalid.join(", ")}`,
        });
      }
    }

    // Validate color array - now just strings
    if (color && Array.isArray(color) && color.length > 0) {
      const invalid = color.filter((c) => typeof c !== "string" || !c.trim());
      if (invalid.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid color values: ${invalid.join(", ")}`,
        });
      }
    }

    // Handle category folder naming (optional)
    let categoryFolder = "products"; // Default folder if no category
    if (category && typeof category === "string" && category.trim()) {
      categoryFolder = slugify(category, {
        lower: true,
        strict: true,
      });
    }

    // Handle main image - can be either a new file or an existing URL
    let image3Url = req.body.image3 || "";
    // Check if a new file was uploaded
    const mainImageFile =
      (req.files && req.files.file && req.files.file[0]) ||
      (req.files && req.files.image3 && req.files.image3[0]);
    if (mainImageFile) {
      const uploadResult = await cloudinaryServices.cloudinaryImageUpload(
        mainImageFile.buffer,
        name,
        categoryFolder
      );
      console.log("[DEBUG] Cloudinary main image upload result:", uploadResult);
      if (uploadResult && uploadResult.secure_url) {
        image3Url = uploadResult.secure_url;
      } else if (uploadResult && uploadResult.error) {
        return res.status(500).json({
          success: false,
          message:
            "Image upload failed: " +
            (uploadResult.error.message || "Unknown error"),
        });
      }
    }

    // Handle image1 - can be either a new file or an existing URL
    let image1Url = req.body.image1 || "";
    if (req.files && req.files.image1 && req.files.image1[0]) {
      const upload1 = await cloudinaryServices.cloudinaryImageUpload(
        req.files.image1[0].buffer,
        name + "-image1",
        categoryFolder
      );
      console.log("[DEBUG] Cloudinary image1 upload result:", upload1);
      if (upload1 && upload1.secure_url) {
        image1Url = upload1.secure_url;
      } else if (upload1 && upload1.error) {
        console.error("Image1 upload failed:", upload1.error);
      }
    }

    // Handle image2 - can be either a new file or an existing URL
    let image2Url = req.body.image2 || "";
    if (req.files && req.files.image2 && req.files.image2[0]) {
      const upload2 = await cloudinaryServices.cloudinaryImageUpload(
        req.files.image2[0].buffer,
        name + "-image2",
        categoryFolder
      );
      console.log("[DEBUG] Cloudinary image2 upload result:", upload2);
      if (upload2 && upload2.secure_url) {
        image2Url = upload2.secure_url;
      } else if (upload2 && upload2.error) {
        console.error("Image2 upload failed:", upload2.error);
      }
    }

    // Handle video - can be either a new file or an existing URL
    let videoUrl = req.body.video || "";
    let videoThumbnailUrl = req.body.videoThumbnail || "";
    if (req.files && req.files.video && req.files.video[0]) {
      const videoResult = await cloudinaryServices.cloudinaryImageUpload(
        req.files.video[0].buffer,
        name + "-video",
        categoryFolder,
        false,
        "video"
      );
      console.log("[DEBUG] Cloudinary video upload result:", videoResult);
      // Extract AV1 video and thumbnail URLs
      if (videoResult) {
        if (videoResult.eager && videoResult.eager.length > 0) {
          videoUrl =
            videoResult.eager[0].secure_url ||
            videoResult.secure_url ||
            videoUrl;
          videoThumbnailUrl =
            videoResult.eager[1] && videoResult.eager[1].secure_url
              ? videoResult.eager[1].secure_url
              : videoThumbnailUrl;
        } else if (videoResult.secure_url) {
          videoUrl = videoResult.secure_url;
        }
      }
      if (videoResult && videoResult.error) {
        console.error("Video upload failed:", videoResult.error);
      }
    }
    // Normalize leadtime into an array of trimmed strings (remove falsy/empty)
    let leadtimeArr = undefined;
    if (typeof leadtime !== "undefined") {
      leadtimeArr = Array.isArray(leadtime) ? leadtime : [leadtime];
      leadtimeArr = leadtimeArr
        .map((v) => (v == null ? "" : String(v)))
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const product = new Product({
      name,
      image3: image3Url,
      image1: image1Url,
      image2: image2Url,
      video: videoUrl,
      videourl: videourl || videoUrl,
      videoThumbnail: videoThumbnailUrl,
      category,
      substructure,
      content,
      design,
      subfinish,
      subsuitable,
      leadtime: leadtimeArr,
      leadtime,
      vendor,
      groupcode,
      color,
      motif,
      um,
      currency,
      gsm,
      oz,
      cm,
      inch,
      vendorFabricCode,
      productTitle,
      productTagline,
      shortProductDescription,
      fullProductDescription,
      productTag,
      altimg1,
      altimg2,
      altimg3,
      altvideo,
      videoalt: videoalt || altvideo,
      productquestion1,
      productquestion2,
      productquestion3,
      productquestion4,
      productquestion5,
      productquestion6,
      productanswer1,
      productanswer2,
      productanswer3,
      productanswer4,
      productanswer5,
      productanswer6,
      espoid,
    });

    await product.save();

    // 🚀 OPTIMIZED QUERY - Only populate groupcode since other fields are now strings
    const populated = await Product.findById(product._id)
      .populate("groupcode", "name")
      .lean();

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error("🔥 Product creation error:", error.message);
    console.error("🔍 Stack:", error.stack);
    console.error("📦 Full error object:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || "Unknown error",
    });
  }
};

const viewAll = async (req, res) => {
  try {
    // 🚀 ULTRA-FAST PRODUCT QUERY OPTIMIZATIONS - NO LIMITS, ALL DATA
    const fields = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "";

    // 🚀 GET ALL PRODUCTS - NO PAGINATION LIMITS
    let products = await Product.find({}, fields)
      .lean() // Convert to plain objects for speed
      .populate("groupcode", "name")
      .exec();

    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, error });
  }
};

const viewById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("groupcode", "name");
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, error });
  }
};

// Helper function to validate uploaded files
const validateFile = (fileObj, allowedExts, maxSize, label) => {
  if (fileObj.size > maxSize) {
    throw new Error(
      `${label} file size exceeds limit (${Math.round(
        maxSize / (1024 * 1024)
      )}MB)`
    );
  }
  if (!isValidExtension(fileObj.originalname, allowedExts)) {
    throw new Error(
      `Invalid ${label} extension. Allowed: ${allowedExts.join(", ")}`
    );
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Normalize leadtime in updateData: allow single string or array, store as array of trimmed strings
    if (typeof updateData.leadtime !== "undefined") {
      const lt = updateData.leadtime;
      const arr = Array.isArray(lt) ? lt : [lt];
      const normalized = arr
        .map((v) => (v == null ? "" : String(v)))
        .map((s) => s.trim())
        .filter(Boolean);
      if (normalized.length > 0) updateData.leadtime = normalized;
      else delete updateData.leadtime;
    }

    // Normalize req.files (multer.any() => array) into { [fieldname]: File[] }
    if (Array.isArray(req.files)) {
      const filesObj = {};
      for (const file of req.files) {
        if (!filesObj[file.fieldname]) filesObj[file.fieldname] = [];
        filesObj[file.fieldname].push(file);
      }
      req.files = filesObj;
    }

    // quantity removed — ignore quantity updates coming in request body

    // Fetch the product to get old image URLs and category for folder
    const oldProduct = await Product.findById(id).lean();
    if (!oldProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    // Get category name for folder
    let categoryFolder = "products";
    const categoryName = updateData.category || oldProduct.category;
    if (
      categoryName &&
      typeof categoryName === "string" &&
      categoryName.trim()
    ) {
      categoryFolder = slugify(categoryName, {
        lower: true,
        strict: true,
      });
    }

    // ---- MEDIA UPDATES ----
    try {
      // Main image: accept 'file' or 'image3'
      const mainImageFile = req.files?.file?.[0] || req.files?.image3?.[0];

      if (mainImageFile) {
        validateFile(
          mainImageFile,
          ALLOWED_IMAGE_EXTENSIONS,
          MAX_IMAGE_SIZE,
          "image"
        );
        const uploaded = await cloudinaryServices.cloudinaryImageUpload(
          mainImageFile.buffer,
          req.body.name || oldProduct.name || "product",
          categoryFolder
        );
        if (uploaded?.secure_url) {
          if (oldProduct.image3) {
            const publicId = oldProduct.image3
              .split("/")
              .slice(-1)[0]
              .split(".")[0];
            cloudinaryServices
              .cloudinaryImageDelete(publicId)
              .catch(console.error);
          }
          updateData.image3 = uploaded.secure_url;
        }
      }

      // image1
      if (req.files?.image1?.[0]) {
        const f = req.files.image1[0];
        validateFile(f, ALLOWED_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE, "image1");
        const up = await cloudinaryServices.cloudinaryImageUpload(
          f.buffer,
          (req.body.name || oldProduct.name || "product") + "-image1",
          categoryFolder
        );
        if (up?.secure_url) {
          if (oldProduct.image1) {
            const publicId = oldProduct.image1
              .split("/")
              .slice(-1)[0]
              .split(".")[0];
            cloudinaryServices
              .cloudinaryImageDelete(publicId)
              .catch(console.error);
          }
          updateData.image1 = up.secure_url;
        }
      }

      // image2
      if (req.files?.image2?.[0]) {
        const f = req.files.image2[0];
        validateFile(f, ALLOWED_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE, "image2");
        const up = await cloudinaryServices.cloudinaryImageUpload(
          f.buffer,
          (req.body.name || oldProduct.name || "product") + "-image2",
          categoryFolder
        );
        if (up?.secure_url) {
          if (oldProduct.image2) {
            const publicId = oldProduct.image2
              .split("/")
              .slice(-1)[0]
              .split(".")[0];
            cloudinaryServices
              .cloudinaryImageDelete(publicId)
              .catch(console.error);
          }
          updateData.image2 = up.secure_url;
        }
      }

      // video
      if (req.files?.video?.[0]) {
        const vf = req.files.video[0];
        validateFile(vf, ALLOWED_VIDEO_EXTENSIONS, MAX_VIDEO_SIZE, "video");
        const vUp = await cloudinaryServices.cloudinaryImageUpload(
          vf.buffer,
          (req.body.name || oldProduct.name || "product") + "-video",
          categoryFolder,
          false,
          "video" // ensure resource_type 'video'
        );
        if (vUp) {
          // Use eager[0] as in create(), fallback to secure_url
          updateData.video =
            (vUp.eager && vUp.eager[0]?.secure_url) || vUp.secure_url || "";
          updateData.videoThumbnail =
            (vUp.eager && vUp.eager[1]?.secure_url) ||
            updateData.videoThumbnail ||
            "";
          // Delete old video if exists
          if (oldProduct.video) {
            const publicId = oldProduct.video
              .split("/")
              .slice(-1)[0]
              .split(".")[0];
            cloudinaryServices
              .cloudinaryImageDelete(publicId, "video")
              .catch(console.error);
          }
        }
      }
    } catch (mediaErr) {
      return res
        .status(400)
        .json({ success: false, message: mediaErr.message });
    }

    // 🚀 VALIDATION - Only validate groupcode and array fields
    if (updateData.groupcode) {
      const groupcodeExists = await Groupcode.exists({
        _id: updateData.groupcode,
      });
      if (!groupcodeExists) {
        return res.status(400).json({
          success: false,
          message: "Groupcode not found",
        });
      }
    }

    if (updateData.subsuitable) {
      const items = Array.isArray(updateData.subsuitable)
        ? updateData.subsuitable
        : [updateData.subsuitable];
      const invalid = items.filter((s) => typeof s !== "string" || !s.trim());
      if (invalid.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid subsuitable values",
        });
      }
    }

    if (updateData.color) {
      const colors = Array.isArray(updateData.color)
        ? updateData.color
        : [updateData.color];
      const invalid = colors.filter((c) => typeof c !== "string" || !c.trim());
      if (invalid.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid color values",
        });
      }
    }

    // Sanitize updateData - but allow empty strings for FAQ fields to clear them
    Object.keys(updateData).forEach((key) => {
      const isFAQField =
        key.startsWith("productquestion") || key.startsWith("productanswer");

      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      } else if (updateData[key] === "" && !isFAQField) {
        delete updateData[key];
      }
      // For FAQ fields, keep empty strings to allow clearing them
    });

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("groupcode", "name")
      .lean();

    if (!updated) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE PRODUCT BY ESPOID
const updateByEspoid = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const { espoid } = req.params;
    const updateData = { ...req.body };

    // Normalize leadtime in updateData: allow single string or array, store as array of trimmed strings
    if (typeof updateData.leadtime !== "undefined") {
      const lt = updateData.leadtime;
      const arr = Array.isArray(lt) ? lt : [lt];
      const normalized = arr
        .map((v) => (v == null ? "" : String(v)))
        .map((s) => s.trim())
        .filter(Boolean);
      if (normalized.length > 0) updateData.leadtime = normalized;
      else delete updateData.leadtime;
    }

    // Normalize req.files (multer.any() => array) into { [fieldname]: File[] }
    if (Array.isArray(req.files)) {
      const filesObj = {};
      for (const file of req.files) {
        if (!filesObj[file.fieldname]) filesObj[file.fieldname] = [];
        filesObj[file.fieldname].push(file);
      }
      req.files = filesObj;
    }

    // quantity removed — ignore quantity updates coming in request body

    // Fetch the product to get old image URLs and category for folder
    const oldProduct = await Product.findOne({ espoid }).lean();
    if (!oldProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found with given espoid",
      });
    }
    // Get category name for folder
    let categoryFolder = "products";
    const categoryName = updateData.category || oldProduct.category;
    if (
      categoryName &&
      typeof categoryName === "string" &&
      categoryName.trim()
    ) {
      categoryFolder = slugify(categoryName, {
        lower: true,
        strict: true,
      });
    }

    // ---- MEDIA UPDATES ----
    try {
      // Main image: accept 'file' or 'image3'
      const mainImageFile = req.files?.file?.[0] || req.files?.image3?.[0];

      if (mainImageFile) {
        validateFile(
          mainImageFile,
          ALLOWED_IMAGE_EXTENSIONS,
          MAX_IMAGE_SIZE,
          "image"
        );
        const uploaded = await cloudinaryServices.cloudinaryImageUpload(
          mainImageFile.buffer,
          req.body.name || oldProduct.name || "product",
          categoryFolder
        );
        if (uploaded?.secure_url) {
          if (oldProduct.image3) {
            const publicId = oldProduct.image3
              .split("/")
              .slice(-1)[0]
              .split(".")[0];
            cloudinaryServices
              .cloudinaryImageDelete(publicId)
              .catch(console.error);
          }
          updateData.image3 = uploaded.secure_url;
        }
      }

      // image1
      if (req.files?.image1?.[0]) {
        const f = req.files.image1[0];
        validateFile(f, ALLOWED_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE, "image1");
        const up = await cloudinaryServices.cloudinaryImageUpload(
          f.buffer,
          (req.body.name || oldProduct.name || "product") + "-image1",
          categoryFolder
        );
        if (up?.secure_url) {
          if (oldProduct.image1) {
            const publicId = oldProduct.image1
              .split("/")
              .slice(-1)[0]
              .split(".")[0];
            cloudinaryServices
              .cloudinaryImageDelete(publicId)
              .catch(console.error);
          }
          updateData.image1 = up.secure_url;
        }
      }

      // image2
      if (req.files?.image2?.[0]) {
        const f = req.files.image2[0];
        validateFile(f, ALLOWED_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE, "image2");
        const up = await cloudinaryServices.cloudinaryImageUpload(
          f.buffer,
          (req.body.name || oldProduct.name || "product") + "-image2",
          categoryFolder
        );
        if (up?.secure_url) {
          if (oldProduct.image2) {
            const publicId = oldProduct.image2
              .split("/")
              .slice(-1)[0]
              .split(".")[0];
            cloudinaryServices
              .cloudinaryImageDelete(publicId)
              .catch(console.error);
          }
          updateData.image2 = up.secure_url;
        }
      }

      // video
      if (req.files?.video?.[0]) {
        const vf = req.files.video[0];
        validateFile(vf, ALLOWED_VIDEO_EXTENSIONS, MAX_VIDEO_SIZE, "video");
        const vUp = await cloudinaryServices.cloudinaryImageUpload(
          vf.buffer,
          (req.body.name || oldProduct.name || "product") + "-video",
          categoryFolder,
          false,
          "video" // ensure resource_type 'video'
        );
        if (vUp) {
          // Use eager[0] as in create(), fallback to secure_url
          updateData.video =
            (vUp.eager && vUp.eager[0]?.secure_url) || vUp.secure_url || "";
          updateData.videoThumbnail =
            (vUp.eager && vUp.eager[1]?.secure_url) ||
            updateData.videoThumbnail ||
            "";
          // Delete old video if exists
          if (oldProduct.video) {
            const publicId = oldProduct.video
              .split("/")
              .slice(-1)[0]
              .split(".")[0];
            cloudinaryServices
              .cloudinaryImageDelete(publicId, "video")
              .catch(console.error);
          }
        }
      }
    } catch (mediaErr) {
      return res
        .status(400)
        .json({ success: false, message: mediaErr.message });
    }

    // 🚀 VALIDATION - Only validate groupcode and array fields
    if (updateData.groupcode) {
      const groupcodeExists = await Groupcode.exists({
        _id: updateData.groupcode,
      });
      if (!groupcodeExists) {
        return res.status(400).json({
          success: false,
          message: "Groupcode not found",
        });
      }
    }

    if (updateData.subsuitable) {
      const items = Array.isArray(updateData.subsuitable)
        ? updateData.subsuitable
        : [updateData.subsuitable];
      const invalid = items.filter((s) => typeof s !== "string" || !s.trim());
      if (invalid.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid subsuitable values",
        });
      }
    }

    if (updateData.color) {
      const colors = Array.isArray(updateData.color)
        ? updateData.color
        : [updateData.color];
      const invalid = colors.filter((c) => typeof c !== "string" || !c.trim());
      if (invalid.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid color values",
        });
      }
    }

    // Sanitize updateData - but allow empty strings for FAQ fields to clear them
    Object.keys(updateData).forEach((key) => {
      const isFAQField =
        key.startsWith("productquestion") || key.startsWith("productanswer");

      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      } else if (updateData[key] === "" && !isFAQField) {
        delete updateData[key];
      }
      // For FAQ fields, keep empty strings to allow clearing them
    });

    const updated = await Product.findOneAndUpdate({ espoid }, updateData, {
      new: true,
    })
      .populate("groupcode", "name")
      .lean();

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found with given espoid",
      });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    // Prevent deletion if referenced by any SEO
    const seoUsing = await Seo.findOne({ product: id });
    if (seoUsing) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete: Product is in use by one or more SEO records.",
      });
    }
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    // Remove image file
    if (deleted.image3) {
      const publicId = deleted.image3.split("/").pop().split(".")[0];
      await cloudinaryServices.cloudinaryImageDelete(publicId);
    }
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE PRODUCT BY ESPOID
const deleteByEspoid = async (req, res) => {
  try {
    const { espoid } = req.params;

    if (!espoid) {
      return res.status(400).json({
        success: false,
        message: "Espoid is required",
      });
    }

    // Prevent deletion if referenced by any SEO
    const product = await Product.findOne({ espoid });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found with given espoid",
      });
    }

    const seoUsing = await Seo.findOne({ product: product._id });
    if (seoUsing) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete: Product is in use by one or more SEO records.",
      });
    }

    const deleted = await Product.findOneAndDelete({ espoid });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    // Remove image file
    if (deleted.image3) {
      const publicId = deleted.image3.split("/").pop().split(".")[0];
      await cloudinaryServices.cloudinaryImageDelete(publicId);
    }

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SEARCH PRODUCTS BY NAME OR SLUG
const searchProducts = async (req, res, next) => {
  const q = req.params.q || "";
  // Escape regex special characters
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const safeQ = escapeRegex(q);
  try {
    const results = await Product.find({
      $or: [
        { name: { $regex: safeQ, $options: "i" } },
        { slug: { $regex: safeQ, $options: "i" } },
      ],
    });
    res.status(200).json({ status: 1, data: results });
  } catch (error) {
    next(error);
  }
};

// GET ALL PRODUCTS BY GROUPCODE ID
const getProductsByGroupcode = async (req, res, next) => {
  const { groupcodeId } = req.params;
  try {
    const products = await Product.find({ groupcode: groupcodeId });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ status: 0, message: "No products found for this group code" });
    }
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCTS BY CATEGORY NAME
const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.categoryId });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: "No products found for this category" });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCTS BY CATEGORY NAME (Simple method)
const getProductsByCategoryName = async (req, res) => {
  try {
    let { categoryName } = req.params;

    if (!categoryName) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Handle URL decoding issues
    try {
      categoryName = decodeURIComponent(categoryName);
    } catch (decodeError) {
      // If decoding fails, use the original parameter
      console.warn(
        "URL decoding failed for category name:",
        categoryName,
        decodeError.message
      );
    }

    // Escape special regex characters to prevent regex injection
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeCategoryName = escapeRegex(categoryName);

    // Find products with matching category name (case-insensitive)
    const products = await Product.find({
      category: { $regex: new RegExp(`^${safeCategoryName}$`, "i") },
    })
      .populate("groupcode", "name")
      .lean();

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: `No products found for category: ${categoryName}`,
      });
    }

    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
      category: categoryName,
    });
  } catch (error) {
    console.error("Error fetching products by category name:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// GET PRODUCTS BY SUBSTRUCTURE NAME
const getProductsBySubstructureName = async (req, res) => {
  try {
    let { substructureName } = req.params;

    if (!substructureName) {
      return res.status(400).json({
        success: false,
        message: "Substructure name is required",
      });
    }

    // Handle URL decoding issues
    try {
      substructureName = decodeURIComponent(substructureName);
    } catch (decodeError) {
      console.warn(
        "URL decoding failed for substructure name:",
        substructureName,
        decodeError.message
      );
    }

    // Escape special regex characters
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeSubstructureName = escapeRegex(substructureName);

    const products = await Product.find({
      substructure: { $regex: new RegExp(`^${safeSubstructureName}$`, "i") },
    })
      .populate("groupcode", "name")
      .lean();

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: `No products found for substructure: ${substructureName}`,
      });
    }

    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
      substructure: substructureName,
    });
  } catch (error) {
    console.error("Error fetching products by substructure name:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// GET PRODUCTS BY CONTENT NAME
const getProductsByContentName = async (req, res) => {
  try {
    let { contentName } = req.params;

    if (!contentName) {
      return res.status(400).json({
        success: false,
        message: "Content name is required",
      });
    }

    // Handle URL decoding issues
    try {
      contentName = decodeURIComponent(contentName);
    } catch (decodeError) {
      console.warn(
        "URL decoding failed for content name:",
        contentName,
        decodeError.message
      );
    }

    // Escape special regex characters
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeContentName = escapeRegex(contentName);

    const products = await Product.find({
      content: { $regex: new RegExp(`^${safeContentName}$`, "i") },
    })
      .populate("groupcode", "name")
      .lean();

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: `No products found for content: ${contentName}`,
      });
    }

    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
      content: contentName,
    });
  } catch (error) {
    console.error("Error fetching products by content name:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// GET PRODUCTS BY DESIGN NAME
const getProductsByDesignName = async (req, res) => {
  try {
    let { designName } = req.params;

    if (!designName) {
      return res.status(400).json({
        success: false,
        message: "Design name is required",
      });
    }

    // Handle URL decoding issues
    try {
      designName = decodeURIComponent(designName);
    } catch (decodeError) {
      console.warn(
        "URL decoding failed for design name:",
        designName,
        decodeError.message
      );
    }

    // Escape special regex characters
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeDesignName = escapeRegex(designName);

    const products = await Product.find({
      design: { $regex: new RegExp(`^${safeDesignName}$`, "i") },
    })
      .populate("groupcode", "name")
      .lean();

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: `No products found for design: ${designName}`,
      });
    }

    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
      design: designName,
    });
  } catch (error) {
    console.error("Error fetching products by design name:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// GET PRODUCTS BY SUBFINISH NAME
const getProductsBySubfinishName = async (req, res) => {
  try {
    let { subfinishName } = req.params;

    if (!subfinishName) {
      return res.status(400).json({
        success: false,
        message: "Subfinish name is required",
      });
    }

    // Handle URL decoding issues
    try {
      subfinishName = decodeURIComponent(subfinishName);
    } catch (decodeError) {
      console.warn(
        "URL decoding failed for subfinish name:",
        subfinishName,
        decodeError.message
      );
    }

    // Escape special regex characters
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeSubfinishName = escapeRegex(subfinishName);

    const products = await Product.find({
      subfinish: { $regex: new RegExp(`^${safeSubfinishName}$`, "i") },
    })
      .populate("groupcode", "name")
      .lean();

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: `No products found for subfinish: ${subfinishName}`,
      });
    }

    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
      subfinish: subfinishName,
    });
  } catch (error) {
    console.error("Error fetching products by subfinish name:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// GET PRODUCTS BY VENDOR NAME
const getProductsByVendorName = async (req, res) => {
  try {
    let { vendorName } = req.params;

    if (!vendorName) {
      return res.status(400).json({
        success: false,
        message: "Vendor name is required",
      });
    }

    // Handle URL decoding issues
    try {
      vendorName = decodeURIComponent(vendorName);
    } catch (decodeError) {
      console.warn(
        "URL decoding failed for vendor name:",
        vendorName,
        decodeError.message
      );
    }

    // Escape special regex characters
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeVendorName = escapeRegex(vendorName);

    const products = await Product.find({
      vendor: { $regex: new RegExp(`^${safeVendorName}$`, "i") },
    })
      .populate("groupcode", "name")
      .lean();

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: `No products found for vendor: ${vendorName}`,
      });
    }

    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
      vendor: vendorName,
    });
  } catch (error) {
    console.error("Error fetching products by vendor name:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// GET PRODUCTS BY MOTIF NAME
const getProductsByMotifName = async (req, res) => {
  try {
    let { motifName } = req.params;

    if (!motifName) {
      return res.status(400).json({
        success: false,
        message: "Motif name is required",
      });
    }

    // Handle URL decoding issues
    try {
      motifName = decodeURIComponent(motifName);
    } catch (decodeError) {
      console.warn(
        "URL decoding failed for motif name:",
        motifName,
        decodeError.message
      );
    }

    // Escape special regex characters
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeMotifName = escapeRegex(motifName);

    const products = await Product.find({
      motif: { $regex: new RegExp(`^${safeMotifName}$`, "i") },
    })
      .populate("groupcode", "name")
      .lean();

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: `No products found for motif: ${motifName}`,
      });
    }

    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
      motif: motifName,
    });
  } catch (error) {
    console.error("Error fetching products by motif name:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// GET PRODUCTS BY COLOR NAME (searches in color array, supports multiple colors)
const getProductsByColorName = async (req, res) => {
  try {
    const { colors } = req.query;

    if (!colors) {
      return res.status(400).json({
        success: false,
        message: "Colors parameter is required. Use ?colors=red,yellow,blue",
      });
    }

    // Split colors by comma and trim whitespace
    const colorArray = colors
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);

    if (colorArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one color name is required",
      });
    }

    // Handle URL decoding and escape regex characters for each color
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const processedColors = colorArray.map((colorName) => {
      try {
        const decodedColor = decodeURIComponent(colorName);
        return escapeRegex(decodedColor);
      } catch (decodeError) {
        console.warn(
          "URL decoding failed for color name:",
          colorName,
          decodeError.message
        );
        return escapeRegex(colorName);
      }
    });

    // Create regex patterns for each color (case-insensitive)
    const colorRegexPatterns = processedColors.map(
      (color) => new RegExp(`^${color}$`, "i")
    );

    // Search for products where the color array contains any of the specified colors
    const products = await Product.find({
      color: {
        $elemMatch: {
          $in: colorRegexPatterns,
        },
      },
    })
      .populate("groupcode", "name")
      .lean();

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: `No products found for colors: ${colorArray.join(", ")}`,
      });
    }

    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
      colors: colorArray,
    });
  } catch (error) {
    console.error("Error fetching products by color names:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// GET PRODUCTS BY SUBSUITABLE NAME (searches in subsuitable array, supports multiple subsuitables)
const getProductsBySubsuitableName = async (req, res) => {
  try {
    const { subsuitables } = req.query;

    if (!subsuitables) {
      return res.status(400).json({
        success: false,
        message:
          "Subsuitables parameter is required. Use ?subsuitables=indoor,outdoor,commercial",
      });
    }

    // Split subsuitables by comma and trim whitespace
    const subsuitableArray = subsuitables
      .split(",")
      .map((subsuitable) => subsuitable.trim())
      .filter(Boolean);

    if (subsuitableArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one subsuitable name is required",
      });
    }

    // Handle URL decoding and escape regex characters for each subsuitable
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const processedSubsuitables = subsuitableArray.map((subsuitableName) => {
      try {
        const decodedSubsuitable = decodeURIComponent(subsuitableName);
        return escapeRegex(decodedSubsuitable);
      } catch (decodeError) {
        console.warn(
          "URL decoding failed for subsuitable name:",
          subsuitableName,
          decodeError.message
        );
        return escapeRegex(subsuitableName);
      }
    });

    // Create regex patterns for each subsuitable (case-insensitive)
    const subsuitableRegexPatterns = processedSubsuitables.map(
      (subsuitable) => new RegExp(`^${subsuitable}$`, "i")
    );

    // Search for products where the subsuitable array contains any of the specified subsuitables
    const products = await Product.find({
      subsuitable: {
        $elemMatch: {
          $in: subsuitableRegexPatterns,
        },
      },
    })
      .populate("groupcode", "name")
      .lean();

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: `No products found for subsuitables: ${subsuitableArray.join(
          ", "
        )}`,
      });
    }

    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
      subsuitables: subsuitableArray,
    });
  } catch (error) {
    console.error("Error fetching products by subsuitable names:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// GET PRODUCTS BY CONTENT NAME
const getProductsByContent = async (req, res, next) => {
  try {
    const products = await Product.find({ content: req.params.contentId });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: "No products found for this content" });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCTS BY DESIGN NAME
const getProductsByDesign = async (req, res, next) => {
  try {
    const products = await Product.find({ design: req.params.designId });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: "No products found for this design" });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCTS BY COLOR NAME
const getProductsByColor = async (req, res, next) => {
  try {
    const products = await Product.find({
      color: { $in: [req.params.colorId] },
    });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: "No products found for this color" });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCTS BY MOTIF NAME
const getProductsByMotif = async (req, res, next) => {
  try {
    const products = await Product.find({ motif: req.params.motifId });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: "No products found for this motif" });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCTS BY VENDOR NAME
const getProductsByVendor = async (req, res, next) => {
  try {
    const products = await Product.find({ vendor: req.params.vendorId });
    if (!products.length)
      return res
        .status(404)
        .json({ status: 0, message: "No products found for this vendor" });
    res.status(200).json({ status: 1, data: products });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCTS BY PRODUCT TAG (case-insensitive match against items in productTag array)
const productByProductTag = async (req, res, next) => {
  try {
    const tag = (
      req.params.productTag ||
      req.query.productTag ||
      req.body.productTag ||
      ""
    )
      .toString()
      .trim();
    if (!tag) {
      return res
        .status(400)
        .json({ status: 0, message: "productTag is required" });
    }

    // Escape regex special characters for safety
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeTag = escapeRegex(tag);

    // Match any array element equal to the tag (case-insensitive)
    const regex = new RegExp(`^${safeTag}$`, "i");
    const products = await Product.find({ productTag: { $in: [regex] } })
      .populate("groupcode", "name")
      .lean();

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ status: 0, message: "No products found for this productTag" });
    }

    return res
      .status(200)
      .json({ status: 1, total: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCTS BY GSM RANGE
const getProductsByGsmValue = async (req, res, next) => {
  const value = Number(req.params.value);
  try {
    if (isNaN(value))
      return res.status(400).json({ status: 0, message: "Invalid GSM value" });
    const range = value * 0.15;
    const min = value - range;
    const max = value + range;
    const matched = await Product.find({ gsm: { $gte: min, $lte: max } });
    if (!matched.length)
      return res
        .status(404)
        .json({ status: 0, message: "No GSM products found in range" });
    res.status(200).json({ status: 1, data: matched });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCTS BY OZ RANGE
const getProductsByOzValue = async (req, res, next) => {
  const value = Number(req.params.value);
  try {
    if (isNaN(value))
      return res.status(400).json({ status: 0, message: "Invalid OZ value" });
    const range = value * 0.15;
    const min = value - range;
    const max = value + range;
    const matched = await Product.find({ oz: { $gte: min, $lte: max } });
    if (!matched.length)
      return res
        .status(404)
        .json({ status: 0, message: "No OZ products found in range" });
    res.status(200).json({ status: 1, data: matched });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCTS BY INCH RANGE
const getProductsByInchValue = async (req, res, next) => {
  const value = Number(req.params.value);
  try {
    if (isNaN(value))
      return res.status(400).json({ status: 0, message: "Invalid Inch value" });
    const range = value * 0.15;
    const min = value - range;
    const max = value + range;
    const query = { inch: { $gte: min, $lte: max } };
    const matched = await Product.find(query);
    // Transform image URLs for all matched products
    const transformedProducts = matched.map((product) => {
      // Handle both Mongoose documents and plain objects
      return typeof product.toObject === "function"
        ? product.toObject()
        : product;
    });
    res.status(200).json({ status: 1, data: transformedProducts });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCTS BY CM RANGE
const getProductsByCmValue = async (req, res, next) => {
  const value = Number(req.params.value);
  try {
    if (isNaN(value))
      return res.status(400).json({ status: 0, message: "Invalid CM value" });
    const range = value * 0.15;
    const min = value - range;
    const max = value + range;
    const matched = await Product.find({ cm: { $gte: min, $lte: max } });
    if (!matched.length)
      return res
        .status(404)
        .json({ status: 0, message: "No CM products found in range" });
    res.status(200).json({ status: 1, data: matched });
  } catch (error) {
    next(error);
  }
};

// Quantity-based product filtering removed — `quantity` field no longer exists on Product

// GET PRODUCT BY SLUG
const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        status: 0,
        message: "Product slug is required",
      });
    }

    const product = await Product.findOne({ slug }).populate("groupcode");

    if (!product) {
      return res.status(404).json({
        status: 0,
        message: "Product not found",
      });
    }

    // Transform image URLs before sending response
    const productObj =
      typeof product.toObject === "function" ? product.toObject() : product;

    res.status(200).json({
      status: 1,
      data: productObj,
    });
  } catch (error) {
    console.error("Error getting product by slug:", error);
    next(error);
  }
};

// GET ALL PRODUCTS WITHOUT VENDOR INFORMATION
const getAllProductsExceptVendor = async (req, res) => {
  try {
    const products = await Product.find({})
      .select("-vendor") // Exclude vendor field

      .lean();

    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PRODUCT BY SLUG WITHOUT VENDOR INFO
const getPublicProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        status: 0,
        message: "Product slug is required",
      });
    }

    const product = await Product.findOne({ slug })
      .select("-vendor") // Exclude vendor field
      .populate("groupcode")
      .lean();

    if (!product) {
      return res.status(404).json({
        status: 0,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: 1,
      data: product,
    });
  } catch (error) {
    console.error("Error getting public product by slug:", error);
    next(error);
  }
};

// Note: Popular/top-rated/landing/shopy product flags and endpoints
// have been removed from the Product schema. Corresponding
// endpoints were removed to avoid referencing deleted fields.

// Get product by productIdentifier
const getproductByProductIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Find product by vendorFabricCode
    const product = await Product.findOne({
      vendorFabricCode: identifier,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found with the given identifier",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product by identifier:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// GET PRODUCTS BY ESPOID
const getProductsByEspoid = async (req, res) => {
  try {
    const { espoid } = req.params;

    if (!espoid) {
      return res.status(400).json({
        success: false,
        message: "Espoid is required",
      });
    }

    // Search for products with the given espoid
    const products = await Product.find({ espoid: espoid }).populate(
      "groupcode",
      "name"
    );

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No products found with espoid: ${espoid}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products by espoid:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  multiUpload,
  handleColorArray,
  handleSubsuitableArray,
  handleLeadtimeArray,
  handleProductTagArray,
  create,
  viewAll,
  viewById,
  update,
  updateByEspoid,
  deleteById,
  deleteByEspoid,
  validate,
  getproductByProductIdentifier,
  searchProducts,
  getProductsByGroupcode,
  getProductsByCategory,
  getProductsByCategoryName,
  getProductsBySubstructureName,
  getProductsByContent,
  getProductsByContentName,
  getProductsByDesign,
  getProductsByDesignName,
  getProductsBySubfinishName,
  getProductsByColor,
  getProductsByColorName,
  getProductsBySubsuitableName,
  getProductsByMotif,
  getProductsByMotifName,
  getProductsByVendor,
  getProductsByVendorName,
  productByProductTag,
  getProductsByGsmValue,
  getProductsByOzValue,
  getProductsByInchValue,
  getProductsByCmValue,
  getProductBySlug,
  getAllProductsExceptVendor,
  getPublicProductBySlug,
  deleteProductImage,
  getProductsByEspoid,
};

// DELETE PRODUCT IMAGE
async function deleteProductImage(req, res) {
  try {
    const { id, imageName } = req.params;

    // Find the product
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Determine which image field contains the image to delete
    const imageFields = ["image3", "image1", "image2"];
    let imageDeleted = false;

    for (const field of imageFields) {
      if (product[field] && product[field].includes(imageName)) {
        try {
          // Extract public ID from the Cloudinary URL
          // The public ID is the part of the URL after the last slash and before the file extension
          const urlParts = product[field].split("/");
          const filename = urlParts[urlParts.length - 1];
          const publicId = filename.split(".")[0]; // Remove file extension

          // Delete the image from Cloudinary
          await cloudinaryServices.cloudinaryImageDelete(publicId);

          // Remove the image URL from the product
          product[field] = undefined;
          await product.save();

          imageDeleted = true;
          break;
        } catch (error) {
          console.error(
            `Error deleting ${field} image from Cloudinary:`,
            error
          );
          return res.status(500).json({
            success: false,
            message: `Error deleting ${field} image from Cloudinary`,
          });
        }
      }
    }

    if (!imageDeleted) {
      return res.status(404).json({
        success: false,
        message: "Image not found in product",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product image:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting image",
    });
  }
}

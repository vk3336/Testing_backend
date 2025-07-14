const { body, validationResult } = require("express-validator");
const Product = require("../model/Product");
const Substructure = require("../model/Substructure");
const Content = require("../model/Content");
const Design = require("../model/Design");
const Subfinish = require("../model/Subfinish");
const Subsuitable = require("../model/Subsuitable");
const Vendor = require("../model/Vendor");
const Groupcode = require("../model/Groupcode");
const Color = require("../model/Color");
const Category = require("../model/Category");
const { cloudinaryServices } = require("../services/cloudinary.service.js");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// 🚀 OPTIMIZED VALIDATION - Single batch validation
const validate = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters")
    .notEmpty()
    .withMessage("Name is required"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid Mongo ID"),
  body("substructure")
    .notEmpty()
    .withMessage("Substructure is required")
    .isMongoId()
    .withMessage("Substructure must be a valid Mongo ID"),
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isMongoId()
    .withMessage("Content must be a valid Mongo ID"),
  body("design")
    .notEmpty()
    .withMessage("Design is required")
    .isMongoId()
    .withMessage("Design must be a valid Mongo ID"),
  body("subfinish")
    .notEmpty()
    .withMessage("Subfinish is required")
    .isMongoId()
    .withMessage("Subfinish must be a valid Mongo ID"),
  body("subsuitable")
    .notEmpty()
    .withMessage("Subsuitable is required")
    .isMongoId()
    .withMessage("Subsuitable must be a valid Mongo ID"),
  body("vendor")
    .notEmpty()
    .withMessage("Vendor is required")
    .isMongoId()
    .withMessage("Vendor must be a valid Mongo ID"),
  body("groupcode")
    .notEmpty()
    .withMessage("Groupcode is required")
    .isMongoId()
    .withMessage("Groupcode must be a valid Mongo ID"),
  body("color")
    .notEmpty()
    .withMessage("Color is required")
    .isMongoId()
    .withMessage("Color must be a valid Mongo ID"),
];

const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
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
    } = req.body;

    // 🚀 BATCH VALIDATION - Check all references in parallel
    const validationPromises = [
      Category.exists({ _id: category }),
      Substructure.exists({ _id: substructure }),
      Content.exists({ _id: content }),
      Design.exists({ _id: design }),
      Subfinish.exists({ _id: subfinish }),
      Subsuitable.exists({ _id: subsuitable }),
      Vendor.exists({ _id: vendor }),
      Groupcode.exists({ _id: groupcode }),
      Color.exists({ _id: color }),
    ];

    const validationResults = await Promise.all(validationPromises);
    const invalidRefs = validationResults.filter((exists) => !exists);

    if (invalidRefs.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more referenced entities do not exist",
      });
    }

    // 🚀 PARALLEL IMAGE UPLOAD AND PRODUCT CREATION
    const [uploadResult] = await Promise.all([
      cloudinaryServices.cloudinaryImageUpload(
        req.file.buffer,
        name,
        "products"
      ),
      // Pre-validate product data
      Product.findOne({ name }).lean(),
    ]);

    if (uploadResult.error) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

    const img = uploadResult.secure_url;
    const product = new Product({
      name,
      img,
      category,
      substructure,
      content,
      design,
      subfinish,
      subsuitable,
      vendor,
      groupcode,
      color,
    });

    await product.save();

    // 🚀 OPTIMIZED POPULATION - Only populate essential fields
    const populated = await Product.findById(product._id)
      .populate("category", "name")
      .populate("substructure", "name")
      .populate("content", "name")
      .populate("design", "name")
      .populate("subfinish", "name")
      .populate("subsuitable", "name")
      .populate("vendor", "name")
      .populate("groupcode", "name")
      .populate("color", "name")
      .lean();

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error("Product creation error:", error.stack);
    res.status(500).json({ success: false, message: error.message, error });
  }
};

const viewAll = async (req, res) => {
  try {
    // 🚀 ULTRA-FAST PRODUCT QUERY OPTIMIZATIONS
    const limit = parseInt(req.query.limit) || 50; // Increased default limit
    const page = parseInt(req.query.page) || 1;
    const fields = req.query.fields
      ? req.query.fields.split(",").join(" ")
      : "";
    const skip = (page - 1) * limit;

    // 🚀 PARALLEL EXECUTION for faster queries
    const [products, total] = await Promise.all([
      Product.find({}, fields)
        .skip(skip)
        .limit(limit)
        .lean() // Convert to plain objects for speed
        .populate("category", "name")
        .populate("substructure", "name")
        .populate("content", "name")
        .populate("design", "name")
        .populate("subfinish", "name")
        .populate("subsuitable", "name")
        .populate("vendor", "name")
        .populate("groupcode", "name")
        .populate("color", "name")
        .exec(),
      Product.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Product viewAll error:", error);
    res.status(500).json({ success: false, message: error.message, error });
  }
};

const viewById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("substructure", "name")
      .populate("content", "name")
      .populate("design", "name")
      .populate("subfinish", "name")
      .populate("subsuitable", "name")
      .populate("vendor", "name")
      .populate("groupcode", "name")
      .populate("color", "name");
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Product viewById error:", error);
    res.status(500).json({ success: false, message: error.message, error });
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

    // 🚀 PARALLEL OPERATIONS for faster updates
    const operations = [];

    if (req.file) {
      // Get old product and upload new image in parallel
      operations.push(
        Product.findById(id).lean(),
        cloudinaryServices.cloudinaryImageUpload(
          req.file.buffer,
          req.body.name || "product",
          "products"
        )
      );
    }

    // 🚀 BATCH VALIDATION if references are being updated
    if (
      updateData.category ||
      updateData.substructure ||
      updateData.content ||
      updateData.design ||
      updateData.subfinish ||
      updateData.subsuitable ||
      updateData.vendor ||
      updateData.groupcode ||
      updateData.color
    ) {
      const validationPromises = [];
      if (updateData.category)
        validationPromises.push(Category.exists({ _id: updateData.category }));
      if (updateData.substructure)
        validationPromises.push(
          Substructure.exists({ _id: updateData.substructure })
        );
      if (updateData.content)
        validationPromises.push(Content.exists({ _id: updateData.content }));
      if (updateData.design)
        validationPromises.push(Design.exists({ _id: updateData.design }));
      if (updateData.subfinish)
        validationPromises.push(
          Subfinish.exists({ _id: updateData.subfinish })
        );
      if (updateData.subsuitable)
        validationPromises.push(
          Subsuitable.exists({ _id: updateData.subsuitable })
        );
      if (updateData.vendor)
        validationPromises.push(Vendor.exists({ _id: updateData.vendor }));
      if (updateData.groupcode)
        validationPromises.push(
          Groupcode.exists({ _id: updateData.groupcode })
        );
      if (updateData.color)
        validationPromises.push(Color.exists({ _id: updateData.color }));

      if (validationPromises.length > 0) {
        const validationResults = await Promise.all(validationPromises);
        const invalidRefs = validationResults.filter((exists) => !exists);
        if (invalidRefs.length > 0) {
          return res.status(400).json({
            success: false,
            message: "One or more referenced entities do not exist",
          });
        }
      }
    }

    let results = [];
    if (operations.length > 0) {
      results = await Promise.all(operations);
    }

    if (req.file) {
      const [oldProduct, uploadResult] = results;

      // Delete old image if exists
      if (oldProduct && oldProduct.img) {
        const publicId = oldProduct.img.split("/").pop().split(".")[0];
        cloudinaryServices.cloudinaryImageDelete(publicId).catch(console.error); // Fire and forget
      }

      updateData.img = uploadResult.secure_url;
    }

    // Sanitize updateData
    Object.keys(updateData).forEach(
      (key) =>
        (updateData[key] === "" ||
          updateData[key] === undefined ||
          updateData[key] === null) &&
        delete updateData[key]
    );

    const updated = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate([
        { path: "category", select: "name" },
        { path: "substructure", select: "name" },
        { path: "content", select: "name" },
        { path: "design", select: "name" },
        { path: "subfinish", select: "name" },
        { path: "subsuitable", select: "name" },
        { path: "vendor", select: "name" },
        { path: "groupcode", select: "name" },
        { path: "color", select: "name" },
      ])
      .lean();

    if (!updated) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    // Remove image file
    if (deleted.img) {
      const publicId = deleted.img.split("/").pop().split(".")[0];
      await cloudinaryServices.cloudinaryImageDelete(publicId);
    }
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  upload,
  create,
  viewAll,
  viewById,
  update,
  deleteById,
  validate,
};

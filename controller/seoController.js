const Seo = require("../model/Seo");
const Product = require("../model/Product");
const mongoose = require("mongoose");

// Create SEO
const createSeo = async (req, res) => {
  try {
    let { product, ...seoData } = req.body;

    // Parse openGraph.images if sent as a comma-separated string
    if (seoData.openGraph && typeof seoData.openGraph.images === "string") {
      seoData.openGraph.images = seoData.openGraph.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Parse twitter.player_width and player_height as numbers if sent as strings
    if (seoData.twitter) {
      if (typeof seoData.twitter.player_width === "string")
        seoData.twitter.player_width = Number(seoData.twitter.player_width);
      if (typeof seoData.twitter.player_height === "string")
        seoData.twitter.player_height = Number(seoData.twitter.player_height);
    }

    // Check if product exists
    if (product) {
      const productExists = await Product.findById(product);
      if (!productExists) {
        return res.status(400).json({
          success: false,
          message: "Product not found",
        });
      }
    }

    // Check if SEO already exists for this product
    if (product) {
      const existingSeo = await Seo.findOne({ product });
      if (existingSeo) {
        return res.status(400).json({
          success: false,
          message: "SEO data already exists for this product",
        });
      }
    }

    const seo = new Seo({
      product,
      ...seoData,
    });

    const savedSeo = await seo.save();
    const populatedSeo = await Seo.findById(savedSeo._id).populate("product");

    res.status(201).json({
      success: true,
      message: "SEO created successfully",
      data: populatedSeo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating SEO",
      error: error.message,
    });
  }
};

// Get all SEO - ULTRA FAST
const getAllSeo = async (req, res) => {
  try {
    // 🚀 PERFORMANCE OPTIMIZATIONS
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // 🚀 PARALLEL EXECUTION for faster queries
    const [seoList, total] = await Promise.all([
      Seo.find()
        .populate("product", "name img category") // Select only needed fields
        .skip(skip)
        .limit(limit)
        .lean() // Convert to plain objects for speed
        .exec(),
      Seo.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      message: "SEO data retrieved successfully",
      data: seoList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting SEO data",
      error: error.message,
    });
  }
};

// Get SEO by ID
const getSeoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid SEO ID",
      });
    }

    const seo = await Seo.findById(id).populate("product");

    if (!seo) {
      return res.status(404).json({
        success: false,
        message: "SEO not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SEO retrieved successfully",
      data: seo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting SEO data",
      error: error.message,
    });
  }
};

// Get SEO by Product ID
const getSeoByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const seo = await Seo.findOne({ product: productId }).populate("product");

    if (!seo) {
      return res.status(404).json({
        success: false,
        message: "SEO not found for this product",
      });
    }

    res.status(200).json({
      success: true,
      message: "SEO retrieved successfully",
      data: seo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting SEO data",
      error: error.message,
    });
  }
};

// Update SEO
const updateSeo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid SEO ID",
      });
    }

    let { product, ...updateData } = req.body;

    // Parse openGraph.images if sent as a comma-separated string
    if (
      updateData.openGraph &&
      typeof updateData.openGraph.images === "string"
    ) {
      updateData.openGraph.images = updateData.openGraph.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Parse twitter.player_width and player_height as numbers if sent as strings
    if (updateData.twitter) {
      if (typeof updateData.twitter.player_width === "string")
        updateData.twitter.player_width = Number(
          updateData.twitter.player_width
        );
      if (typeof updateData.twitter.player_height === "string")
        updateData.twitter.player_height = Number(
          updateData.twitter.player_height
        );
    }

    // Check if product exists if it's being updated
    if (product) {
      const productExists = await Product.findById(product);
      if (!productExists) {
        return res.status(400).json({
          success: false,
          message: "Product not found",
        });
      }

      // Check if SEO already exists for this product (excluding current record)
      const existingSeo = await Seo.findOne({ product, _id: { $ne: id } });
      if (existingSeo) {
        return res.status(400).json({
          success: false,
          message: "SEO data already exists for this product",
        });
      }
    }

    const updatedSeo = await Seo.findByIdAndUpdate(
      id,
      { product, ...updateData },
      { new: true, runValidators: true }
    ).populate("product");

    if (!updatedSeo) {
      return res.status(404).json({
        success: false,
        message: "SEO not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SEO updated successfully",
      data: updatedSeo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating SEO",
      error: error.message,
    });
  }
};

// Delete SEO
const deleteSeo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid SEO ID",
      });
    }

    const deletedSeo = await Seo.findByIdAndDelete(id);

    if (!deletedSeo) {
      return res.status(404).json({
        success: false,
        message: "SEO not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SEO deleted successfully",
      data: deletedSeo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting SEO",
      error: error.message,
    });
  }
};

// Get popular products
const getPopularProducts = async (req, res) => {
  try {
    const popularProducts = await Seo.find({ popularproduct: true }).populate(
      "product"
    );
    res.status(200).json({
      success: true,
      message: "Popular products retrieved successfully",
      data: popularProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting popular products",
      error: error.message,
    });
  }
};

// Get top rated products
const getTopRatedProducts = async (req, res) => {
  try {
    const topRatedProducts = await Seo.find({ topratedproduct: true }).populate(
      "product"
    );
    res.status(200).json({
      success: true,
      message: "Top rated products retrieved successfully",
      data: topRatedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting top rated products",
      error: error.message,
    });
  }
};

// Get SEO by slug
const getSeoBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const seo = await Seo.findOne({ slug }).populate("product");

    if (!seo) {
      return res.status(404).json({
        success: false,
        message: "SEO not found for this slug",
      });
    }

    res.status(200).json({
      success: true,
      message: "SEO retrieved successfully",
      data: seo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting SEO data",
      error: error.message,
    });
  }
};

module.exports = {
  createSeo,
  getAllSeo,
  getSeoById,
  getSeoByProduct,
  updateSeo,
  deleteSeo,
  getPopularProducts,
  getTopRatedProducts,
  getSeoBySlug,
};

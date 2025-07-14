const express = require("express");
const router = express.Router();
const {
  createSeo,
  getAllSeo,
  getSeoById,
  getSeoByProduct,
  updateSeo,
  deleteSeo,
  getPopularProducts,
  getTopRatedProducts,
  getSeoBySlug,
} = require("../controller/seoController");

// Create SEO
router.post("/", createSeo);

// Get all SEO
router.get("/", getAllSeo);

// Get popular products
router.get("/popular", getPopularProducts);

// Get top rated products
router.get("/top-rated", getTopRatedProducts);

// Get SEO by slug
router.get("/slug/:slug", getSeoBySlug);

// Get SEO by product ID
router.get("/product/:productId", getSeoByProduct);

// Get SEO by ID
router.get("/:id", getSeoById);

// Update SEO
router.put("/:id", updateSeo);

// Delete SEO
router.delete("/:id", deleteSeo);

module.exports = router;

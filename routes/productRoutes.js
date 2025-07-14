const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

// Create product
router.post(
  "/",
  productController.upload.single("img"),
  productController.validate,
  productController.create
);

// View all products
router.get("/", productController.viewAll);

// View product by ID
router.get("/:id", productController.viewById);

// Update product
router.put(
  "/:id",
  productController.upload.single("img"),
  productController.validate,
  productController.update
);

// Delete product
router.delete("/:id", productController.deleteById);

module.exports = router;

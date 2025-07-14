const express = require("express");
const router = express.Router();
const vendorController = require("../controller/vendorController");

router.post("/", vendorController.validate, vendorController.create);
router.get("/", vendorController.viewAll);
router.get("/:id", vendorController.viewById);
router.put("/:id", vendorController.validate, vendorController.update);
router.delete("/:id", vendorController.deleteById);

module.exports = router;

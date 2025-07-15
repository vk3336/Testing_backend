const express = require("express");
const router = express.Router();
const motifController = require("../controller/motifController");

router.post("/", motifController.validate, motifController.create);
router.get("/", motifController.viewAll);
router.get("/:id", motifController.viewById);
router.put("/:id", motifController.validate, motifController.update);
router.delete("/:id", motifController.deleteById);

module.exports = router;

const express = require("express");
const router = express.Router();
const contentController = require("../controller/contentController");

router.post("/", contentController.validate, contentController.create);
router.get("/", contentController.viewAll);
router.get("/:id", contentController.viewById);
router.put("/:id", contentController.validate, contentController.update);
router.delete("/:id", contentController.deleteById);

module.exports = router;

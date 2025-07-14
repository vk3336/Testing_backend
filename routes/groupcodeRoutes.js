const express = require("express");
const router = express.Router();
const groupcodeController = require("../controller/groupcodeController");

router.post("/", groupcodeController.validate, groupcodeController.create);
router.get("/", groupcodeController.viewAll);
router.get("/:id", groupcodeController.viewById);
router.put("/:id", groupcodeController.validate, groupcodeController.update);
router.delete("/:id", groupcodeController.deleteById);

module.exports = router;

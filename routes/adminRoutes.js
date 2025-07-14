const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");

// Route to send OTP to admin email
router.post("/sendotp", adminController.sendOTP);

// Route to verify OTP and login admin
router.post("/verifyotp", adminController.verifyOTP);

// Route to logout admin
router.post("/logout", adminController.logoutAdmin);

// Route to get admin status
router.get("/status", adminController.getAdminStatus);

// Route to get the number of allowed admins
router.get("/allowed-admins", adminController.getAllowedAdminCount);

// Get all admins and their permissions
router.get("/permissions", adminController.getAllAdminPermissions);
// Update permissions for a specific admin
router.put("/permissions", adminController.updateAdminPermissions);
// Get permissions for a specific admin by email
router.get("/permissions/:email", (req, res) => {
  req.query.email = req.params.email;
  adminController.getAdminPermissions(req, res);
});

// Get all allowed emails and their permissions (even if not in DB)
router.get(
  "/allowed-admins-permissions",
  adminController.getAllAllowedAdminsWithPermissions
);

module.exports = router;

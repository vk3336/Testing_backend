const checkSuperAdmin = (req, res, next) => {
  const superAdminEmail = process.env.Role_Management_Key_Value;
  const superAdminHeaderName =
    process.env.Role_Management_Key || "x-admin-email"; // Default if not set
  const requestEmail = req.headers[superAdminHeaderName.toLowerCase()];

  if (!superAdminEmail) {
    console.error("Role_Management_Key_Value not set in environment variables.");
    return res
      .status(500)
      .json({
        error: "Internal server error: Role_Management_Key_Value not configured.",
      });
  }

  if (
    !requestEmail ||
    requestEmail.toLowerCase() !== superAdminEmail.toLowerCase()
  ) {
    return res
      .status(403)
      .json({ error: "Forbidden: Only super admin can perform this action." });
  }
  next();
};

module.exports = checkSuperAdmin;

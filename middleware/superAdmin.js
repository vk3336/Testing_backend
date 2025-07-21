const checkSuperAdmin = (req, res, next) => {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const superAdminHeaderName =
    process.env.SUPER_ADMIN_HEADER_NAME || "x-admin-email"; // Default if not set
  const requestEmail = req.headers[superAdminHeaderName.toLowerCase()];

  if (!superAdminEmail) {
    console.error("SUPER_ADMIN_EMAIL not set in environment variables.");
    return res
      .status(500)
      .json({
        error: "Internal server error: SUPER_ADMIN_EMAIL not configured.",
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

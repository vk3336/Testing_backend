const checkSuperAdmin = (req, res, next) => {
  const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN;
  const adminEmailHeader = req.headers['x-admin-email'];

  if (!superAdminEmail) {
    console.error("NEXT_PUBLIC_SUPER_ADMIN not set in environment variables.");
    return res.status(500).json({
      error: "Internal server error: Super admin email not configured."
    });
  }

  if (!adminEmailHeader || adminEmailHeader.toLowerCase() !== superAdminEmail.toLowerCase()) {
    return res.status(403).json({ 
      success: false,
      message: "Forbidden: Only super admin can perform this action." 
    });
  }
  next();
};

module.exports = checkSuperAdmin;

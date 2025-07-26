const apiKeyMiddleware = (req, res, next) => {
  // Bypass API key check in test environment
  if (process.env.NODE_ENV === 'test' || process.env.MONGODB_URI_TEST) {
    return next();
  }
  
  // Allow role management routes to bypass API key check
  if (req.path.startsWith("/api/roles")) {
    return next();
  }
  // Allow images to be served without API key
  if (req.path.startsWith("/api/images")) {
    return next();
  }

  const apiKeyName = process.env.API_KEY_NAME || "x-api-key"; // Default to 'x-api-key' if not set
  const apiKey = req.get(apiKeyName);
  const secretKey = process.env.API_SECRET_KEY;

  if (!secretKey) {
    // If the secret key is not set in the environment, log an error and deny access.
    console.error("API_SECRET_KEY is not set in the environment variables.");
    return res
      .status(500)
      .json({ message: "Internal Server Error: API key not configured." });
  }

  if (!apiKeyName) {
    console.error("API_KEY_NAME is not set in the environment variables.");
    return res
      .status(500)
      .json({ message: "Internal Server Error: API key name not configured." });
  }

  if (!apiKey || apiKey !== secretKey) {
    return res
      .status(401)
      .json({ message: `Unauthorized: Invalid ${apiKeyName}` });
  }

  next();
};

module.exports = apiKeyMiddleware;

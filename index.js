require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const app = express();

const connectDB = require("./db");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const structureRoutes = require("./routes/structureRoutes");
const contentRoutes = require("./routes/contentRoutes");
const designRoutes = require("./routes/designRoutes");
const finishRoutes = require("./routes/finishRoutes");
const suitableforRoutes = require("./routes/suitableforRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const groupcodeRoutes = require("./routes/groupcodeRoutes");
const colorRoutes = require("./routes/colorRoutes");
const substructureRoutes = require("./routes/substructureRoutes");
const subfinishRoutes = require("./routes/subfinishRoutes");
const subsuitableRoutes = require("./routes/subsuitableRoutes");
const productRoutes = require("./routes/productRoutes");
const seoRoutes = require("./routes/seoRoutes");
const motifRoutes = require("./routes/motifRoutes");

// ✅ Railway-friendly port and host
const port = process.env.PORT || 7000;
const host = "0.0.0.0";

connectDB();

// const baseUrl = process.env.BASE_URL || `http://${host}:${port}`;

// Middleware
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-admin-email"],
    maxAge: 86400,
  })
);

app.use(
  bodyParser.json({
    limit: "10mb",
    strict: true,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10mb",
    parameterLimit: 1000,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    try {
      res.setHeader("X-Response-Time", `${duration}ms`);
    } catch (_) {}
  });
  next();
});

// Warn about missing env vars
const requiredEnv = [
  "MONGODB_URI_TEST",
  "EMAIL_USER",
  "EMAIL_PASS",
  "ALLOW_EMAIL",
];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Warning: Required environment variable ${key} is missing!`);
  }
});

// Cache headers
app.use((req, res, next) => {
  if (req.path.includes("/images/") || req.path.includes("/static/")) {
    res.setHeader("Cache-Control", "public, max-age=3600");
  } else if (req.method === "GET") {
    res.setHeader("Cache-Control", "public, max-age=300");
  }
  next();
});

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/structure", structureRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/design", designRoutes);
app.use("/api/finish", finishRoutes);
app.use("/api/suitablefor", suitableforRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/groupcode", groupcodeRoutes);
app.use("/api/color", colorRoutes);
app.use("/api/substructure", substructureRoutes);
app.use("/api/subfinish", subfinishRoutes);
app.use("/api/subsuitable", subsuitableRoutes);
app.use("/api/product", productRoutes);
app.use("/api/seo", seoRoutes);
app.use("/api/motif", motifRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the vivek API world");
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ✅ Make sure the server binds to 0.0.0.0
if (require.main === module) {
  app.listen(port, host, () => {
    console.log(`Server is running on port ${port}`);
    // console.log(`Base URL: ${baseUrl}`);
    console.log(`MongoDB URI: ${process.env.MONGODB_URI_TEST}`);
  });
}

module.exports = app;

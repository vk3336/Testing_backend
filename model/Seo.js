const mongoose = require("mongoose");

const seoSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: false,
    },
    salesPrice: {
      type: Number,
      required: false,
    },
    locationCode: {
      type: String,
      required: false,
      trim: true,
    },
    productIdentifier: {
      type: String,
      required: false,
      trim: true,
    },
    sku: {
      type: String,
      required: false,
      trim: true,
    },
    productdescription: {
      type: String,
      required: false,
      trim: true,
    },
    popularproduct: {
      type: Boolean,
      default: false,
    },
    topratedproduct: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: false,
      trim: true,
      unique: true,
      sparse: true,
    },
    canonical_url: {
      type: String,
      required: false,
      trim: true,
    },
    ogUrl: {
      type: String,
      required: false,
      trim: true,
    },
    excerpt: {
      type: String,
      required: false,
      trim: true,
    },
    description_html: {
      type: String,
      required: false,
    },
    rating_value: {
      type: Number,
      required: false,
      min: 0,
      max: 5,
    },
    rating_count: {
      type: Number,
      required: false,
      min: 0,
    },
    charset: {
      type: String,
      required: false,
      trim: true,
    },
    xUaCompatible: {
      type: String,
      required: false,
      trim: true,
    },
    viewport: {
      type: String,
      required: false,
      trim: true,
    },
    title: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    keywords: {
      type: String,
      required: false,
      trim: true,
    },
    robots: {
      type: String,
      required: false,
      trim: true,
    },
    contentLanguage: {
      type: String,
      required: false,
      trim: true,
    },
    googleSiteVerification: {
      type: String,
      required: false,
      trim: true,
    },
    msValidate: {
      type: String,
      required: false,
      trim: true,
    },
    themeColor: {
      type: String,
      required: false,
      trim: true,
    },
    mobileWebAppCapable: {
      type: String,
      required: false,
      trim: true,
    },
    appleStatusBarStyle: {
      type: String,
      required: false,
      trim: true,
    },
    formatDetection: {
      type: String,
      required: false,
      trim: true,
    },
    ogLocale: {
      type: String,
      required: false,
      trim: true,
    },
    ogTitle: {
      type: String,
      required: false,
      trim: true,
    },
    ogDescription: {
      type: String,
      required: false,
      trim: true,
    },
    ogType: {
      type: String,
      required: false,
      trim: true,
    },
    ogSiteName: {
      type: String,
      required: false,
      trim: true,
    },
    twitterCard: {
      type: String,
      required: false,
      trim: true,
    },
    twitterSite: {
      type: String,
      required: false,
      trim: true,
    },
    twitterTitle: {
      type: String,
      required: false,
      trim: true,
    },
    twitterDescription: {
      type: String,
      required: false,
      trim: true,
    },
    hreflang: {
      type: String,
      required: false,
      trim: true,
    },
    x_default: {
      type: String,
      required: false,
      trim: true,
    },
    author_name: {
      type: String,
      required: false,
      trim: true,
    },
    // --- New Meta Tag Fields ---
    openGraph: {
      images: [{ type: String, trim: true }],
      video: {
        url: { type: String, trim: true },
        secure_url: { type: String, trim: true },
        type: { type: String, trim: true },
        width: { type: Number },
        height: { type: Number },
      },
    },
    twitter: {
      image: { type: String, trim: true },
      player: { type: String, trim: true },
      player_width: { type: Number },
      player_height: { type: Number },
    },
    VideoJsonLd: { type: String, trim: true },
    LogoJsonLd: { type: String, trim: true },
    BreadcrumbJsonLd: { type: String, trim: true },
    LocalBusinessJsonLd: { type: String, trim: true },
  },
  { timestamps: true }
);

// 🚀 ULTRA-FAST INDEXING for maximum performance
seoSchema.index({ product: 1 });
seoSchema.index({ popularproduct: 1 });
seoSchema.index({ topratedproduct: 1 });
// slug index is automatically created by unique: true
seoSchema.index({ "product.name": 1 });
seoSchema.index({ createdAt: -1 });
seoSchema.index({ rating_value: -1 });
seoSchema.index({ purchasePrice: 1 });
seoSchema.index({ salesPrice: 1 });
seoSchema.index({ sku: 1 });
seoSchema.index({ productIdentifier: 1 });

module.exports = mongoose.model("Seo", seoSchema);

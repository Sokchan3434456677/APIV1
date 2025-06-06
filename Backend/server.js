const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://sokchanear0:QMpedaM6g13YtQSp@cluster0.btlqm.mongodb.net/api?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: null }, // Added discountPrice field
  images: { type: [String], default: [] },
  category: {
    type: String,
    required: true,
    enum: ["NEW ARRIVALS", "HOODIES", "TEES", "OUTFITS"],
  },
  stock: { type: Number, required: true, default: 0 },
  size: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

// Define Banner Schema
const bannerSchema = new mongoose.Schema({
  slot: {
    type: String,
    required: true,
    enum: ["1", "2", "3", "4", "5", "6"],
    unique: true,
  },
  imageUrl: { type: String, required: true },
});

const Banner = mongoose.model("Banner", bannerSchema);

// Middleware
app.use(cors());
app.use(express.json());

// POST: Add a product
app.post("/api/products/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const productData = { ...req.body, category };
    const product = new Product({
      ...productData,
      price: Number(productData.price),
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : null, // Handle discountPrice
      stock: Number(productData.stock) || 0,
      size: productData.size,
      images: productData.images.filter((url) => url.trim() !== ""),
    });
    await product.save();
    res.status(201).json({ message: `Product added to ${category}!`, product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: Fetch products by category
app.get("/api/products/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Fetch a product by ID
app.get("/api/products/id/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update a product
app.put("/api/products/:category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.price) updates.price = Number(updates.price);
    if (updates.discountPrice !== undefined) 
      updates.discountPrice = updates.discountPrice ? Number(updates.discountPrice) : null; // Handle discountPrice
    if (updates.stock) updates.stock = Number(updates.stock);
    if (updates.images) updates.images = updates.images.filter((url) => url.trim() !== "");

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Delete a product
app.delete("/api/products/:category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Handle product purchase (decrease stock)
app.post("/api/products/purchase/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const quantity = Number(req.body.quantity) || 1;
    if (quantity <= 0) {
      return res.status(400).json({ message: "Invalid purchase quantity" });
    }
    const product = await Product.findOneAndUpdate(
      { _id: id, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      { new: true }
    );
    if (!product) {
      return res.status(400).json({ message: "Product not found or insufficient stock" });
    }
    res.status(200).json({
      message: "Purchase successful",
      product: product.toObject(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST: Add or update a banner for a slot
app.post("/api/post/banners", async (req, res) => {
  try {
    const { slot, imageUrl } = req.body;
    if (!slot || !imageUrl) {
      return res.status(400).json({ message: "slot and imageUrl are required" });
    }
    // Upsert: update if slot exists, otherwise create
    const banner = await Banner.findOneAndUpdate(
      { slot },
      { slot, imageUrl },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ message: "Banner added/updated successfully!", banner });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET: Fetch all banners
app.get("/api/get/banners", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ slot: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Delete a banner by slot
app.delete("/api/delete/banner/:slot", async (req, res) => {
  try {
    const { slot } = req.params;
    const deletedBanner = await Banner.findOneAndDelete({ slot });
    if (!deletedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const app = express();
// const PORT = 5000;

// // Connect to MongoDB
// mongoose.connect(
//   "mongodb+srv://sokchanear0:QMpedaM6g13YtQSp@cluster0.btlqm.mongodb.net/api?retryWrites=true&w=majority",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     tls: true,
//   }
// );

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => console.log("Connected to MongoDB"));

// // Define Product Schema
// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: String,
//   price: { type: Number, required: true },
//   discountPrice: { type: Number, default: null }, // Added discountPrice field
//   images: { type: [String], default: [] },
//   category: {
//     type: String,
//     required: true,
//     enum: ["NEW ARRIVALS", "HOODIES", "TEES", "OUTFITS"],
//   },
//   stock: { type: Number, required: true, default: 0 },
//   size: { type: String, required: true },
// });

// const Product = mongoose.model("Product", productSchema);

// // Define Banner Schema
// const bannerSchema = new mongoose.Schema({
//   slot: {
//     type: String,
//     required: true,
//     enum: ["1", "2", "3", "4", "5", "6"],
//     unique: true,
//   },
//   imageUrl: { type: String, required: true },
// });

// const Banner = mongoose.model("Banner", bannerSchema);

// // Middleware
// app.use(cors());
// app.use(express.json());

// // POST: Add a product
// app.post("/api/products/:category", async (req, res) => {
//   try {
//     const { category } = req.params;
//     const productData = { ...req.body, category };
//     const product = new Product({
//       ...productData,
//       price: Number(productData.price),
//       discountPrice: productData.discountPrice ? Number(productData.discountPrice) : null, // Handle discountPrice
//       stock: Number(productData.stock) || 0,
//       size: productData.size,
//       images: productData.images.filter((url) => url.trim() !== ""),
//     });
//     await product.save();
//     res.status(201).json({ message: `Product added to ${category}!`, product });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // GET: Fetch products by category
// app.get("/api/products/:category", async (req, res) => {
//   try {
//     const { category } = req.params;
//     const products = await Product.find({ category });
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // GET: Fetch a product by ID
// app.get("/api/products/id/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid product ID" });
//     }

//     const product = await Product.findById(id);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // PUT: Update a product
// app.put("/api/products/:category/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     if (updates.price) updates.price = Number(updates.price);
//     if (updates.discountPrice !== undefined) 
//       updates.discountPrice = updates.discountPrice ? Number(updates.discountPrice) : null; // Handle discountPrice
//     if (updates.stock) updates.stock = Number(updates.stock);
//     if (updates.images) updates.images = updates.images.filter((url) => url.trim() !== "");

//     const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
//     if (!updatedProduct) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     res.json({ message: "Product updated", product: updatedProduct });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // DELETE: Delete a product
// app.delete("/api/products/:category/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedProduct = await Product.findByIdAndDelete(id);
//     if (!deletedProduct) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     res.json({ message: "Product deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // POST: Handle product purchase (decrease stock)
// app.post("/api/products/purchase/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const quantity = Number(req.body.quantity) || 1;
//     if (quantity <= 0) {
//       return res.status(400).json({ message: "Invalid purchase quantity" });
//     }
//     const product = await Product.findOneAndUpdate(
//       { _id: id, stock: { $gte: quantity } },
//       { $inc: { stock: -quantity } },
//       { new: true }
//     );
//     if (!product) {
//       return res.status(400).json({ message: "Product not found or insufficient stock" });
//     }
//     res.status(200).json({
//       message: "Purchase successful",
//       product: product.toObject(),
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // POST: Add or update a banner for a slot
// app.post("/api/post/banners", async (req, res) => {
//   try {
//     const { slot, imageUrl } = req.body;
//     if (!slot || !imageUrl) {
//       return res.status(400).json({ message: "slot and imageUrl are required" });
//     }
//     // Upsert: update if slot exists, otherwise create
//     const banner = await Banner.findOneAndUpdate(
//       { slot },
//       { slot, imageUrl },
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );
//     res.status(201).json({ message: "Banner added/updated successfully!", banner });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // GET: Fetch all banners
// app.get("/api/get/banners", async (req, res) => {
//   try {
//     const banners = await Banner.find().sort({ slot: 1 });
//     res.json(banners);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // DELETE: Delete a banner by slot
// app.delete("/api/delete/banner/:slot", async (req, res) => {
//   try {
//     const { slot } = req.params;
//     const deletedBanner = await Banner.findOneAndDelete({ slot });
//     if (!deletedBanner) {
//       return res.status(404).json({ message: "Banner not found" });
//     }
//     res.json({ message: "Banner deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });








const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer"); // Import multer
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3"); // Import S3Client and commands

const app = express();
const PORT = 5000;

// Cloudflare R2 Configuration
const R2_ACCOUNT_ID = "ab2fe522afdb5fdb0438fa8401c0f784"; // This is the ID from your R2 endpoint URL
const R2_ACCESS_KEY_ID = "1e7886dc57ee7eff8ae1c70d3b3988f3";
const R2_SECRET_ACCESS_KEY = "f8b33a61c4f8afc5c90cb4ac893393f8b5edd6f9532edcaeae6ba5fff502a07f";
const R2_BUCKET_NAME = "targetstore";
const R2_ENDPOINT = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_PUBLIC_DOMAIN = "https://pub-05f54b3c58904dfabbe0f8db547ac71d.r2.dev"; // <-- Add this line

const s3Client = new S3Client({
  region: "auto", // Cloudflare R2 typically uses "auto" or can be omitted if the endpoint is fully specified
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Configure Multer for file uploads (in-memory storage for direct upload to R2)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// // Connect to MongoDB
// mongoose.connect(
//   "mongodb+srv://sokchanear0:s0fazZgdGvLxxGEW@cluster0.gf1nfv0.mongodb.net/cloudflare-images?retryWrites=true&w=majority&appName=Cluster0",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     tls: true,
//   }
// );


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

// Define Product Schema (unchanged)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: null },
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
  imageUrl: { type: String, required: true }, // This will store the R2 URL
});

const Banner = mongoose.model("Banner", bannerSchema);

// Middleware
app.use(cors());
app.use(express.json());

// --- Existing Product Routes (unchanged) ---

// POST: Add a product
app.post("/api/products/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const productData = { ...req.body, category };
    const product = new Product({
      ...productData,
      price: Number(productData.price),
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : null,
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
      updates.discountPrice = updates.discountPrice ? Number(updates.discountPrice) : null;
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


// --- Banner Routes (Modified for R2 Upload) ---

// POST: Add or update a banner for a slot with image upload
app.post("/api/post/banners", upload.single("image"), async (req, res) => {
  try {
    const { slot } = req.body;
    const imageFile = req.file; // The uploaded image file

    if (!slot || !imageFile) {
      return res.status(400).json({ message: "Slot and image file are required" });
    }

    // Generate a unique filename for the image (e.g., using current timestamp and original name)
    const fileName = `${Date.now()}-${imageFile.originalname}`;
    const key = `banners/${fileName}`; // Folder structure in R2

    // Upload image to Cloudflare R2
    const uploadParams = {
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: imageFile.buffer, // Multer stores the file in buffer
      ContentType: imageFile.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Construct the public URL for the R2 object using the public domain
    const imageUrl = `${R2_PUBLIC_DOMAIN}/${key}`;


    // Upsert: update if slot exists, otherwise create
    const banner = await Banner.findOneAndUpdate(
      { slot },
      { slot, imageUrl },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: "Banner added/updated successfully!", banner });
  } catch (error) {
    console.error("Error uploading to R2 or saving banner:", error);
    res.status(500).json({ message: "Failed to upload image or save banner.", error: error.message });
  }
});

// GET: Fetch all banners (convert imageUrl to public domain if needed)
app.get("/api/get/banners", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ slot: 1 });
    // Map imageUrl to public domain if not already
    const mappedBanners = banners.map(banner => {
      let imageUrl = banner.imageUrl;
      // If imageUrl is not using the public domain, convert it
      if (imageUrl && imageUrl.includes(R2_BUCKET_NAME + "/banners/")) {
        const key = imageUrl.split(R2_BUCKET_NAME + "/")[1];
        if (key && !imageUrl.startsWith(R2_PUBLIC_DOMAIN)) {
          imageUrl = `${R2_PUBLIC_DOMAIN}/banners/${key.split('/').slice(1).join('/')}`;
        }
      }
      return {
        ...banner.toObject(),
        imageUrl,
      };
    });
    res.json(mappedBanners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Delete a banner by slot (and delete image from R2)
app.delete("/api/delete/banner/:slot", async (req, res) => {
  try {
    const { slot } = req.params;
    const bannerToDelete = await Banner.findOne({ slot });

    if (!bannerToDelete) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Extract the R2 Key from the imageUrl
    // Assuming imageUrl format: https://<ACCOUNT_ID>.r2.cloudflarestorage.com/<BUCKET_NAME>/<KEY>
    const urlParts = bannerToDelete.imageUrl.split('/');
    const key = urlParts.slice(urlParts.indexOf(R2_BUCKET_NAME) + 1).join('/');

    if (key) {
      const deleteParams = {
        Bucket: R2_BUCKET_NAME,
        Key: key,
      };
      await s3Client.send(new DeleteObjectCommand(deleteParams));
      console.log(`Image ${key} deleted from R2.`);
    }

    const deletedBanner = await Banner.findOneAndDelete({ slot });
    if (!deletedBanner) { // Should not happen if bannerToDelete was found
      return res.status(404).json({ message: "Banner not found after R2 deletion attempt" });
    }
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner or R2 image:", error);
    res.status(500).json({ message: "Failed to delete banner or image.", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "../models/product.model.js";
import connectDB from "../utils/connection.js";

dotenv.config({ path: "./.env" });

// Image URL mappings for products that need fixing
const imageUpdates = {
  "Formal Black Blazer": "https://images.unsplash.com/photo-1594938291221-94f313b0e0c6?auto=format&fit=crop&w=800&q=80",
  "Formal Blazer - Black": "https://images.unsplash.com/photo-1594938291221-94f313b0e0c6?auto=format&fit=crop&w=800&q=80",
  "Athletic Leggings": "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=800&q=80",
  "Kids Leggings": "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=800&q=80"
};

const updateProductImages = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    let updatedCount = 0;

    for (const [productName, newImageUrl] of Object.entries(imageUpdates)) {
      const product = await Product.findOne({ name: productName });
      
      if (product && product.images && product.images.length > 0) {
        // Update the first image URL
        product.images[0].url = newImageUrl;
        await product.save();
        console.log(`✅ Updated image for: ${productName}`);
        updatedCount++;
      } else {
        console.log(`⚠️  Product not found: ${productName}`);
      }
    }

    // Also update all products with old URL format
    const productsWithOldUrls = await Product.find({
      "images.url": { $regex: "\\?w=500" }
    });

    for (const product of productsWithOldUrls) {
      if (product.images && product.images.length > 0) {
        product.images = product.images.map(img => ({
          ...img,
          url: img.url.replace("?w=500", "?auto=format&fit=crop&w=800&q=80")
        }));
        await product.save();
        updatedCount++;
        console.log(`✅ Updated image URL format for: ${product.name}`);
      }
    }

    console.log(`\n✅ Successfully updated ${updatedCount} product(s)!`);

    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error updating product images:", error);
    process.exit(1);
  }
};

updateProductImages();


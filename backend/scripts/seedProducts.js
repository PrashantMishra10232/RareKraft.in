import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import connectDB from "../utils/connection.js";

dotenv.config({ path: "./.env" });

// Mock product data
const mockProducts = [
  // Men's Products
  {
    name: "Classic White Cotton T-Shirt",
    description: "Premium quality cotton t-shirt with a comfortable fit. Perfect for casual wear and everyday use. Made from 100% organic cotton.",
    price: 899,
    category: "Men",
    sizes: [
      { size: "S", quantity: 25 },
      { size: "M", quantity: 30 },
      { size: "L", quantity: 28 },
      { size: "XL", quantity: 20 },
      { size: "XXL", quantity: 15 }
    ],
    images: [
      {
        public_id: "mock_men_tshirt_1",
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Slim Fit Denim Jeans",
    description: "Classic blue denim jeans with a modern slim fit. Comfortable stretch fabric with a perfect fade. Ideal for both casual and semi-formal occasions.",
    price: 2499,
    category: "Men",
    sizes: [
      { size: "S", quantity: 15 },
      { size: "M", quantity: 20 },
      { size: "L", quantity: 18 },
      { size: "XL", quantity: 12 },
      { size: "XXL", quantity: 10 }
    ],
    images: [
      {
        public_id: "mock_men_jeans_1",
        url: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Formal Black Blazer",
    description: "Elegant black blazer perfect for business meetings and formal events. Tailored fit with premium fabric. A must-have in every gentleman's wardrobe.",
    price: 4999,
    category: "Men",
    sizes: [
      { size: "M", quantity: 12 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 10 },
      { size: "XXL", quantity: 8 }
    ],
    images: [
      {
        public_id: "mock_men_blazer_1",
        url: "https://images.unsplash.com/photo-1594938291221-94f313b0e0c6?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Casual Hooded Sweatshirt",
    description: "Warm and cozy hooded sweatshirt perfect for chilly days. Soft fabric with adjustable drawstring hood. Great for lounging or outdoor activities.",
    price: 1899,
    category: "Men",
    sizes: [
      { size: "S", quantity: 20 },
      { size: "M", quantity: 25 },
      { size: "L", quantity: 22 },
      { size: "XL", quantity: 18 },
      { size: "XXL", quantity: 15 }
    ],
    images: [
      {
        public_id: "mock_men_hoodie_1",
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Athletic Shorts",
    description: "Lightweight and breathable athletic shorts. Perfect for workouts, running, or casual wear. Moisture-wicking fabric keeps you cool and dry.",
    price: 1299,
    category: "Men",
    sizes: [
      { size: "S", quantity: 18 },
      { size: "M", quantity: 22 },
      { size: "L", quantity: 20 },
      { size: "XL", quantity: 16 },
      { size: "XXL", quantity: 12 }
    ],
    images: [
      {
        public_id: "mock_men_shorts_1",
        url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Polo Shirt - Navy Blue",
    description: "Classic polo shirt in navy blue. Versatile design suitable for both casual and smart casual occasions. Made from premium pique cotton.",
    price: 1499,
    category: "Men",
    sizes: [
      { size: "S", quantity: 22 },
      { size: "M", quantity: 28 },
      { size: "L", quantity: 25 },
      { size: "XL", quantity: 20 },
      { size: "XXL", quantity: 15 }
    ],
    images: [
      {
        public_id: "mock_men_polo_1",
        url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Cargo Pants - Khaki",
    description: "Functional cargo pants with multiple pockets. Durable fabric perfect for outdoor activities or casual wear. Comfortable fit with adjustable waist.",
    price: 2199,
    category: "Men",
    sizes: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 18 },
      { size: "XL", quantity: 12 },
      { size: "XXL", quantity: 8 }
    ],
    images: [
      {
        public_id: "mock_men_cargo_1",
        url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Leather Jacket",
    description: "Stylish genuine leather jacket with a classic biker design. Premium quality leather that gets better with age. Perfect for making a statement.",
    price: 8999,
    category: "Men",
    sizes: [
      { size: "M", quantity: 8 },
      { size: "L", quantity: 10 },
      { size: "XL", quantity: 8 },
      { size: "XXL", quantity: 5 }
    ],
    images: [
      {
        public_id: "mock_men_jacket_1",
        url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },

  // Women's Products
  {
    name: "Floral Summer Dress",
    description: "Beautiful floral print summer dress with a flowy silhouette. Perfect for parties, dates, or casual outings. Lightweight and breathable fabric.",
    price: 2499,
    category: "Women",
    sizes: [
      { size: "S", quantity: 20 },
      { size: "M", quantity: 25 },
      { size: "L", quantity: 22 },
      { size: "XL", quantity: 18 },
      { size: "XXL", quantity: 15 }
    ],
    images: [
      {
        public_id: "mock_women_dress_1",
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "High-Waisted Skinny Jeans",
    description: "Trendy high-waisted skinny jeans with stretch fabric. Flattering fit that accentuates your curves. Perfect for casual or dressed-up looks.",
    price: 2199,
    category: "Women",
    sizes: [
      { size: "S", quantity: 18 },
      { size: "M", quantity: 22 },
      { size: "L", quantity: 20 },
      { size: "XL", quantity: 16 },
      { size: "XXL", quantity: 12 }
    ],
    images: [
      {
        public_id: "mock_women_jeans_1",
        url: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Elegant Blouse - White",
    description: "Sophisticated white blouse with delicate details. Perfect for office wear or formal occasions. Made from premium quality fabric with a comfortable fit.",
    price: 1899,
    category: "Women",
    sizes: [
      { size: "S", quantity: 20 },
      { size: "M", quantity: 25 },
      { size: "L", quantity: 23 },
      { size: "XL", quantity: 18 },
      { size: "XXL", quantity: 15 }
    ],
    images: [
      {
        public_id: "mock_women_blouse_1",
        url: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Casual T-Shirt - Pink",
    description: "Soft and comfortable pink t-shirt. Perfect for everyday wear. Made from 100% cotton with a relaxed fit. Great for layering or wearing alone.",
    price: 799,
    category: "Women",
    sizes: [
      { size: "S", quantity: 25 },
      { size: "M", quantity: 30 },
      { size: "L", quantity: 28 },
      { size: "XL", quantity: 22 },
      { size: "XXL", quantity: 18 }
    ],
    images: [
      {
        public_id: "mock_women_tshirt_1",
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Maxi Skirt - Floral Print",
    description: "Elegant maxi skirt with beautiful floral pattern. Flowy and comfortable, perfect for summer days. Can be dressed up or down for any occasion.",
    price: 1799,
    category: "Women",
    sizes: [
      { size: "S", quantity: 15 },
      { size: "M", quantity: 20 },
      { size: "L", quantity: 18 },
      { size: "XL", quantity: 15 },
      { size: "XXL", quantity: 12 }
    ],
    images: [
      {
        public_id: "mock_women_skirt_1",
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Denim Jacket",
    description: "Classic denim jacket that never goes out of style. Versatile piece perfect for layering. Durable construction with a comfortable fit.",
    price: 2999,
    category: "Women",
    sizes: [
      { size: "S", quantity: 12 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 18 },
      { size: "XL", quantity: 14 },
      { size: "XXL", quantity: 10 }
    ],
    images: [
      {
        public_id: "mock_women_jacket_1",
        url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Athletic Leggings",
    description: "High-performance athletic leggings with moisture-wicking fabric. Perfect for workouts, yoga, or casual wear. Comfortable and supportive fit.",
    price: 1499,
    category: "Women",
    sizes: [
      { size: "S", quantity: 20 },
      { size: "M", quantity: 25 },
      { size: "L", quantity: 22 },
      { size: "XL", quantity: 18 },
      { size: "XXL", quantity: 15 }
    ],
    images: [
      {
        public_id: "mock_women_leggings_1",
        url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Knit Sweater - Beige",
    description: "Cozy knit sweater in a beautiful beige color. Perfect for autumn and winter. Soft and warm, ideal for layering or wearing alone.",
    price: 2299,
    category: "Women",
    sizes: [
      { size: "S", quantity: 18 },
      { size: "M", quantity: 22 },
      { size: "L", quantity: 20 },
      { size: "XL", quantity: 16 },
      { size: "XXL", quantity: 12 }
    ],
    images: [
      {
        public_id: "mock_women_sweater_1",
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Formal Blazer - Black",
    description: "Professional black blazer for the modern woman. Tailored fit with premium fabric. Perfect for business meetings and formal events.",
    price: 4499,
    category: "Women",
    sizes: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 12 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 12 },
      { size: "XXL", quantity: 8 }
    ],
    images: [
      {
        public_id: "mock_women_blazer_1",
        url: "https://images.unsplash.com/photo-1594938291221-94f313b0e0c6?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Casual Shorts - Denim",
    description: "Comfortable denim shorts perfect for summer. Classic style with a modern fit. Great for beach days or casual outings.",
    price: 1299,
    category: "Women",
    sizes: [
      { size: "S", quantity: 20 },
      { size: "M", quantity: 25 },
      { size: "L", quantity: 22 },
      { size: "XL", quantity: 18 },
      { size: "XXL", quantity: 15 }
    ],
    images: [
      {
        public_id: "mock_women_shorts_1",
        url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },

  // Kids' Products
  {
    name: "Kids Cartoon T-Shirt",
    description: "Fun and colorful cartoon print t-shirt for kids. Made from soft, child-friendly fabric. Perfect for playtime and casual wear.",
    price: 599,
    category: "Kids",
    sizes: [
      { size: "S", quantity: 30 },
      { size: "M", quantity: 35 },
      { size: "L", quantity: 32 },
      { size: "XL", quantity: 28 },
      { size: "XXL", quantity: 25 }
    ],
    images: [
      {
        public_id: "mock_kids_tshirt_1",
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Kids Denim Jeans",
    description: "Durable denim jeans designed for active kids. Reinforced knees for extra durability. Comfortable fit that allows for free movement.",
    price: 1299,
    category: "Kids",
    sizes: [
      { size: "S", quantity: 25 },
      { size: "M", quantity: 30 },
      { size: "L", quantity: 28 },
      { size: "XL", quantity: 24 },
      { size: "XXL", quantity: 20 }
    ],
    images: [
      {
        public_id: "mock_kids_jeans_1",
        url: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Kids Hooded Sweatshirt",
    description: "Warm and cozy hooded sweatshirt for kids. Soft fabric with fun designs. Perfect for cool weather and outdoor activities.",
    price: 999,
    category: "Kids",
    sizes: [
      { size: "S", quantity: 28 },
      { size: "M", quantity: 32 },
      { size: "L", quantity: 30 },
      { size: "XL", quantity: 26 },
      { size: "XXL", quantity: 22 }
    ],
    images: [
      {
        public_id: "mock_kids_hoodie_1",
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Kids Summer Dress",
    description: "Adorable summer dress for little girls. Bright colors and fun patterns. Lightweight fabric perfect for hot summer days.",
    price: 1199,
    category: "Kids",
    sizes: [
      { size: "S", quantity: 22 },
      { size: "M", quantity: 28 },
      { size: "L", quantity: 25 },
      { size: "XL", quantity: 20 },
      { size: "XXL", quantity: 18 }
    ],
    images: [
      {
        public_id: "mock_kids_dress_1",
        url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Kids Athletic Shorts",
    description: "Comfortable athletic shorts for active kids. Perfect for sports, playtime, or casual wear. Durable fabric that can handle rough play.",
    price: 699,
    category: "Kids",
    sizes: [
      { size: "S", quantity: 30 },
      { size: "M", quantity: 35 },
      { size: "L", quantity: 32 },
      { size: "XL", quantity: 28 },
      { size: "XXL", quantity: 25 }
    ],
    images: [
      {
        public_id: "mock_kids_shorts_1",
        url: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Kids Polo Shirt",
    description: "Classic polo shirt for kids. Smart casual style perfect for school or special occasions. Made from soft, comfortable fabric.",
    price: 899,
    category: "Kids",
    sizes: [
      { size: "S", quantity: 28 },
      { size: "M", quantity: 32 },
      { size: "L", quantity: 30 },
      { size: "XL", quantity: 26 },
      { size: "XXL", quantity: 22 }
    ],
    images: [
      {
        public_id: "mock_kids_polo_1",
        url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Kids Winter Jacket",
    description: "Warm and cozy winter jacket for kids. Water-resistant outer layer with soft inner lining. Perfect for cold weather protection.",
    price: 1999,
    category: "Kids",
    sizes: [
      { size: "S", quantity: 20 },
      { size: "M", quantity: 25 },
      { size: "L", quantity: 22 },
      { size: "XL", quantity: 18 },
      { size: "XXL", quantity: 15 }
    ],
    images: [
      {
        public_id: "mock_kids_jacket_1",
        url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    name: "Kids Leggings",
    description: "Comfortable leggings for active kids. Stretchy fabric that allows for free movement. Perfect for playtime, sports, or casual wear.",
    price: 799,
    category: "Kids",
    sizes: [
      { size: "S", quantity: 30 },
      { size: "M", quantity: 35 },
      { size: "L", quantity: 32 },
      { size: "XL", quantity: 28 },
      { size: "XXL", quantity: 25 }
    ],
    images: [
      {
        public_id: "mock_kids_leggings_1",
        url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
];

const seedProducts = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to MongoDB");

    // Find or create a seller user
    let seller = await User.findOne({ role: "Seller" });
    
    if (!seller) {
      console.log("No seller found. Creating a default seller...");
      // Create a default seller (you may need to adjust this based on your user model)
      seller = await User.create({
        name: "RareKraft Admin",
        email: "admin@rarekraft.in",
        password: "Admin@123", // You should change this
        role: "Seller"
      });
      console.log("Default seller created:", seller._id);
    }

    // Clear existing products (optional - comment out if you want to keep existing products)
    // await Product.deleteMany({});
    // console.log("Cleared existing products");

    // Check for existing products with same names to avoid duplicates
    const existingProductNames = await Product.find({}, { name: 1 }).lean();
    const existingNames = new Set(existingProductNames.map(p => p.name));
    
    // Filter out products that already exist
    const newProducts = mockProducts.filter(p => !existingNames.has(p.name));
    
    if (newProducts.length === 0) {
      console.log("⚠️  All products already exist in database. Skipping insertion.");
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log(`📦 Found ${newProducts.length} new products to insert (${mockProducts.length - newProducts.length} already exist)`);

    // Insert mock products
    const productsToInsert = newProducts.map(product => ({
      ...product,
      seller: seller._id
    }));

    const insertedProducts = await Product.insertMany(productsToInsert, { ordered: false });
    console.log(`✅ Successfully seeded ${insertedProducts.length} products!`);
    console.log(`   - Men's products: ${newProducts.filter(p => p.category === "Men").length}`);
    console.log(`   - Women's products: ${newProducts.filter(p => p.category === "Women").length}`);
    console.log(`   - Kids' products: ${newProducts.filter(p => p.category === "Kids").length}`);
    
    const totalProducts = await Product.countDocuments();
    console.log(`\n📊 Total products in database: ${totalProducts}`);

    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

// Run the seed function
seedProducts();


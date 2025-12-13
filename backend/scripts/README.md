# Seed Scripts

This directory contains scripts to populate the database with mock data.

## Seed Products

The `seedProducts.js` script adds 25+ mock products across different categories (Men, Women, Kids) to your database.

### How to Run

1. Make sure your `.env` file is configured with:
   - `MONGODB_URI` - Your MongoDB connection string

2. Ensure you have at least one user with `role: "Seller"` in your database. If not, the script will create a default seller.

3. Run the seed script:
   ```bash
   npm run seed:products
   ```

   Or directly:
   ```bash
   node scripts/seedProducts.js
   ```

### What Gets Added

- **Men's Products**: 8 items (T-shirts, jeans, blazers, hoodies, etc.)
- **Women's Products**: 10 items (Dresses, jeans, blouses, leggings, etc.)
- **Kids' Products**: 8 items (T-shirts, jeans, dresses, jackets, etc.)

Each product includes:
- Name and description
- Price (ranging from ₹599 to ₹8999)
- Category (Men/Women/Kids)
- Multiple sizes (S, M, L, XL, XXL) with stock quantities
- Placeholder images from Unsplash

### Notes

- The script uses placeholder images from Unsplash. In production, you should replace these with actual product images.
- Products are assigned to an existing seller or a default seller is created.
- The script will NOT delete existing products by default. Uncomment the delete line if you want to clear existing products first.
- Make sure your database connection is working before running the script.

### Troubleshooting

- **Error: No seller found**: The script will create a default seller automatically.
- **Error: MongoDB connection failed**: Check your `MONGODB_URI` in the `.env` file.
- **Error: Duplicate products**: The script doesn't check for duplicates. Run it only once or clear products first.


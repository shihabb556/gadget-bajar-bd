const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
}

const ProductSchema = new mongoose.Schema({
    name: String,
    colors: [String],
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function check() {
    await mongoose.connect(MONGODB_URI);
    const products = await Product.find({ colors: { $exists: true, $ne: [] } }, { name: 1, colors: 1 });
    console.log('Products with colors:', JSON.stringify(products, null, 2));
    process.exit(0);
}

check().catch(err => {
    console.error(err);
    process.exit(1);
});

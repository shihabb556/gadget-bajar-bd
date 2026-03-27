import dbConnect from './lib/db';
import { Product } from './models/schema';

async function checkProduct() {
    await dbConnect();
    const products = await Product.find({ colors: { $exists: true, $not: { $size: 0 } } });
    console.log('Products with colors:', JSON.stringify(products, null, 2));
    process.exit(0);
}

checkProduct();

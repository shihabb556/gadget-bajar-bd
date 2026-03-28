const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkLogos() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        const Logo = mongoose.connection.collection('logos');
        const logos = await Logo.find({}).toArray();
        console.log('Found Logos:', JSON.stringify(logos, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkLogos();

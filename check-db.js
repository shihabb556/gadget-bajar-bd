const mongoose = require('mongoose');

async function checkSettings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');
        const Settings = mongoose.connection.collection('settings');
        const settings = await Settings.find({}).toArray();
        console.log('Found Settings:', JSON.stringify(settings, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSettings();

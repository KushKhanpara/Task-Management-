const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const check = async () => {
    console.log('--- DIAGNOSTIC START ---');
    console.log(`Checking Mongo URI: ${process.env.MONGO_URI}`);

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connection Successful');

        const count = await User.countDocuments();
        console.log(`User count: ${count}`);

        if (count === 0) {
            console.log('❌ No users found! You need to seed the database.');
        } else {
            const admin = await User.findOne({ username: 'admin' });
            if (admin) {
                console.log('✅ Admin user found.');
            } else {
                console.log('❌ Admin user NOT found (but other users exist).');
            }
        }

    } catch (error) {
        console.log('❌ MongoDB Connection Failed:', error.message);
    }
    console.log('--- DIAGNOSTIC END ---');
    process.exit();
};

check();

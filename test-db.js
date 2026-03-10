import mongoose from 'mongoose';

const testConnection = async (uri) => {
    try {
        console.log(`Connecting to ${uri}...`);
        await mongoose.connect(uri);
        console.log('SUCCESS');
        process.exit(0);
    } catch (err) {
        console.error('FAILED:', err.message);
        process.exit(1);
    }
};

const uri = process.argv[2] || 'mongodb://localhost:27017/spirulina_db';
testConnection(uri);

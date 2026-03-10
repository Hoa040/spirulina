import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Definition } from './src/models/Definition.js';
import { Record } from './src/models/Record.js';

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- Connected to MongoDB ---');

        const definitions = await Definition.find();
        console.log(`\nDefinitions Count: ${definitions.length}`);
        definitions.forEach(def => {
            console.log(`Definition ID: ${def._id}, version_id: ${def.version_id}, active: ${def.active}`);
            console.log('Columns:', JSON.stringify(def.columns, null, 2));
        });

        const records = await Record.find().limit(5);
        console.log(`\nSample Records (first 5): ${records.length}`);
        records.forEach(rec => {
            console.log(`Record ID: ${rec._id}, definition_id: ${rec.definition_id}`);
            console.log('Values:', JSON.stringify(rec.values, null, 2));
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error checking data:', error);
    }
};

checkData();

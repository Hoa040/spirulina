import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { Definition } from './src/models/Definition.js';
import { Record } from './src/models/Record.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- Connected to MongoDB ---');

        // 1. Clear existing data
        await Definition.deleteMany({});
        await Record.deleteMany({});
        console.log('Cleared existing data.');

        // 2. Create a default definition
        const defaultDefinition = await Definition.create({
            version_id: "v1.0",
            active: true,
            columns: [
                { key: "OD680", type: "number", required: true },
                { key: "pH", type: "number", required: true },
                { key: "temperature_C", type: "number", required: true },
                { key: "light_lux", type: "number", required: true },
                { key: "EC_uS", type: "number", required: true },
                { key: "contamination_flag", type: "boolean", required: true }
            ]
        });
        console.log(`Created Definition: ${defaultDefinition.version_id} (${defaultDefinition._id})`);

        // 3. Load records from seed file
        const rawData = fs.readFileSync('./doc/records_seed.json', 'utf8');
        const recordsToSeed = JSON.parse(rawData);

        // 4. Map records to include definition_id
        const finalRecords = recordsToSeed.map(rec => ({
            ...rec,
            definition_id: defaultDefinition._id
        }));

        // 5. Insert records in chunks to be safe
        const chunkSize = 500;
        for (let i = 0; i < finalRecords.length; i += chunkSize) {
            const chunk = finalRecords.slice(i, i + chunkSize);
            await Record.insertMany(chunk);
            console.log(`Inserted chunk ${i / chunkSize + 1}`);
        }

        console.log('--- Seeding Completed ---');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();

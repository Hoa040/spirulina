import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Models for background task
import { Definition } from './models/Definition.js';
import { Record } from './models/Record.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import definitionRoutes from './routes/definitionRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();

app.use(express.json());

// Serve static frontend from /public folder
app.use(express.static(path.join(__dirname, '../public')));

// Mount API routes
app.use('/api/Sensors/definitions', definitionRoutes);
app.use('/api/Sensors/records', recordRoutes);
app.use('/api/auth', authRoutes);

// Swagger Documentation
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tao Xoan Spirulina API',
            version: '1.0.0',
            description: 'REST API documentation for Spirulina Sensors cultivation system',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Fallback: serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// --- BACKGROUND FETCH TASK ---
const EXTERNAL_API_URL = 'http://45.117.179.192:8000/api/log/last-log/C004';
const FETCH_INTERVAL = 10 * 60 * 1000; // 10 minutes

const startBackgroundFetch = () => {
    console.log('Background fetch task started (Interval: 10 mins)');
    
    const fetchData = async () => {
        try {
            console.log(`[${new Date().toLocaleString()}] Fetching data from external API...`);
            const response = await fetch(EXTERNAL_API_URL);
            const json = await response.json();

            if (json.status && json.data) {
                // 1. Find or Create the Definition for C004
                let def = await Definition.findOne({ version_id: 'C004-External' });
                if (!def) {
                    def = await Definition.create({
                        version_id: 'C004-External',
                        active: true,
                        columns: [
                            { key: 'DO', type: 'number', required: true },
                            { key: 'EC', type: 'number', required: true },
                            { key: 'PH', type: 'number', required: true },
                            { key: 'T02', type: 'number', required: true }
                        ]
                    });
                    console.log('Created new Definition for C004-External');
                }

                // 2. Map external data to our Record format
                const values = json.data.map(item => ({
                    key: item.sensor_name, // e.g., "DO", "PH"
                    value: item.value
                }));

                // 3. Save new Record
                const newRecord = await Record.create({
                    definition_id: def._id,
                    values: values,
                    created_date: new Date()
                });

                console.log(`Successfully saved record from external API (ID: ${newRecord._id})`);
            } else {
                console.warn('External API returned unsuccessful status:', json.message);
            }
        } catch (error) {
            console.error('Error in background fetch task:', error.message);
        }
    };

    // Run once immediately on start
    fetchData();

    // Schedule every 10 minutes
    setInterval(fetchData, FETCH_INTERVAL);
};

// Start the background task
startBackgroundFetch();
// -----------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

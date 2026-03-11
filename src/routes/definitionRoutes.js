import express from 'express';
import {
    getAllDefinitions,
    getActiveDefinition,
    createDefinition
} from '../controllers/sensorController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllDefinitions);
router.get('/active', getActiveDefinition);

// Protected routes
router.post('/', protect, createDefinition);

export default router;

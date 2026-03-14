import express from 'express';
import {
    getAllRecords,
    deleteRecords,
    deleteRecordById,
    updateRecordById,
    createRecord
} from '../controllers/recordController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/:definition_id', getAllRecords);

// Protected routes
router.post('/:definition_id', protect, createRecord);
router.post('/:definitions_id/delete-all', protect, deleteRecords);
router.post('/:definitions_id/delete/:record_id', protect, deleteRecordById);
router.post('/:definitions_id/update/:record_id', protect, updateRecordById);

export default router;

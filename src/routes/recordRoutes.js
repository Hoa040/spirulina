import express from 'express';
import {
    getAllRecords,
    deleteRecords,
    deleteRecordById,
    updateRecordById,
    createRecord,
    getRecordsForActiveDefinition,
    getFilteredRecords,
    getRecordsByStructureSize,
    getRecentRecords
} from '../controllers/recordController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Record:
 *       type: object
 *       required:
 *         - definition_id
 *         - values
 *       properties:
 *         _id:
 *           type: string
 *         definition_id:
 *           type: string
 *         values:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               value:
 *                 type: number
 *         created_date:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Sensor data records management
 */

/**
 * @swagger
 * /api/Sensors/records/active-records:
 *   get:
 *     summary: Get all records for the currently active sensor definition
 *     tags: [Records]
 *     responses:
 *       200:
 *         description: List of records for active definition
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Record'
 *       404:
 *         description: No active definition found
 */
router.get('/active-records', getRecordsForActiveDefinition);

/**
 * @swagger
 * /api/Sensors/records/filter:
 *   get:
 *     summary: Filter records by key and value range (e.g., Temperature 25-27)
 *     tags: [Records]
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         description: The sensor key to filter by (e.g., Nhiệt độ, PH)
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *         description: Minimum value
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *         description: Maximum value
 *     responses:
 *       200:
 *         description: Filtered list of records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Record'
 */
router.get('/filter', getFilteredRecords);

/**
 * @swagger
 * /api/Sensors/records/complex-structure:
 *   get:
 *     summary: Get all records where the definition has 5 or more fields
 *     tags: [Records]
 *     responses:
 *       200:
 *         description: List of records with complex structures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Record'
 */
router.get('/complex-structure', getRecordsByStructureSize);

/**
 * @swagger
 * /api/Sensors/records/recent:
 *   get:
 *     summary: Get all records created after 1/2/2026
 *     tags: [Records]
 *     responses:
 *       200:
 *         description: List of recent records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Record'
 */
router.get('/recent', getRecentRecords);

/**
 * @swagger
 * /api/Sensors/records/{definition_id}:
 *   get:
 *     summary: Get all records for a specific definition
 *     tags: [Records]
 *     parameters:
 *       - in: path
 *         name: definition_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The definition id
 *     responses:
 *       200:
 *         description: List of records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Record'
 */
router.get('/:definition_id', getAllRecords);

// Protected routes
/**
 * @swagger
 * /api/Sensors/records/{definition_id}:
 *   post:
 *     summary: Create a new record for a definition
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: definition_id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               values:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                     value:
 *                       type: number
 *     responses:
 *       201:
 *         description: Record created
 */
router.post('/:definition_id', protect, createRecord);

/**
 * @swagger
 * /api/Sensors/records/{definitions_id}/delete-all:
 *   post:
 *     summary: Delete all records for a specific definition
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: definitions_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: All records deleted
 */
router.post('/:definitions_id/delete-all', protect, deleteRecords);

/**
 * @swagger
 * /api/Sensors/records/{definitions_id}/delete/{record_id}:
 *   post:
 *     summary: Delete a specific record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: definitions_id
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: record_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Record deleted
 */
router.post('/:definitions_id/delete/:record_id', protect, deleteRecordById);

/**
 * @swagger
 * /api/Sensors/records/{definitions_id}/update/{record_id}:
 *   post:
 *     summary: Update a specific record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: definitions_id
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: record_id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Record updated
 */
router.post('/:definitions_id/update/:record_id', protect, updateRecordById);

export default router;

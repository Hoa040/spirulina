import express from 'express';
import {
    getAllDefinitions,
    getActiveDefinition,
    createDefinition,
    getDefinition,
    updateDefinition,
    deleteDefinition
} from '../controllers/definitionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Definition:
 *       type: object
 *       required:
 *         - version_id
 *         - columns
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated id
 *         version_id:
 *           type: string
 *           description: Version identifier for the sensor set
 *         active:
 *           type: boolean
 *           default: false
 *         columns:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               type:
 *                 type: string
 *               required:
 *                 type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Definitions
 *   description: Sensor structure definitions management
 */

/**
 * @swagger
 * /api/Sensors/definitions:
 *   get:
 *     summary: Get all sensor definitions
 *     tags: [Definitions]
 *     responses:
 *       200:
 *         description: List of all definitions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Definition'
 */
router.get('/', getAllDefinitions);

/**
 * @swagger
 * /api/Sensors/definitions/active:
 *   get:
 *     summary: Get the currently active sensor definition
 *     tags: [Definitions]
 *     responses:
 *       200:
 *         description: The active definition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Definition'
 *       404:
 *         description: Active definition not found
 */
router.get('/active', getActiveDefinition);

// Protected routes
/**
 * @swagger
 * /api/Sensors/definitions:
 *   post:
 *     summary: Create a new sensor definition
 *     tags: [Definitions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Definition'
 *     responses:
 *       201:
 *         description: Definition created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, createDefinition);

/**
 * @swagger
 * /api/Sensors/definitions/{id}:
 *   get:
 *     summary: Get a sensor definition by ID
 *     tags: [Definitions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The definition
 *       404:
 *         description: Not found
 */
router.get('/:id', getDefinition);

/**
 * @swagger
 * /api/Sensors/definitions/{id}:
 *   put:
 *     summary: Update a sensor definition
 *     tags: [Definitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Definition'
 *     responses:
 *       201:
 *         description: Updated
 */
router.put('/:id', protect, updateDefinition);

/**
 * @swagger
 * /api/Sensors/definitions/{id}:
 *   delete:
 *     summary: Delete a sensor definition
 *     tags: [Definitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       201:
 *         description: Deleted
 */
router.delete('/:id', protect, deleteDefinition);

export default router;

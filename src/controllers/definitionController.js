import { Definition } from '../models/Definition.js';
import genericController from './genericController.js';

// GET: api/Sensors/definitions
export const getAllDefinitions = genericController.getAll(Definition);

// GET: api/Sensors/definitions/active
export const getActiveDefinition = async (req, res) => {
    try {
        const activeDef = await Definition.findOne({ active: true });
        if (activeDef) {
            res.json(activeDef);
        } else {
            res.status(404).json({ message: 'No active definition found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: api/Sensors/definitions
export const createDefinition = genericController.create(Definition);

// GET: api/Sensors/definitions/:id
export const getDefinition = genericController.get(Definition);

// PUT/POST: api/Sensors/definitions/:id
export const updateDefinition = genericController.update(Definition);

// DELETE: api/Sensors/definitions/:id
export const deleteDefinition = genericController.delete(Definition);

import { Definition } from '../models/Definition.js';

// GET: api/Sensors/definitions
export const getAllDefinitions = async (req, res) => {
    try {
        const definitions = await Definition.find({});
        res.json(definitions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
export const createDefinition = async (req, res) => {
    try {
        const newDef = new Definition(req.body);
        const savedDef = await newDef.save();
        res.status(201).json(savedDef);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

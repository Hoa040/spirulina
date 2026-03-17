import { Record } from '../models/Record.js';
import { Definition } from '../models/Definition.js';
import genericController from './genericController.js';

// GET: api/Sensors/records/active/records
// ... (hàm getRecordsForActiveDefinition)
export const getRecordsForActiveDefinition = async (req, res) => {
    try {
        const activeDef = await Definition.findOne({ active: true });
        if (!activeDef) {
            return res.status(404).json({ message: 'No active definition found' });
        }
        const records = await Record.find({ definition_id: activeDef._id });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: api/Sensors/records/filter
export const getFilteredRecords = async (req, res) => {
    try {
        const { key, min, max } = req.query;
        const query = {};
        
        if (key) {
            const valueFilter = { $elemMatch: { key } };
            if (min !== undefined) valueFilter.$elemMatch.value = { ...valueFilter.$elemMatch.value, $gte: Number(min) };
            if (max !== undefined) valueFilter.$elemMatch.value = { ...valueFilter.$elemMatch.value, $lte: Number(max) };
            query.values = valueFilter;
        }

        const records = await Record.find(query);
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: api/Sensors/records/complex-structure
export const getRecordsByStructureSize = async (req, res) => {
    try {
        const definitions = await Definition.find({ $expr: { $gte: [{ $size: "$columns" }, 5] } });
        const defIds = definitions.map(d => d._id);
        
        const records = await Record.find({ definition_id: { $in: defIds } });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: api/Sensors/records/recent
export const getRecentRecords = async (req, res) => {
    try {
        const date = new Date('2026-02-01');
        const records = await Record.find({ created_date: { $gt: date } });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: api/Sensors/:definition_id/GetAllRecords
export const getAllRecords = async (req, res) => {
    try {
        const { definition_id } = req.params;
        const records = await Record.find({ definition_id });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: api/Sensors/:definition_id/records
export const createRecord = async (req, res) => {
    try {
        const { definition_id } = req.params;
        const recordData = { ...req.body, definition_id };
        const newRecord = new Record(recordData);
        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: api/Sensors/:definitions_id/DeleteRecords
export const deleteRecords = async (req, res) => {
    try {
        const { definitions_id } = req.params;
        const result = await Record.deleteMany({ definition_id: definitions_id });
        res.json({ message: `${result.deletedCount} records deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: api/Sensors/:definitions_id/DeleteRecordById/:id
export const deleteRecordById = genericController.delete(Record);

// POST: api/Sensors/:definitions_id/UpdateRecordById/:id
export const updateRecordById = genericController.update(Record);

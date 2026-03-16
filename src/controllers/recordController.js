import { Record } from '../models/Record.js';
import { Definition } from '../models/Definition.js';

// GET: api/Sensors/records/active/records
// Xuất tất cả các records theo cấu trúc bảng được cho trước / các records cho structure là active
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
// Xuất các records theo ngưỡng và loại thông tin cần lọc
// Query params: key, min, max
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
// xuất ra tất cả những records mà có cấu trúc bảng gồm 5 trường trở lên
export const getRecordsByStructureSize = async (req, res) => {
    try {
        // Find definitions with 5 or more columns
        const definitions = await Definition.find({ $expr: { $gte: [{ $size: "$columns" }, 5] } });
        const defIds = definitions.map(d => d._id);
        
        const records = await Record.find({ definition_id: { $in: defIds } });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: api/Sensors/records/recent
// Xuát các dòng dữ liệu trong bảng records mà được tạo sau ngày 1/2/2026
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
        const { definitions_id } = req.params; // definitions_id from route parameter
        const result = await Record.deleteMany({ definition_id: definitions_id });
        res.json({ message: `${result.deletedCount} records deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: api/Sensors/:definitions_id/DeleteRecordById/:record_id
export const deleteRecordById = async (req, res) => {
    try {
        const { record_id } = req.params;
        const result = await Record.findByIdAndDelete(record_id);
        if (result) {
            res.json({ message: 'Record deleted successfully' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST: api/Sensors/:definitions_id/UpdateRecordById/:record_id
export const updateRecordById = async (req, res) => {
    try {
        const { record_id } = req.params;
        // Update any info from req.body
        const updatedRecord = await Record.findByIdAndUpdate(
            record_id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (updatedRecord) {
            res.json(updatedRecord);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

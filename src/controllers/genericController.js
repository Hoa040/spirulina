import mongoose from 'mongoose';

const create = (model) => (req, res, next) => {
    const item = new model({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
    });

    return item
        .save()
        .then((result) => res.status(201).json({ result }))
        .catch((error) => res.status(500).json({ error: error.message || error }));
};

const getAll = (model) => (req, res) => {
    return model.find({})
        .then((results) => res.status(200).json({ results }))
        .catch((error) => res.status(500).json({ error: error.message || error }));
};

const get = (model) => (req, res) => {
    const id = req.params.id;

    return model.findById(id)
        .then((result) => (result ? res.status(200).json({ result }) 
                                 : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error: error.message || error }));
};

const update = (model) => (req, res) => {
    const id = req.params.id;

    return model
        .findById(id)
        .then((result) => {
            if (result) {
                result.set(req.body);
                return result
                    .save()
                    .then((savedResult) => res.status(201).json({ result: savedResult }))
                    .catch((error) => res.status(500).json({ error: error.message || error }));
            } else {
                return res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((error) => res.status(500).json({ error: error.message || error }));
};

const remove = (model) => (req, res) => {
    const id = req.params.id;

    return model.findByIdAndDelete(id)
        .then((result) => (result ? res.status(201).json({ result, message: 'Deleted' }) 
                              : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error: error.message || error }));
};

export default { create, getAll, get, update, delete: remove };

const express = require('express');
const router = express.Router();
const {WorkoutLog} = require('../models/program');

router.get('', (req, res, next) => {
    WorkoutLog.find()
        .then(documents => {
            res.status(200).json({
                message: 'Workout LOGS fetched successfully!',
                workoutLogs: documents
            });
        });
});


router.post('', (req, res, next) => {
    const workoutLog = new WorkoutLog({
        date: req.body.date,
        workoutId: req.body.programId,
        weight: req.body.weight,
    });
    console.log(workoutLog);
    workoutLog.save();
    res.status(201).json({
        message: 'Workout log added successfully!'
    });
})

module.exports = router;
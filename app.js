const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const workoutLogsRoutes = require('./routes/workoutLogs');
const { Program, Workout} = require('./models/program');

const app = express();

const mgUrl = "mongodb+srv://bernhardwhy:" + process.env.MONGO_ATLAS_PW + "@mean-workout.pxedv.mongodb.net/?retryWrites=true&w=majority&appName=mean-workout";

mongoose.connect(mgUrl)
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection failed!');
    });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/api/workout-logs', workoutLogsRoutes);


app.get('/api/programs', (req, res, next) => {
    Program.find()
        .then(documents => {
            res.status(200).json({
                message: 'Programs fetched successfully!',
                programs: documents
            });
        });
});

app.get('/api/workouts', (req, res, next) => {
    Workout.find()
    .then(documents => {
        res.status(200).json({
            message: 'Workouts fetched successfully!',
            workouts: documents
        });
    });
});



module.exports = app;
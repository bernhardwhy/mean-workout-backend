const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const workoutLogsRoutes = require('./routes/workoutLogs');
const { Program, Workout, ExerciseDetail, Exercise } = require('./models/program');

const app = express();

const mgUrl = "mongodb+srv://bernhardwhy:" + process.env.MONGO_ATLAS_PW + "@mean-workout.pxedv.mongodb.net/?retryWrites=true&w=majority&appName=mean-workout";

mongoose.connect(mgUrl)
    .then(() => {
        console.log('Connected to database!');
    })
    .catch((err) => {
        console.log('Connection failed!', err);
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

app.get("/api/workouts/:id", (req, res) => {
    const workoutId = req.params.id;

    Workout.aggregate([
        { $match: { id: workoutId } },
        {
            $addFields: {
                "exercises.warmUp": {
                    $map: {
                        input: "$exercises.warmUp",
                        as: "warmUpItem",
                        in: {
                            id: { $toObjectId: "$$warmUpItem.id" },
                            sets: "$$warmUpItem.sets",
                            reps: "$$warmUpItem.reps",
                            duration: "$$warmUpItem.duration",
                            rest: "$$warmUpItem.rest",
                        },
                    },
                },
            },
        },
        {
            $lookup: {
                from: "exercises",
                localField: "exercises.warmUp.id",
                foreignField: "_id",
                as: "warmUpExercises",
            },
        },
        {
            $addFields: {
                "exercises.main": {
                    $map: {
                        input: "$exercises.main",
                        as: "mainItem",
                        in: {
                            id: { $toObjectId: "$$mainItem.id" },
                            sets: "$$mainItem.sets",
                            reps: "$$mainItem.reps",
                            duration: "$$mainItem.duration",
                            rest: "$$mainItem.rest",
                        },
                    },
                },
            },
        },
        {
            $lookup: {
                from: "exercises",
                localField: "exercises.main.id",
                foreignField: "_id",
                as: "mainExercises",
            },
        },
        {
            $project: {
                id: 1,
                title: 1,
                exercises: {
                    warmUp: {
                        $map: {
                            input: "$exercises.warmUp",
                            as: "warmUpItem",
                            in: {
                                $mergeObjects: [
                                    "$$warmUpItem",
                                    {
                                        title: {
                                            $arrayElemAt: [
                                                "$warmUpExercises.title",
                                                { $indexOfArray: ["$warmUpExercises._id", "$$warmUpItem.id"] },
                                            ],
                                        },
                                        image: {
                                            $arrayElemAt: [
                                                "$warmUpExercises.image",
                                                { $indexOfArray: ["$warmUpExercises._id", "$$warmUpItem.id"] },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    main: {
                        $map: {
                            input: "$exercises.main",
                            as: "mainItem",
                            in: {
                                $mergeObjects: [
                                    "$$mainItem",
                                    {
                                        title: {
                                            $arrayElemAt: [
                                                "$mainExercises.title",
                                                { $indexOfArray: ["$mainExercises._id", "$$mainItem.id"] },
                                            ],
                                        },
                                        image: {
                                            $arrayElemAt: [
                                                "$mainExercises.image",
                                                { $indexOfArray: ["$mainExercises._id", "$$mainItem.id"] },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        },
    ])
        .then((workout) => {
            res.status(200).json({
                message: 'Workout Detail fetched successfully!',
                workoutDetail: workout[0] || {}
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "An error occurred while fetching workout data." });
        });
});




// console.log(req.params.id);
// Workout.find({
//     id: req.params.id
// })
//     .then(documents => {
//         res.status(200).json({
//             message: 'Workout Detail fetched successfully!',
//             workoutDetail: documents[0]
//         });
//     });

// res.status(200).json({
//     message: 'Workout Detail fetched successfully!',
//     workoutDetail: WORKOUTS[0]
// });

app.get('/api/exercises', (req, res, next) => {
    ExerciseDetail.find()
        .then(documents => {
            res.status(200).json({
                message: 'Exercises fetched successfully!',
                exercises: documents
            });
        });
});


module.exports = app;
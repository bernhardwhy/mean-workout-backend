const mongoose = require('mongoose');

const WorkoutLogSchema = mongoose.Schema({
    workoutId: { type: String, required: true },
    weight: { type: Number, required: true },
    date: { type: String, required: true },
})

const WorkoutOverviewSchema = mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    isRest: { type: Boolean, required: true },
});

const WeekSchema = mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    workouts: [{
        id: { type: String, required: true },
        title: { type: String, required: true },
        workouts: [WorkoutOverviewSchema],
    }],
});


const ProgramSchema = mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    weeks: [WeekSchema],
});

const ExerciseSchema = mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    duration: { type: Number, required: true },
    rest: { type: Number, required: true },
});

const WorkoutSchema = mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    exercises: [{
        warmUp: [ExerciseSchema],
        main: [ExerciseSchema],
    }],
});





const Program = mongoose.model('Program', ProgramSchema);
const WorkoutLog = mongoose.model('WorkoutLog', WorkoutLogSchema);
const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = { Program, WorkoutLog, Workout };



// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
// async function run() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongoose.disconnect();
//   }
// }
// run().catch(console.dir);







// const { Schema } = mongoose;

// const WarmUpMainSchema = new Schema({
//     id: { type: String, required: true },
//     title: { type: String, required: true },
//     sets: { type: Number, required: true },
//     reps: { type: Number, required: true },
//     duration: { type: Number, required: true },
//     rest: { type: Number, required: true },
// });

// const WorkoutSchema = new Schema({
//     id: { type: String, required: true },
//     title: { type: String, required: true },
//     exercises: [{
//         warmUp: [WarmUpMainSchema],
//         main: [WarmUpMainSchema],
//     }],
// });

// const WeekSchema = new Schema({
//     id: { type: String, required: true },
//     title: { type: String, required: true },
//     workouts: [{
//         id: { type: String, required: true },
//         title: { type: String, required: true },
//         isRest: { type: Boolean, required: true },
//     }],
// });

// const ProgramSchema = new Schema({
//     id: { type: String, required: true },
//     title: { type: String, required: true },
//     weeks: [WeekSchema],
// });

// const Program = mongoose.model('Program', ProgramSchema);
// const Workout = mongoose.model('Workout', WorkoutSchema);
// const Week = mongoose.model('Week', WeekSchema);

// module.exports = { Program, Workout, Week };



// const mongoose = require('mongoose');
// const uri = "mongodb+srv://bernhardwhy:x4SUbMdxqI5gDLXw@mean-workout.pxedv.mongodb.net/?retryWrites=true&w=majority&appName=mean-workout";
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
// async function run() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongoose.disconnect();
//   }
// }
// run().catch(console.dir);

// mongodb+srv://bernhardwhy:x4SUbMdxqI5gDLXw@mean-workout.pxedv.mongodb.net/?retryWrites=true&w=majority&appName=mean-workout
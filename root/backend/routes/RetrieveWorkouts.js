const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const requiresAuth = require("../middleware/permission");
const pool = require("../databse/db");

//      RETRIEVING DATA     //
///////////////////////////////
// @route   GET /api/splits/current
// @desc    get user splits with list of workouts
// @access  Private
router.get("/splits/current", requiresAuth, async (req, res) => {
  try {
    user_id = req.user.id;

    const splits = await pool.query(
      "SELECT s.split_id, s.split_name, s.days, s.date, array_agg(w.workout_name) FROM splits s LEFT JOIN workouts w ON w.split_id = s.split_id WHERE s.user_id = $1 GROUP BY s.split_id ORDER BY s.date",
      [user_id]
    );

    res.json(splits.rows);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route   GET /api/splits/workouts/:splitId
// @desc    get user workouts with list of exercises from the split
// @access  Private
router.get("/splits/workouts/:splitId", requiresAuth, async (req, res) => {
  try {
    user_id = req.user.id;
    const split_id = req.params.splitId;

    // Get user workouts
    const workouts = await pool.query(
      "SELECT w.workout_id, w.workout_name, w.date, w.day, array_agg(e.exercise_name) FROM workouts w LEFT JOIN exercises e ON e.workout_id = w.workout_id WHERE w.user_id = $1 AND w.split_id = $2 GROUP BY w.workout_id",
      [user_id, split_id]
      // "SELECT * FROM workouts WHERE user_id=$1 AND split_id = $2 ORDER BY date DESC",
    );
    res.json(workouts.rows);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route   GET /api/splits/workout/:workoutId
// @desc    get current workout
// @access  Private
router.get("/splits/workout/:workoutId", requiresAuth, async (req, res) => {
  try {
    user_id = req.user.id;
    const workout_id = req.params.workoutId;

    // Get user workouts
    const workout = await pool.query(
      "SELECT w.workout_id, w.workout_name, w.day FROM workouts w WHERE user_id = $1 AND workout_id = $2",
      [user_id, workout_id]
    );
    res.json(workout.rows);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route   GET /api/splits/workout/trackData/:workoutId
// @desc    get current track data for the workout
// @access  Private
router.get(
  "/splits/workout/trackData/:workoutId",
  requiresAuth,
  async (req, res) => {
    try {
      user_id = req.user.id;
      const workout_id = req.params.workoutId;

      // Get user workouts
      const trackData = await pool.query(
        "SELECT * FROM track WHERE user_id = $1 AND workout_id = $2",
        [user_id, workout_id]
      );
      res.json(trackData.rows);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

// @route   GET /api/splits/workouts/exercises/prevData/:workoutId
// @desc    get user previous workout
// @access  Private
router.get(
  "/splits/workouts/exercises/prevData/:workoutId",
  requiresAuth,
  async (req, res) => {
    try {
      user_id = req.user.id;
      const workout_id = req.params.workoutId;

      const currentWorkoutDay = await pool.query(
        "SELECT day FROM workouts WHERE workout_id = $1",
        [workout_id]
      );

      // Get user exercises with tracking data from a given workout
      // importing track data into object to attach to every exercise
      // filter track data by workout day
      const track_data = await pool.query(
        "SELECT e.exercise_id, e.exercise_name, e.goal_sets, e.goal_reps, json_agg( json_build_object('track_id', t.track_id, 'set', t.set, 'reps', t.reps, 'user_id', t.user_id, 'exercise_id', t.exercise_id, 'weight', t.weight, 'workout_day', t.workout_day, 'workout_id', t.workout_id) ORDER BY t.set) AS trackData FROM exercises e LEFT JOIN track t ON e.exercise_id = t.exercise_id AND t.workout_day = $1 WHERE e.workout_id = $2 GROUP BY e.exercise_id, e.exercise_name, e.goal_sets, e.goal_reps ORDER BY e.exercise_id;",
        [currentWorkoutDay.rows[0].day, workout_id]
      );

      res.json(track_data.rows);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

// @route   GET /api/splits/workouts/exercises/currentData/:workoutId
// @desc    get user current workout
// @access  Private
router.get(
  "/splits/workouts/exercises/currentData/:workoutId",
  requiresAuth,
  async (req, res) => {
    try {
      user_id = req.user.id;
      const workout_id = req.params.workoutId;

      const currentWorkoutDay = await pool.query(
        "SELECT day FROM workouts WHERE workout_id = $1",
        [workout_id]
      );

      // Get user exercises with tracking data from a given workout
      // importing track data into object to attach to every exercise
      // filter track data by workout day
      const track_data = await pool.query(
        "SELECT e.exercise_id, json_agg( json_build_object('track_id', t.track_id, 'set', t.set, 'reps', 0, 'user_id', t.user_id, 'exercise_id', t.exercise_id, 'weight', 0, 'workout_day', t.workout_day, 'workout_id', t.workout_id) ORDER BY t.set) AS trackData FROM exercises e LEFT JOIN track t ON e.exercise_id = t.exercise_id AND t.workout_day = $1 WHERE e.workout_id = $2 GROUP BY e.exercise_id ORDER BY e.exercise_id;",
        [currentWorkoutDay.rows[0].day, workout_id]
      );

      res.json(track_data.rows);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

module.exports = router;

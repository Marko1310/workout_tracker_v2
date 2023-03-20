const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const requiresAuth = require("../middleware/permission");
const databaseCheck = require("../middleware/databaseChecks");
const pool = require("../databse/db");

//      ADDING DATA     //
///////////////////////////////
// @route   POST /api/splits/new
// @desc    Create new split
// @access  Private
router.post("/split/new", requiresAuth, async (req, res) => {
  try {
    user_id = req.user.id;
    const date = new Date();
    const { title, days } = req.body;

    if (!title) {
      return res.status(400).json({ title: "Title field can not be empty" });
    }

    if (days === 0 || days < 1 || days > 7) {
      return res
        .status(400)
        .json({ days: "Days field should be between 1 and 7" });
    }

    const split = await pool.query(
      "INSERT INTO splits (split_name, user_id, days, date) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, user_id, days, date]
    );
    res.json(split.rows);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route   POST /api/split/workout/new
// @desc    Create new workout in the workout split
// @access  Private
router.post("/split/workout/new", requiresAuth, async (req, res) => {
  try {
    user_id = req.user.id;
    const date = new Date();
    const { title, split_id } = req.body;

    if (!title) {
      return res.status(400).json({ title: "Title field can not be empty" });
    }

    const isValidSplitId = await databaseCheck.checkSplitId(split_id, user_id);
    if (isValidSplitId === 0) {
      return res.status(400).send("Unathorized");
    }

    const workout = await pool.query(
      "INSERT INTO workouts (workout_name, date, split_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, date, split_id, user_id]
    );
    res.json(workout.rows);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route   POST /api/split/workout/exercise/new
// @desc    Create new exercise in the workout split
// @access  Private
router.post("/split/workout/exercise/new", requiresAuth, async (req, res) => {
  try {
    user_id = req.user.id;
    const date = new Date();
    const { title, goal_sets, goal_reps, workout_id } = req.body;

    if (!title) {
      return res.status(400).json({ title: "Title field can not be empty" });
    }

    if (goal_sets < 1) {
      return res
        .status(400)
        .json({ sets: "Number of sets must be greater then 0" });
    }

    if (goal_reps < 1) {
      return res
        .status(400)
        .json({ reps: "Number of reps must be greater then 0" });
    }

    const isValidWorkoutId = await databaseCheck.checkWorkoutId(
      workout_id,
      user_id
    );
    if (isValidWorkoutId === 0) {
      return res.status(400).send("Unathorized");
    }

    const exercise = await pool.query(
      "INSERT INTO exercises (exercise_name, goal_sets, goal_reps, date, workout_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, goal_sets, goal_reps, date, workout_id, user_id]
    );

    res.json(exercise.rows);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route   POST /api/split/workout/exercise/set
// @desc    Add new set to a given exercises of a certain workout
// @access  Private

router.post(
  "/split/workout/exercise/set/new",
  requiresAuth,
  async (req, res) => {
    try {
      user_id = req.user.id;
      const date = new Date();
      const { exercise_id, workout_id, day } = req.body;

      const checkExerciseId = await pool.query(
        "SELECT * FROM exercises WHERE exercise_id = $1 AND user_id = $2",
        [exercise_id, user_id]
      );

      if (checkExerciseId.rows.length === 0) {
        return res.status(400).send("Unathorized");
      }

      const currentWorkoutDay = await pool.query(
        "SELECT day FROM workouts WHERE workout_id = $1",
        [workout_id]
      );

      const lastSet = await pool.query(
        "SELECT MAX(set) FROM track WHERE exercise_id = $1 AND user_id = $2 AND workout_day = $3;",
        [exercise_id, user_id, day]
      );

      if (lastSet.rows[0].max) {
        let nextSet = lastSet.rows[0].max + 1;
        const insertSet = await pool.query(
          "INSERT INTO track (set, weight, reps, date, exercise_id, user_id, workout_id, workout_day) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
          [
            nextSet,
            0,
            0,
            date,
            exercise_id,
            user_id,
            workout_id,
            currentWorkoutDay.rows[0].day,
          ]
        );
        res.json(insertSet.rows);
      } else {
        const insertSet = await pool.query(
          "INSERT INTO track (set, weight, reps, date, exercise_id, user_id, workout_id, workout_day) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
          [
            1,
            0,
            0,
            date,
            exercise_id,
            user_id,
            workout_id,
            currentWorkoutDay.rows[0].day,
          ]
        );
        res.json(insertSet.rows);
      }
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

router.post("/split/workout/exercise/track", requiresAuth, async (req, res) => {
  try {
    user_id = req.user.id;
    const { currentTrackData } = req.body;

    const queryValues = currentTrackData
      .map((data) => {
        const nextDay = data.workout_day + 1;
        return `(${data.set}, ${data.reps}, ${data.weight}, ${data.user_id}, ${data.exercise_id}, ${nextDay}, ${data.workout_id})`;
      })
      .join(",");

    const query = `
          INSERT INTO track (set, reps, weight, user_id, exercise_id, workout_day, workout_id) VALUES ${queryValues}`;
    await pool.query(query);

    res.json({ success: true, updatedRows: currentTrackData });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

///////////////////////////////////////
// @route   POST /api/split/workout/exercise/track
// @desc    Update workout day and create new track data for new workout day
// @access  Private
router.post(
  "/split/workout/exercise/track/new",
  requiresAuth,
  async (req, res) => {
    try {
      const date = new Date();
      user_id = req.user.id;
      const { workout_id } = req.body;

      const isValidWorkoutId = await databaseCheck.checkWorkoutId(
        workout_id,
        user_id
      );
      if (isValidWorkoutId === 0) {
        return res.status(400).send("Unathorized");
      }

      const currentWorkoutDay = await pool.query(
        "SELECT day FROM workouts WHERE workout_id = $1",
        [workout_id]
      );

      const newWorkoutDay = await pool.query(
        "UPDATE workouts SET day = day + 1 WHERE workout_id = $1 RETURNING *",
        [workout_id]
      );

      const newTrackData = await pool.query(
        "INSERT INTO track (set, reps, weight, date, user_id, exercise_id, workout_day, workout_id) SELECT set, 0, 0, $1, user_id, exercise_id, $2, workout_id FROM track WHERE workout_id = $3 AND workout_day = $4 GROUP BY set, reps, weight, date, user_id, exercise_id, workout_day, workout_id RETURNING *",
        [
          date,
          newWorkoutDay.rows[0].day,
          workout_id,
          currentWorkoutDay.rows[0].day,
        ]
      );
      res.json(newTrackData.rows);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

///////////////////////////////////////

module.exports = router;

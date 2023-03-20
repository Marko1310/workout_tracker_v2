const express = require("express");
const router = express.Router();
const requiresAuth = require("../middleware/permission");
const databaseCheck = require("../middleware/databaseChecks");
const pool = require("../databse/db");

//      EDITING DATA     //
///////////////////////////////
// @route   DELETE /api/split/delete
// @desc    Delete split
// @access  Private
router.delete("/split/delete", requiresAuth, async (req, res) => {
  try {
    user_id = req.user.id;
    const { split_id } = req.body;
    const isValidSplitId = await databaseCheck.checkSplitId(split_id, user_id);
    if (isValidSplitId === 0) {
      return res.status(400).send("Unathorized");
    }

    const deletedSplit = await pool.query(
      "DELETE FROM splits WHERE split_id = $1 AND user_id = $2 RETURNING *",
      [split_id, user_id]
    );
    res.json(deletedSplit.rows);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route   DELETE /api/split/workout/delete
// @desc    Delete workout in a split
// @access  Private
router.delete("/split/workout/delete", requiresAuth, async (req, res) => {
  try {
    user_id = req.user.id;
    const { split_id, workout_id } = req.body;

    const isValidSplitId = await databaseCheck.checkSplitId(split_id, user_id);
    if (isValidSplitId === 0) {
      return res.status(400).send("Unathorized");
    }

    const isValidWorkoutId = await databaseCheck.checkWorkoutId(
      workout_id,
      user_id
    );
    if (isValidWorkoutId === 0) {
      return res.status(400).send("Unathorized");
    }

    const deletedWorkout = await pool.query(
      "DELETE FROM workouts WHERE workout_id = $1 AND user_id = $2 RETURNING *",
      [workout_id, user_id]
    );
    res.json(deletedWorkout.rows);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route   DELETE /api/split/workout/exercise/delete
// @desc    Delete exercise in a workout
// @access  Private
router.delete(
  "/split/workout/exercise/delete",
  requiresAuth,
  async (req, res) => {
    try {
      user_id = req.user.id;
      const { workout_id, exercise_id } = req.body;

      const isValidWorkoutId = await databaseCheck.checkWorkoutId(
        workout_id,
        user_id
      );
      if (isValidWorkoutId === 0) {
        return res.status(400).send("Unathorized");
      }

      const isValidExerciseId = await databaseCheck.checkExerciseId(
        exercise_id,
        user_id
      );
      if (isValidExerciseId === 0) {
        return res.status(400).send("Unathorized");
      }

      const deletedExercise = await pool.query(
        "DELETE FROM exercises WHERE exercise_id = $1 AND user_id = $2 RETURNING *",
        [exercise_id, user_id]
      );
      res.json(deletedExercise.rows);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

// @route   DELETE /api/split/workout/exercise/set/delete
// @desc    Delete set in exercise
// @access  Private
router.delete(
  "/split/workout/exercise/set/delete",
  requiresAuth,
  async (req, res) => {
    try {
      user_id = req.user.id;
      const { workout_id, exercise_id, track_id } = req.body;

      const isValidWorkoutId = await databaseCheck.checkWorkoutId(
        workout_id,
        user_id
      );
      if (isValidWorkoutId === 0) {
        return res.status(400).send("Unathorized");
      }

      const isValidExerciseId = await databaseCheck.checkExerciseId(
        exercise_id,
        user_id
      );
      if (isValidExerciseId === 0) {
        return res.status(400).send("Unathorized");
      }

      const isValidTrackId = await databaseCheck.checkTrackId(
        exercise_id,
        track_id,
        user_id
      );
      if (isValidTrackId === 0) {
        return res.status(400).send("Unathorized");
      }

      const deletedTrack = await pool.query(
        "DELETE FROM track WHERE exercise_id = $1 AND track_id = $2 AND user_id = $3 RETURNING *",
        [exercise_id, track_id, user_id]
      );
      res.json(deletedTrack.rows);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

// @route   POST /api/split/workout/editDay
// @desc    update workout day
// @access  Private
router.post("/split/workout/editDay", requiresAuth, async (req, res) => {
  try {
    user_id = req.user.id;
    const { workout_id } = req.body;

    const isValidWorkoutId = await databaseCheck.checkWorkoutId(
      workout_id,
      user_id
    );
    if (isValidWorkoutId === 0) {
      return res.status(400).send("Unathorized");
    }

    const updateWorkoutDay = await pool.query(
      "UPDATE workouts SET day = day + 1 WHERE workout_id = $1 RETURNING *",
      [workout_id]
    );
    res.json(updateWorkoutDay.rows);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;

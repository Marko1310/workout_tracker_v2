const pool = require("../databse/db");

const checkSplitId = async (split_id, user_id) => {
  try {
    const splitId = await pool.query(
      "SELECT * FROM splits WHERE split_id = $1 AND user_id = $2",
      [split_id, user_id]
    );
    return splitId.rows.length;
  } catch (err) {
    console.log(err);
  }
};

const checkWorkoutId = async (workout_id, user_id) => {
  try {
    const workoutId = await pool.query(
      "SELECT * FROM workouts WHERE workout_id = $1 AND user_id = $2",
      [workout_id, user_id]
    );
    return workoutId.rows.length;
  } catch (err) {
    console.log(err);
  }
};

const checkExerciseId = async (exercise_id, user_id) => {
  try {
    const exerciseId = await pool.query(
      "SELECT * FROM exercises WHERE exercise_id = $1 AND user_id = $2",
      [exercise_id, user_id]
    );
    return exerciseId.rows.length;
  } catch (err) {
    console.log(err);
  }
};

const checkTrackId = async (exercise_id, track_id, user_id) => {
  try {
    const trackId = await pool.query(
      "SELECT * FROM track WHERE exercise_id = $1 AND track_id = $2 AND user_id = $3",
      [exercise_id, track_id, user_id]
    );
    return trackId.rows.length;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  checkSplitId,
  checkWorkoutId,
  checkExerciseId,
  checkTrackId,
};

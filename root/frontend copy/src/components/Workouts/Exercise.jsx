// React
import { useContext } from "react";
import { useParams } from "react-router-dom";

// css
import "./Exercise.css";

// Context
import { GlobalContext } from "../../context/GlobalContext";

const Exercise = ({ el }) => {
  const { addNewSet } = useContext(GlobalContext);
  const { deleteExercise } = useContext(GlobalContext);
  const { deleteSet } = useContext(GlobalContext);
  const { setLoadingTimeout } = useContext(GlobalContext);
  const { currentWorkout } = useContext(GlobalContext);
  const { currentTrackData, setCurrentTrackData } = useContext(GlobalContext);

  const { id } = useParams();

  // add new set
  const handleNewSet = (e) => {
    e.preventDefault();
    setLoadingTimeout();
    addNewSet(el.exercise_id, id, currentWorkout.day);
  };

  // delete set
  const handleDeleteSet = (e, workout_id, exercise_id, track_id) => {
    deleteSet(e, workout_id, exercise_id, track_id);
    setLoadingTimeout();
  };

  // delete exercise
  const handleDeleteExercise = (e, workout_id, exercise_id) => {
    if (
      window.confirm(
        "By removing the exercise, you will also remove all previous data?"
      )
    ) {
      deleteExercise(e, workout_id, exercise_id);
      setLoadingTimeout();
    }
    e.stopPropagation();
  };

  // update state with weight
  const handleChangeWeight = (e, track_id) => {
    const updateWeight = currentTrackData.map((el) => {
      if (el.track_id === track_id) {
        return { ...el, weight: e.target.value };
      }
      return el;
    });
    setCurrentTrackData(updateWeight);
  };

  // update state with reps
  const handleChangeReps = (e, track_id) => {
    const updateReps = currentTrackData.map((el) => {
      if (el.track_id === track_id) {
        return { ...el, reps: e.target.value };
      }
      return el;
    });
    setCurrentTrackData(updateReps);
  };

  // if no data -> don't render empty list item
  const isTrackEmpty = el.trackdata[0].track_id === null;

  // disable deleting sets in between, only last one
  let lastSet = 0;
  el.trackdata.map((el) => {
    if (el.set > lastSet) lastSet = el.set;
  });

  return (
    <div className="exercise-container">
      <div className="title-container">
        <p className="exercise-title">
          {el.exercise_name} ({el.goal_sets} x {el.goal_reps})
        </p>
        <p
          onClick={(e) => handleDeleteExercise(e, id, el.exercise_id)}
          className="delete-exercise"
        >
          Delete
        </p>
      </div>
      <div className="exercise-navbar">
        <p className="exercise-navbar-title">Set</p>
        <p className="exercise-navbar-title">Previous</p>
        <p className="exercise-navbar-title">kg</p>
        <p className="exercise-navbar-title">Reps</p>
      </div>
      {!isTrackEmpty &&
        el.trackdata.map((track) => {
          return (
            <div
              parent-id={track.exercise_id}
              key={track.track_id}
              className="exercise"
            >
              <p className="set">{track.set}</p>
              <p className="previous">
                {track.weight} kg x {track.reps}
              </p>
              <input
                onChange={(e) => {
                  handleChangeWeight(e, track.track_id);
                }}
                className="exercise-forms"
                type="number"
                id="kg"
                name="kg"
                placeholder="kg"
              ></input>
              <input
                onChange={(e) => handleChangeReps(e, track.track_id)}
                className="exercise-forms"
                type="number"
                id="reps"
                name="reps"
                placeholder="reps"
              ></input>
              {lastSet === track.set && (
                <p
                  onClick={(e) => {
                    handleDeleteSet(e, id, el.exercise_id, track.track_id);
                  }}
                  className="delete-set"
                >
                  x
                </p>
              )}
            </div>
          );
        })}
      <button onClick={(e) => handleNewSet(e)} className="addSetBtn">
        + Add Set
      </button>
    </div>
  );
};

export default Exercise;

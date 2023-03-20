// React
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";

// Context
import { GlobalContext } from "../../context/GlobalContext";

// css
import "./NewWorkoutModal.css";

const NewWorkoutModal = () => {
  const { isModalOpen } = useContext(GlobalContext);
  const { setIsModalOpen } = useContext(GlobalContext);
  const { addWorkout } = useContext(GlobalContext);
  const { split_id } = useParams();
  const [title, setTitle] = useState("");
  const { setLoadingTimeout } = useContext(GlobalContext);
  const { error } = useContext(GlobalContext);

  const handleNewWorkout = (e) => {
    e.preventDefault();
    if (title) {
      setLoadingTimeout();
    }
    addWorkout(e, title, split_id);
  };
  return (
    <div className={`newWorkout-container ${isModalOpen ? "show" : ""}`}>
      <p className="newWorkout-title">Add new workout</p>
      <form onSubmit={(e) => handleNewWorkout(e)}>
        <label htmlFor="newWorkout-title">Title of the workout</label>
        <input
          onChange={(e) => setTitle(e.target.value)}
          className="forms"
          type="text"
          id="title"
          name="title"
          placeholder="e.g. Push day"
        ></input>
        {error.title ? <p className="error">{error.title}</p> : ""}

        <div className="button-container">
          <button className="button">Add workout</button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(false);
            }}
            className="button dismiss"
          >
            Dismiss
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewWorkoutModal;

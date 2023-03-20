// React
import React, { useContext, useEffect } from "react";

// Components
import AddSplitBtn from "./AddSplitBtn";
import NewSplit from "./NewSplitModal.js";

// Components
import { useNavigate } from "react-router-dom";

// Context
import { GlobalContext } from "../../context/GlobalContext.js";

// css
import "./SplitGrid.css";

// image
import calendar from "../../images/calendar.png";

const WorkoutSplitGrid = () => {
  const { isModalOpen } = useContext(GlobalContext);
  const { user } = useContext(GlobalContext);
  const { splits } = useContext(GlobalContext);
  const { getWorkouts } = useContext(GlobalContext);
  const { getSplits } = useContext(GlobalContext);
  const { deleteSplit } = useContext(GlobalContext);
  const { setLoadingTimeout } = useContext(GlobalContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    getSplits();
  }, [user, navigate]);

  const changeRoute = (id) => {
    getWorkouts(id);
    navigate(`/workouts/${id}`);
  };

  const handleDelete = (e, split_id) => {
    if (window.confirm("Are you sure you want to delete this Workout Split?")) {
      deleteSplit(e, split_id);
      setLoadingTimeout();
    }
    e.stopPropagation();
  };

  return (
    <>
      <div className="main-container">
        <div className={`${isModalOpen ? "blurred" : ""}`}>
          <p className="choose">Choose a Workout Split</p>
          <div className="workout-grid">
            {splits.length > 0 &&
              splits.map((el) => {
                return (
                  <ul
                    key={el.split_id}
                    onClick={
                      isModalOpen ? null : () => changeRoute(el.split_id)
                    }
                    className="workout-container"
                  >
                    <div className="image-and-delete-container">
                      <img
                        className="workout-image"
                        src={calendar}
                        alt="Workout"
                      ></img>
                      <button
                        onClick={(e) => handleDelete(e, el.split_id)}
                        className="delete-split"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="workout-card">
                      <li className="workout-card-title">{el.split_name}</li>
                      <li>{el.days} day split:</li>
                      {el.array_agg.map((name) => {
                        return <li> - {name} day</li>;
                      })}
                      <li>--------------------------------</li>
                      <li>Created on: {el.date.slice(0, 10)}</li>
                    </div>
                  </ul>
                );
              })}
          </div>
        </div>
      </div>
      <div className="new-split-add-container">
        <NewSplit />
        <AddSplitBtn />
      </div>
    </>
  );
};

export default WorkoutSplitGrid;

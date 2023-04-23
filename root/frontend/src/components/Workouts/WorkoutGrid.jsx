// React
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

// Components
import NewWorkoutModal from './NewWorkoutModal.jsx';
import AddWorkoutBtn from './AddWorkoutBtn.jsx';
import HelpModal from '../HelpModal/HelpModal';

// Context
import { GlobalContext } from '../../context/GlobalContext';

// css
import './WorkoutGrid.css';

// Image
import logo from '../../images/workout.png';

// services
import workoutServices from '../../services/workoutServices.js';

const WorkoutGrid = () => {
  const { isModalOpen, isMenuOpen } = useContext(GlobalContext);
  const { user } = useContext(GlobalContext);
  const { workouts, setWorkouts } = useContext(GlobalContext);
  const { getPrevTrackData } = useContext(GlobalContext);
  const { deleteWorkout } = useContext(GlobalContext);
  const { setLoading } = useContext(GlobalContext);
  const { getCurrentWorkout } = useContext(GlobalContext);
  const { getCurrentTrackData } = useContext(GlobalContext);

  // state
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // navigate
  const navigate = useNavigate();

  // extract split_id
  const { split_id } = useParams();

  useEffect(() => {
    setLoading(true);
    console.log('Component mounted');
    if (!user && navigate) {
      navigate('/');
    } else {
      workoutServices
        .getWorkouts(split_id)
        .then((workouts) => {
          console.log('woirjouts mounted');
          setLoading(false);
          setWorkouts(workouts);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (workouts.length === 0) {
      setHelpModalOpen(true);
    } else setHelpModalOpen(false);
  }, [workouts]);

  // When card clicked -> change route:
  // 1. get current workout
  // 2. update workout day +1
  // 3. get previous track
  // 4. get new track data
  const changeRoute = function (id) {
    getCurrentWorkout(id);
    getCurrentTrackData(id);
    getPrevTrackData(id);
    navigate(`/workout/${id}`);
  };

  // Delete workout
  const handleDelete = (e, split_id, workout_id) => {
    if (window.confirm('Are you sure you want to delete this Workout?')) {
      deleteWorkout(e, split_id, workout_id);
      setLoading(true);
    }
    e.stopPropagation();
  };

  return (
    <>
      {helpModalOpen ? (
        <HelpModal message={'workouts'} />
      ) : (
        <div className="workoutGrid-main-container">
          <div className={`${isModalOpen || isMenuOpen ? 'blurred' : ''}`}>
            <p className="choose-title">Choose a Workout:</p>
            <div className="exercise-grid">
              {workouts.map((el) => {
                return (
                  <ul key={el.workout_id} className="exercise-list-container">
                    <div className="image-and-delete-container-workout">
                      <img className="exercise-image" src={logo} alt="exercise"></img>
                      <p onClick={(e) => handleDelete(e, split_id, el.workout_id)} className="delete-split">
                        Delete
                      </p>
                    </div>

                    <div className="exercise-card">
                      <li className="exercise-card-title">{el.workout_name}</li>
                      <p>Exercises: </p>
                      {el.array_agg.map((name, index) => {
                        return (
                          <li>
                            {' '}
                            - Exercise {index + 1} : {name}
                          </li>
                        );
                      })}
                    </div>
                    <button className="enter-workout" onClick={() => changeRoute(el.workout_id)}>
                      Choose Workout
                    </button>
                  </ul>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="new-workout-add-container">
        <NewWorkoutModal />
        <AddWorkoutBtn />
      </div>
    </>
  );
};

export default WorkoutGrid;

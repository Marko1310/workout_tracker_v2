// React
import React, { useContext, useEffect, useState } from 'react';

// Components
import AddSplitBtn from './AddSplitBtn';
import NewSplit from './NewSplitModal.jsx';
import HelpModal from '../HelpModal/HelpModal';

// Components
import { useNavigate } from 'react-router-dom';

// Context
import { GlobalContext } from '../../context/GlobalContext';

// css
import './SplitGrid.css';

// image
import calendar from '../../images/calendar.png';

const WorkoutSplitGrid = () => {
  const { isModalOpen, isMenuOpen } = useContext(GlobalContext);
  const { user } = useContext(GlobalContext);
  const { splits } = useContext(GlobalContext);
  const { getWorkouts } = useContext(GlobalContext);
  const { getSplits } = useContext(GlobalContext);
  const { deleteSplit } = useContext(GlobalContext);
  const { setLoadingTimeout } = useContext(GlobalContext);

  // state
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // navigate
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
    getSplits();
  }, [user, navigate]);

  useEffect(() => {
    if (splits.length === 0) {
      setHelpModalOpen(true);
    } else setHelpModalOpen(false);
  }, [splits]);

  const changeRoute = (id) => {
    getWorkouts(id);
    navigate(`/workouts/${id}`);
  };

  const handleDelete = (e, split_id) => {
    if (window.confirm('Are you sure you want to delete this Workout Split?')) {
      deleteSplit(e, split_id);
      setLoadingTimeout();
    }
    e.stopPropagation();
  };

  return (
    <>
      {helpModalOpen ? (
        <HelpModal message={'splits'} />
      ) : (
        <div className="main-container">
          <div className={`${isModalOpen || isMenuOpen ? 'blurred' : ''}`}>
            <p className="choose-title">Choose your Workout Split:</p>
            <div className="workout-grid">
              {splits.length > 0 &&
                splits.map((el) => {
                  return (
                    <ul key={el.split_id} className="workout-container">
                      <div className="image-and-delete-container">
                        <img className="workout-image" src={calendar} alt="Workout"></img>
                        <p onClick={(e) => handleDelete(e, el.split_id)} className="delete-split">
                          Delete
                        </p>
                      </div>
                      <div className="workout-card">
                        <li className="workout-card-title">{el.split_name} workout</li>
                        <li className="workout-card-workouts-days">{el.days} day split:</li>
                        {el.array_agg.map((name, index) => {
                          return (
                            <li className="workout-card-workouts">
                              - Day {index + 1} : {name} day
                            </li>
                          );
                        })}
                      </div>
                      <button className="enter-split" onClick={() => changeRoute(el.split_id)}>
                        Choose Split
                      </button>
                    </ul>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      <div className="new-split-add-container">
        <NewSplit />
        <AddSplitBtn />
      </div>
    </>
  );
};

export default WorkoutSplitGrid;

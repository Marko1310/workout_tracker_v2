// React
import React, { useContext } from 'react';

// Context
import { GlobalContext } from '../../context/GlobalContext';

// css
import './HelpModal.css';

const HelpModal = ({ message }) => {
  // Context
  const { user } = useContext(GlobalContext);

  let text;

  if (message === 'workouts') {
    text = 'Workouts in your Workout Split';
  }
  if (message === 'splits') {
    text = 'Workouts Splits';
  }

  return (
    <div className="helpModal-container">
      {message === 'splits' && <p className="helpModal-title">Hello {user.name}!</p>}
      <br />
      <p className="helpModal-text">
        It looks like you still don't have any {text}.
        <br />
        <br />
        Start by creating one by pressing the button below.
        <br />
        <br />
        Good luck with your training!
      </p>
    </div>
  );
};

export default HelpModal;

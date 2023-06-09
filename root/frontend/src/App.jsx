// React
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// css
import './index.css';

// Components
import Navigation from './components/Navigation/Navigation';
import Login from './components/Login/Login';
import Workout from './components/Workouts/Workout';
import SplitGrid from './components/Splits/SplitGrid';
import WorkoutGrid from './components/Workouts/WorkoutGrid';
import NotFound from './components/NotFound/NotFound';
import Loading from './components/Loading/Loading';

// Context
import { GlobalContext } from './context/GlobalContext';

function App() {
  const { loading } = useContext(GlobalContext);
  const { user } = useContext(GlobalContext);

  return (
    <Router>
      <div className="App">
        <div className="content">
          {user && <Navigation />}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="dashboard" element={<SplitGrid />} />
            <Route path="workouts/:split_id" element={<WorkoutGrid />} />
            <Route path="workout/:id" element={<Workout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

//React
import { NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

//css
import './Navigation.css';

// Context
import { GlobalContext } from '../../context/GlobalContext';

const Navigation = () => {
  // Context
  const { user } = useContext(GlobalContext);
  const { logout } = useContext(GlobalContext);
  const { setLoadingTimeout } = useContext(GlobalContext);

  // current location
  const location = useLocation();
  const currentRoute = location.pathname;

  const handleLogout = (e) => {
    e.preventDefault();
    setLoadingTimeout();
    logout();
  };

  const [navigationTitle, setNavigationTitle] = useState('');

  useEffect(() => {
    if (currentRoute.includes('dashboard')) setNavigationTitle('Dashboard');
    else if (currentRoute.includes('workouts')) setNavigationTitle('Workouts');
    else if (currentRoute.includes('workout')) setNavigationTitle('Workout');
  }, [currentRoute]);

  return (
    <div className="navigation-container">
      <div className="navigation">{navigationTitle}</div>
      <div className="links">
        <p className="navigation-user">{user.email}</p>
        <NavLink to="/dashboard">Home</NavLink>
        <NavLink onClick={(e) => handleLogout(e)} to="/">
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default Navigation;

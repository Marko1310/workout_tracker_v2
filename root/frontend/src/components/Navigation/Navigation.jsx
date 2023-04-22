//React
import { NavLink } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// components
import Popmenu from './Popmenu';

//css
import './Navigation.css';

// Context
import { GlobalContext } from '../../context/GlobalContext';

// icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

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

  // state
  const [navigationTitle, setNavigationTitle] = useState('');
  // const [menuOpen, setMenuOpen] = useState(false);
  const { menuOpen, setMenuOpen } = useContext(GlobalContext);

  useEffect(() => {
    if (currentRoute.includes('dashboard')) setNavigationTitle('Dashboard');
    else if (currentRoute.includes('workouts')) setNavigationTitle('Workouts');
    else if (currentRoute.includes('workout')) setNavigationTitle('Workout');
  }, [currentRoute]);

  return (
    <div className="navigation-container">
      <div className="navigation">{navigationTitle}</div>
      <div className="user-links">
        <p className="navigation-user">{user.email}</p>
        <div className="links">
          <NavLink to="/dashboard">Home</NavLink>
          <NavLink onClick={(e) => handleLogout(e)} to="/">
            Logout
          </NavLink>
        </div>
      </div>
      <FontAwesomeIcon
        icon={faBars}
        style={{ color: '#ffffff', fontSize: '1.5rem' }}
        className="menu-bar"
        onClick={() => setMenuOpen(true)}
      />
      <Popmenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </div>
  );
};

export default Navigation;

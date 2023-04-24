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

// services
import userServices from '../../services/userServices';

const Navigation = () => {
  // Context
  const { user, setUser } = useContext(GlobalContext);
  const { logout } = useContext(GlobalContext);
  const { setLoadingTimeout, timeout, setLoading } = useContext(GlobalContext);
  const { splits } = useContext(GlobalContext);

  // current location
  const location = useLocation();
  const currentRoute = location.pathname;

  const handleLogout = (e) => {
    e.preventDefault();
    // setLoadingTimeout();
    userServices
      .logout()
      .then(() => {
        console.log('bbb');
        setUser(null);
        // clearTimeout(timeout);
        // setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // clearTimeout(timeout);
        // setLoading(false);
      });
  };

  // state
  const [navigationTitle, setNavigationTitle] = useState('');
  // const [menuOpen, setMenuOpen] = useState(false);
  const { isMenuOpen, setIsMenuOpen } = useContext(GlobalContext);

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
        onClick={() => setIsMenuOpen(true)}
      />
      <Popmenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} handleLogout={handleLogout} />
    </div>
  );
};

export default Navigation;

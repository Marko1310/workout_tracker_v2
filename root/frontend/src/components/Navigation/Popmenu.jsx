//React
import { NavLink } from 'react-router-dom';

// css
import './Popmenu.css';

// images
import x from '../../images/close-button.png';

// Contex
import { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';

const Popmenu = ({ menuOpen, setMenuOpen, setIsModalOpen }) => {
  // const { menuOpen, setMenuOpen, inventory } = useContext(GlobalContext);

  const { user } = useContext(GlobalContext);

  return (
    <div className={`popmenu ${menuOpen ? 'open' : 'close'}`}>
      <div className="x-container">
        <p className="navigation-user black">{user.email}</p>
        <img className="x" alt="x" src={x} onClick={() => setMenuOpen(false)} />
      </div>

      <div className="popmenu-tags-container">
        <NavLink className="popmenu-tags" to="/dashboard">
          Home
        </NavLink>
        <NavLink className="popmenu-tags" onClick={(e) => handleLogout(e)} to="/">
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default Popmenu;

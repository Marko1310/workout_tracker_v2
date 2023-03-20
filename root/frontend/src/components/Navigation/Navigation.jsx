//React
import { NavLink } from "react-router-dom";
import { useContext } from "react";

//css
import "./Navigation.css";

// Images
import logo from "../../images/workout-icon.jpg";

// Context
import { GlobalContext } from "../../context/GlobalContext";

const Navigation = () => {
  // Context
  const { user } = useContext(GlobalContext);
  const { logout } = useContext(GlobalContext);
  const { setLoadingTimeout } = useContext(GlobalContext);

  const handleLogout = (e) => {
    e.preventDefault();
    setLoadingTimeout();
    logout();
  };

  return (
    <div className="navigation-container">
      <div className="user">
        <img className="navigation-logo" src={logo} alt="Logo" />
        {user && <div className="navigation-user">Hello {user.name}</div>}
      </div>
      {user && (
        <div className="links">
          <NavLink to="/dashboard">Home</NavLink>
          <NavLink onClick={(e) => handleLogout(e)} to="/">
            Logout
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Navigation;

// css
import './Popmenu.css';

// images
import x from '../../images/close-button.png';

// Contex
import { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';

const Popmenu = ({ menuOpen, setMenuOpen }) => {
  // const { menuOpen, setMenuOpen, inventory } = useContext(GlobalContext);

  return (
    <div className={`popmenu ${menuOpen ? 'open' : 'close'}`}>
      <div className="x-container">
        <img className="x" alt="x" src={x} onClick={() => setMenuOpen(false)} />
      </div>
      <div className="popmenu-tags-container">
        {/* {inventory.map((el) => {
          return (
            <a className="popmenu-tags" key={el.id} href={`#${el.id}`} onClick={() => setMenuOpen(false)}>
              {el.title}
            </a>
          );
        })} */}
      </div>
    </div>
  );
};

export default Popmenu;

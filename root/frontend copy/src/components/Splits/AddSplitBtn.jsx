// React
import { useContext } from "react";

// css
import "./AddSplitBtn.css";
import addLogo from "../../images/plus-circle.png";

// Context
import { GlobalContext } from "../../context/GlobalContext";

const AddNewWorkoutBtn = () => {
  const { isModalOpen, setIsModalOpen } = useContext(GlobalContext);

  return (
    <div className={`addNewWorkout-container ${isModalOpen ? `blurred` : ""}`}>
      <img
        onClick={isModalOpen ? null : () => setIsModalOpen(true)}
        className="addLogo"
        alt="addLogo"
        src={addLogo}
      />
      <p>Add new workout split</p>
    </div>
  );
};

export default AddNewWorkoutBtn;

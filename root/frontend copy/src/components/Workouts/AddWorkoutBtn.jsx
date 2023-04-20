// React
import { useContext } from "react";

// css
import "./AddWorkoutBtn.css";

// Context
import { GlobalContext } from "../../context/GlobalContext";

// Image
import addLogo from "../../images/plus-circle.png";

const AddWorkoutBtn = () => {
  const { isModalOpen, setIsModalOpen } = useContext(GlobalContext);
  const { setError } = useContext(GlobalContext);

  const handleModal = () => {
    setError("");
    setIsModalOpen((setIsModalOpen) => !setIsModalOpen);
  };

  return (
    <div className={`addNewExercise-container ${isModalOpen ? `blurred` : ""}`}>
      <img
        onClick={() => handleModal()}
        className="addLogo"
        alt="addLogo"
        src={addLogo}
      />
      <p>Add new workout</p>
    </div>
  );
};

export default AddWorkoutBtn;

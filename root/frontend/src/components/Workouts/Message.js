// React
import React, { useContext } from "react";

// Context
import { GlobalContext } from "../../context/GlobalContext";

// css
import "./Message.css";

// image
import success from "../../images/success.png";
import errorImg from "../../images/error.png";

const NewExerciseModal = ({ successMsg }) => {
  const { isModalOpen } = useContext(GlobalContext);

  return (
    <div
      className={`message-container ${isModalOpen && successMsg ? "show" : ""}`}
    >
      {successMsg === "success" && (
        <div className="success-images-container">
          <img className="success-image" src={success} alt="success"></img>
          <p className="message-title">Workout saved</p>
        </div>
      )}
      {successMsg === "error" && (
        <div className="success-images-container">
          <img className="error-image" src={errorImg} alt="error"></img>
          <p className="message-title">Error</p>
        </div>
      )}
    </div>
  );
};

export default NewExerciseModal;

import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

//create context
export const GlobalContext = createContext();

// const API_URL = "https://workouttracker-server.onrender.com";
const API_URL = "http://localhost:8000";

//provider component
export const GlobalProvider = (props) => {
  const [form, setForm] = useState("login");
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [prevTrackData, setPrevTrackData] = useState([]);
  const [currentTrackData, setCurrentTrackData] = useState(null);
  const [user, setUser] = useState(null);
  const [splits, setSplits] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getCurrentUser();
  }, []);

  let timeout;
  const setLoadingTimeout = () => {
    timeout = setTimeout(() => {
      setLoading(true);
    }, 1000);
  };

  ///////////////////////////// USER ////////////////////////////
  const getCurrentUser = () => {
    axios
      .get(`${API_URL}/api/auth/current`, {
        withCredentials: true,
      })
      .then((user) => {
        if (!user) {
          setUser(null);
        } else {
          setUser(user.data);
          axios
            .get(`${API_URL}/api/auth/splits/current`, {
              withCredentials: true,
            })
            .then(() => {
              setLoading(false);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logout = () => {
    axios
      .get(`${API_URL}/api/auth/logout`, {
        withCredentials: true,
      })
      .then(() => {
        setUser(null);
        clearTimeout(timeout);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        clearTimeout(timeout);
        setLoading(false);
      });
  };

  ///////////////////////////// RETRIEVE DATA ////////////////////////////
  const getSplits = () => {
    axios
      .get(`${API_URL}/api/auth/splits/current`, {
        withCredentials: true,
      })
      .then((data) => {
        setSplits(data.data);
        clearTimeout(timeout);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getWorkouts = (split_id) => {
    axios
      .get(`${API_URL}/api/auth/splits/workouts/${split_id}`, {
        withCredentials: true,
      })
      .then((data) => {
        setWorkouts(data.data);
        clearTimeout(timeout);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getCurrentWorkout = (workout_id) => {
    axios
      .get(`${API_URL}/api/auth/splits/workout/${workout_id}`, {
        withCredentials: true,
      })
      .then((data) => {
        setCurrentWorkout(data.data[0]);
        clearTimeout(timeout);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getPrevTrackData = (workout_id) => {
    axios
      .get(
        `${API_URL}/api/auth/splits/workouts/exercises/prevData/${workout_id}`,
        {
          withCredentials: true,
        }
      )
      .then((data) => {
        setPrevTrackData(data.data);
        clearTimeout(timeout);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getCurrentTrackData = (workout_id) => {
    axios
      .get(
        `${API_URL}/api/auth/splits/workouts/exercises/currentData/${workout_id}`,
        {
          withCredentials: true,
        }
      )
      .then((data) => {
        const newArray = [];
        data.data.map((el) => {
          el.trackdata.map((data) => newArray.push(data));
        });
        setCurrentTrackData(newArray);
        clearTimeout(timeout);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  ///////////////////////////// ADD DATA ////////////////////////////
  const addSplit = (e, title, days) => {
    e.preventDefault();
    axios
      .post(
        `${API_URL}/api/auth/split/new`,
        { title, days },
        { withCredentials: true }
      )
      .then((data) => {
        if (data) {
          setIsModalOpen(false);
          getSplits();
        }
      })
      .catch((error) => {
        setError(error.response.data);
        setLoading(false);
      });
  };

  const addWorkout = (e, title, split_id) => {
    axios
      .post(
        `${API_URL}/api/auth/split/workout/new`,
        { title, split_id },
        { withCredentials: true }
      )
      .then(() => {
        getWorkouts(split_id);
        setIsModalOpen(false);
      })
      .catch((error) => {
        setError(error.response.data);
        setLoading(false);
      });
  };

  const addExercise = (e, title, goal_sets, goal_reps, workout_id) => {
    e.preventDefault();
    axios
      .post(
        `${API_URL}/api/auth/split/workout/exercise/new`,
        { title, goal_sets, goal_reps, workout_id },
        { withCredentials: true }
      )
      .then(() => {
        setIsModalOpen(false);
        getPrevTrackData(workout_id);
      })
      .catch((error) => {
        setError(error.response.data);
        setLoading(false);
      });
  };

  const addNewSet = (exercise_id, workout_id, day) => {
    axios
      .post(
        `${API_URL}/api/auth/split/workout/exercise/set/new`,
        { exercise_id, workout_id, day },
        { withCredentials: true }
      )
      .then((data) => {
        getPrevTrackData(workout_id);
        setCurrentTrackData((prevData) => [...prevData, data.data[0]]);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const addTrackData = async (workout_id) => {
    try {
      const response = axios.post(
        `${API_URL}/api/auth/split/workout/exercise/track`,
        { workout_id, currentTrackData },
        { withCredentials: true }
      );
      getPrevTrackData(workout_id);

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateWorkoutDay = (workout_id) => {
    axios
      .post(
        `${API_URL}/api/auth/split/workout/editDay`,
        { workout_id },
        { withCredentials: true }
      )
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  ///////////////////////////// DELETE DATA ////////////////////////////
  const deleteSplit = (e, split_id) => {
    e.preventDefault();

    fetch(`${API_URL}/api/auth/split/delete`, {
      method: "DELETE",
      credentials: "include", // include cookies in the request
      body: JSON.stringify({ split_id: split_id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        getSplits();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const deleteWorkout = (e, split_id, workout_id) => {
    e.preventDefault();

    fetch(`${API_URL}/api/auth/split/workout/delete`, {
      method: "DELETE",
      credentials: "include", // include cookies in the request
      body: JSON.stringify({ split_id: split_id, workout_id: workout_id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        getWorkouts(split_id);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const deleteExercise = (e, workout_id, exercise_id) => {
    e.preventDefault();

    fetch(`${API_URL}/api/auth/split/workout/exercise/delete`, {
      method: "DELETE",
      credentials: "include", // include cookies in the request
      body: JSON.stringify({
        workout_id: workout_id,
        exercise_id: exercise_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        getPrevTrackData(workout_id);
        const newArray = currentTrackData.filter(
          (el) => el.exercise_id !== data[0].exercise_id
        );
        setCurrentTrackData(newArray);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const deleteSet = (e, workout_id, exercise_id, track_id) => {
    e.preventDefault();

    fetch(`${API_URL}/api/auth/split/workout/exercise/set/delete`, {
      method: "DELETE",
      credentials: "include", // include cookies in the request
      body: JSON.stringify({
        workout_id: workout_id,
        exercise_id: exercise_id,
        track_id: track_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const newArray = currentTrackData.filter(
          (el) => el.track_id !== data[0].track_id
        );
        setCurrentTrackData(newArray);
        getPrevTrackData(workout_id);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const globalState = {
    user,
    setUser,
    setLoadingTimeout,
    splits,
    setSplits,
    workouts,
    setWorkouts,
    prevTrackData,
    getCurrentUser,
    logout,
    getSplits,
    getWorkouts,
    getCurrentWorkout,
    getCurrentTrackData,
    getPrevTrackData,
    loading,
    addSplit,
    addWorkout,
    addExercise,
    addNewSet,
    deleteSplit,
    deleteWorkout,
    deleteExercise,
    deleteSet,
    isModalOpen,
    setIsModalOpen,
    setLoading,
    error,
    setError,
    currentWorkout,
    addTrackData,
    setCurrentTrackData,
    currentTrackData,
    updateWorkoutDay,
    timeout,
    errors,
    setErrors,
    form,
    setForm,
    input,
    setInput,
  };

  return (
    <GlobalContext.Provider value={globalState}>
      {props.children}
    </GlobalContext.Provider>
  );
};

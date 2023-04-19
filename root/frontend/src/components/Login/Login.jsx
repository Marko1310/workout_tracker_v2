// React
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { images } from "./images";

// Context
import { GlobalContext } from "../../context/GlobalContext";

// const API_URL = "https://workouttracker-server.onrender.com";
const API_URL = "http://localhost:8000";

// images
import logo from "../../images/workout-icon.jpg";

function Login() {
  // States
  const { user } = useContext(GlobalContext);
  const { input, setInput } = useContext(GlobalContext);
  const { form, setForm } = useContext(GlobalContext);
  const { setLoading } = useContext(GlobalContext);
  const { getCurrentUser } = useContext(GlobalContext);
  const { errors, setErrors } = useContext(GlobalContext);

  // Routing
  const navigate = useNavigate();

  useEffect(() => {
    if (user && navigate) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  let timeout;
  const setLoadingTimeout = () => {
    timeout = setTimeout(() => {
      setLoading(true);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingTimeout();
    let data = {};

    if (form === "signup") {
      data = {
        name: input.name,
        email: input.email,
        password: input.password,
      };
    } else {
      data = {
        email: input.email,
        password: input.password,
      };
    }
    axios
      .post(
        form === "signup"
          ? `${API_URL}/api/auth/register`
          : `${API_URL}/api/auth/login`,
        data,
        { withCredentials: true }
      )
      .then((res) => {
        getCurrentUser();
        clearTimeout(timeout);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setErrors(error.response.data);
        clearTimeout(timeout);
        setLoading(false);
      });
  };

  // return (
  //   <div>
  //     <form onSubmit={(e) => handleSubmit(e)} className="form-validate">
  //       <p className="title">{form === "login" ? `Login` : `Signup`}</p>
  //       <div className="buttons-container">
  //         <button
  //           onClick={(e) => {
  //             setForm("login");
  //             setErrors({});
  //             e.preventDefault();
  //           }}
  //           className={`loginButtons ${form === "login" ? "current" : ""}`}
  //         >
  //           Login
  //         </button>
  //         <button
  //           onClick={(e) => {
  //             setForm("signup");
  //             setErrors({});
  //             e.preventDefault("signup");
  //           }}
  //           className={`loginButtons ${form === "signup" ? "current" : ""}`}
  //         >
  //           Signup
  //         </button>
  //       </div>

  //       {form === "signup" && (
  //         <>
  //           <label htmlFor="name"></label>
  //           <input
  //             onChange={(e) =>
  //               setInput((prevInput) => ({
  //                 ...prevInput,
  //                 name: e.target.value,
  //               }))
  //             }
  //             className="login-forms"
  //             type="text"
  //             id="fname"
  //             name="fname"
  //             placeholder="Name"
  //             value={input.name}
  //           ></input>
  //           {errors.name && form === "signup" && (
  //             <p className="error">{errors.name}</p>
  //           )}
  //         </>
  //       )}

  //       <label htmlFor="email"></label>
  //       <input
  //         onChange={(e) =>
  //           setInput((prevInput) => ({
  //             ...prevInput,
  //             email: e.target.value,
  //           }))
  //         }
  //         className="login-forms"
  //         type="text"
  //         id="email"
  //         name="email"
  //         placeholder="Email"
  //         value={input.email}
  //       ></input>
  //       {errors.email && form === "signup" && (
  //         <p className="error">{errors.email}</p>
  //       )}

  //       <label htmlFor="password"></label>
  //       <input
  //         onChange={(e) =>
  //           setInput((prevInput) => ({
  //             ...prevInput,
  //             password: e.target.value,
  //           }))
  //         }
  //         className="login-forms"
  //         type="password"
  //         placeholder="Password"
  //         value={input.password}
  //       ></input>
  //       {errors.password && form === "signup" && (
  //         <p className="error">{errors.password}</p>
  //       )}
  //       {errors && form === "login" && <p className="error">{errors.error}</p>}
  //       {errors && form === "signup" && (
  //         <p className="error">{errors.existing}</p>
  //       )}

  //       <button className="login-button">
  //         {form === "login" ? "Login" : "Register"}
  //       </button>
  //       {form === "login" && (
  //         <div className="login-footer">
  //           <p>Not a member? </p>
  //           <a onClick={() => setForm("signup")} className="sign-up">
  //             Sign up now
  //           </a>
  //         </div>
  //       )}
  //     </form>
  //   </div>
  // );

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-3 overflow-hidden h-screen">
      <div className="lg:col-span-2 md:col-span-1 overflow-hidden ">
        <img
          className="relative top-1/2 transform -translate-y-1/2 w-full h-full  object-cover "
          src={images[Math.floor(Math.random() * 7)].img}
        ></img>
      </div>
      <div className="lg:col-span-1 md:col-span-2 flex flex-col pt-10 shadow-md shadow-left h-screen justify-start items-center font-nanum text-gray-600">
        <div className="flex flex-row justify-center items-center gap-6 mb-10">
          <img className="h-12 w-12" src={logo} alt="logo" />
          <p className="inline-block font-bold text-xl text-gray-700">
            Workout Tracker App
          </p>
        </div>
        <p className="text-4xl font-light text-gray-700">
          {form === "login" ? `Login` : `Signup`}
        </p>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="bg-white px-8 pt-6 pb-8 mb-4 w-full"
        >
          {form === "signup" && (
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                for="name"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-14 focus: border-grey-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 hover:border-gray-800 transition ease-out duration-500"
                id="email"
                type="text"
                placeholder="Name"
                value={input.name}
                onChange={(e) =>
                  setInput((prevInput) => ({
                    ...prevInput,
                    name: e.target.value,
                  }))
                }
              />
              {errors.name && form === "signup" && (
                <p className="text-red-500 text-xs italic">{errors.name}</p>
              )}
            </div>
          )}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-14 focus: border-grey-900 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 hover:border-gray-800 transition ease-out duration-500"
              id="email"
              type="text"
              placeholder="Email adress"
              value={input.email}
              onChange={(e) =>
                setInput((prevInput) => ({
                  ...prevInput,
                  email: e.target.value,
                }))
              }
            />
            {errors.email && form === "signup" && (
              <p className="text-red-500 text-xs italic">{errors.email}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline h-14 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 hover:border-gray-800 transition ease-out duration-500"
              id="password"
              type="password"
              placeholder="******************"
              value={input.password}
              onChange={(e) =>
                setInput((prevInput) => ({
                  ...prevInput,
                  password: e.target.value,
                }))
              }
            />
            {errors.password && form === "signup" && (
              <p className="text-red-500 text-xs italic">{errors.password}</p>
            )}
            {errors && form === "login" && (
              <p className="text-red-500 text-xs italic">{errors.error}</p>
            )}
          </div>

          <button
            className="bg-gray-200 hover:bg-gray-700 hover:text-white w-full text-gray-400 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition ease-out duration-500"
            type="submit"
          >
            {form === "login" ? `Login` : `Signup`}
          </button>
          <div className="flex justify-end">
            <a
              className=" text-right font-bold text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition ease-out duration-500 mt-4"
              onClick={(e) => {
                setForm((prevForm) =>
                  prevForm === "signup" ? "login" : "signup"
                );
                setErrors({});
                setInput({
                  name: "",
                  email: "",
                  password: "",
                });
                e.preventDefault();
              }}
            >
              {form === "signup"
                ? "Already have an account? Login"
                : "Dont't have an account? Sign up"}
            </a>
          </div>
        </form>
        {errors && form === "signup" && (
          <p className="text-red-500 text-xs italic">{errors.existing}</p>
        )}
      </div>
    </div>
  );
}

export default Login;

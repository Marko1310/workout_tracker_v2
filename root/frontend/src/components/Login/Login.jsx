// React
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// const API_URL = 'http://localhost:8000';

// images
import { images } from './images';

// css
import './Login.css';

// Context
import { GlobalContext } from '../../context/GlobalContext';

import Loading from '../Loading/Loading';

// images
import logo from '../../images/workout-icon.jpg';

// services
import loginServices from '../../services/loginServices';
import signupServices from '../../services/signupServices';
import userServices from '../../services/userServices';

function Login() {
  // Global context
  const { user, setUser } = useContext(GlobalContext);
  const { loading, setLoading } = useContext(GlobalContext);
  // const { getCurrentUser } = useContext(GlobalContext);

  // States
  const [backgroundImage, setBackgroundImage] = useState('');
  const [input, setInput] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [form, setForm] = useState('login');
  const [errors, setErrors] = useState({});

  // Routing
  const navigate = useNavigate();

  useEffect(() => {
    setBackgroundImage(images[Math.floor(Math.random() * 7)].img);
  }, []);

  useEffect(() => {
    // setLoading(true);
    if (user && navigate) {
      // setLoading(false);
      navigate('/dashboard');
    }
    // setLoading(false);
  }, [user, navigate]);

  let timeout;
  const setLoadingTimeout = () => {
    timeout = setTimeout(() => {
      setLoading(true);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // setLoadingTimeout();
    let data = {};

    // if (form === 'signup') {
    //   data = {
    //     name: input.name,
    //     email: input.email,
    //     password: input.password,
    //   };

    //   signupServices
    //     .signup(data)
    //     .then(() => {
    //       getCurrentUser();
    //       clearTimeout(timeout);
    //       setLoading(false);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       setErrors(error.response.data);
    //       clearTimeout(timeout);
    //       setLoading(false);
    //     });
    // }

    if (form === 'login') {
      data = {
        email: input.email,
        password: input.password,
      };
      loginServices
        .login(data)
        .then((response) => {
          console.log(response);
          setUser(response.data.user);
          // userServices.getCurrentUser().then((data) => {
          //   console.log(data);
          //   if (!user) {
          //     setUser(null);
          //   } else {
          //     setUser(user);
          //     // axios
          //     //   .get(`${API_URL}/api/auth/splits/current`, {
          //     //     withCredentials: true,
          //     //   })
          //     //   .then(() => {
          //     //     setLoading(false);
          //     //   })
          //     //   .catch((error) => {
          //     //     console.log(error);
          //     //   });
          //   }
          // });
          // clearTimeout(timeout);
          // setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setErrors(error.response.data);
          clearTimeout(timeout);
          setLoading(false);
        });
    }
    // axios
    //   .post(form === 'signup' ? `${API_URL}/api/auth/register` : `${API_URL}/api/auth/login`, data, {
    //     withCredentials: true,
    //   })
    //   .then(() => {
    //     getCurrentUser();
    //     clearTimeout(timeout);
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     setErrors(error.response.data);
    //     clearTimeout(timeout);
    //     setLoading(false);
    //   });
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="login-container">
      <div className="image-container">
        <img
          className="image-login"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      </div>
      <form className="form-container" onSubmit={(e) => handleSubmit(e)}>
        <div className="form-title-container">
          <img src={logo} alt="logo" className="form-image" />
          <p className="app-title">Workout Tracker</p>
        </div>
        <p className="form-title">{form === 'login' ? `Login` : `Signup`}</p>

        <div className="input-container">
          {form === 'signup' && (
            <>
              <label htmlFor="name"></label>
              <input
                onChange={(e) =>
                  setInput((prevInput) => ({
                    ...prevInput,
                    name: e.target.value,
                  }))
                }
                className="login-forms"
                type="text"
                id="fname"
                name="fname"
                placeholder="Name"
                value={input.name}
              ></input>
              {errors.name && form === 'signup' && <p className="error">{errors.name}</p>}
            </>
          )}

          <label htmlFor="email"></label>
          <input
            onChange={(e) =>
              setInput((prevInput) => ({
                ...prevInput,
                email: e.target.value,
              }))
            }
            className="login-forms"
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            value={input.email}
          ></input>
          {errors.email && form === 'signup' && <p className="error">{errors.email}</p>}

          <label htmlFor="password"></label>
          <input
            onChange={(e) =>
              setInput((prevInput) => ({
                ...prevInput,
                password: e.target.value,
              }))
            }
            className="login-forms"
            type="password"
            placeholder="Password"
            value={input.password}
          ></input>
          {errors.password && form === 'signup' && <p className="error">{errors.password}</p>}
          {errors && form === 'login' && <p className="error">{errors.error}</p>}
          {errors && form === 'signup' && <p className="error">{errors.existing}</p>}
        </div>

        <button className="login-button">{form === 'login' ? 'Login' : 'Register'}</button>
        {form === 'login' ? (
          <div className="login-footer">
            <p>Not a member? </p>
            <a onClick={() => setForm('signup')} className="sign-up">
              Sign up now
            </a>
          </div>
        ) : (
          <div className="login-footer">
            <p>Already a member? </p>
            <a onClick={() => setForm('login')} className="sign-up">
              Login
            </a>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;

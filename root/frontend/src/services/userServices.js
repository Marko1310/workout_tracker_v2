import { API_URL } from './serverConfig';

import axios from 'axios';

const getCurrentUser = () => {
  return axios
    .get(`${API_URL}/api/auth/current`, {
      withCredentials: true,
    })
    .then((user) => {
      return user.data;
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

export default {
  getCurrentUser,
  logout,
};

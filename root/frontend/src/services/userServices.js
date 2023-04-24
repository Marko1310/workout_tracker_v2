import { API_URL } from './serverConfig';

import axios from 'axios';

const getCurrentUser = () => {
  return axios
    .get(`${API_URL}/api/auth/current`, {
      withCredentials: true,
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const logout = async () => {
  return axios.get(`${API_URL}/api/auth/logout`, {
    withCredentials: true,
  });
};

export default {
  getCurrentUser,
  logout,
};

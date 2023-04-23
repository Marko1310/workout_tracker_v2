import { API_URL } from './serverConfig';
import axios from 'axios';

const getWorkouts = (split_id) => {
  return axios
    .get(`${API_URL}/api/auth/splits/workouts/${split_id}`, {
      withCredentials: true,
    })
    .then((data) => {
      return data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export default { getWorkouts };

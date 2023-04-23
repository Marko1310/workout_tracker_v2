import { API_URL } from './serverConfig';
import axios from 'axios';

const getSplits = () => {
  return axios
    .get(`${API_URL}/api/auth/splits/current`, {
      withCredentials: true,
    })
    .then((data) => {
      console.log(data);
      return data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export default { getSplits };

import { API_URL } from './serverConfig';
import axios from 'axios';

const signup = (data) => {
  return axios.post(`${API_URL}/api/auth/register`, data, {
    withCredentials: true,
  });
  // .then(() => {
  //   getCurrentUser();
  //   clearTimeout(timeout);
  //   setLoading(false);
  // })
  // .catch((error) => {
  //   console.log(error);
  //   setErrors(error.response.data);
  //   clearTimeout(timeout);
  //   setLoading(false);
  // });
};

export default { signup };

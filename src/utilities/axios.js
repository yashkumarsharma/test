import axios from 'axios';

import { apiHost } from '../config';

const axiosInstance = axios.create({
  baseURL: apiHost,
});

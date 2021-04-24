import axios from 'axios'

import { apiHost } from '../config'

export const axiosInstance = axios.create({
  baseURL: apiHost,
})

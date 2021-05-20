import axios from 'axios'
import Config from 'react-native-config'
import AsyncStorage from '@react-native-community/async-storage'

export const axiosInstance = axios.create({
  baseURL: Config.API_HOST,
})

const getToken = async () => {
  try {
    const storedUser = await AsyncStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      return user?.id_token
    }
  } catch (err) {
    console.warn('Error while fetching user from Asycnstorage')
  }
}

export async function getApi (url) {
  const token = await getToken()
  return axiosInstance.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    params: { uniqid: Date.now() },
  })
}

export async function postApi (url, data) {
  const token = await getToken()
  return axiosInstance.post(url, data, {
    headers: { Authorization: `Bearer ${token}` },
    params: { uniqid: Date.now() },
  })
}

export function getUrl (courseUUID, sectionUUID = courseUUID) {
  return `/dato/files/${courseUUID}/${sectionUUID}`
}

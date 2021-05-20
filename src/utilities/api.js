import axios from 'axios'
import Config from 'react-native-config'
import { getApi, getUrl, postApi } from '../utilities/axios'

export const login = async (username, password) => {
  try {
    const queryData = {
      username,
      password,
      client_id: Config.AUTH0_CLIENT_ID,
      grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
      realm: 'Username-Password-Authentication',
    }

    const { data } = await axios.post(
      `https://${Config.AUTH0_DOMAIN}/oauth/token`,
      queryData,
    )
    return data
  } catch (e) {
    return e.response?.data
  }
}

export async function getStudentCourses () {
  try {
    const { data } = await getApi('/student/courses')
    return data
  } catch (e) {
    console.log(e.response.data)
  }
}

export async function loadSectionData (activeCourseUUID, uuid) {
  const url = getUrl(activeCourseUUID, uuid)
  const { data } = await getApi(url)
  return data
}

export async function getCourseData (courseUuid) {
  const url = getUrl(courseUuid)
  const { data } = await getApi(url)
  return data
}

export async function setMyScriptData (id, body) {
  try {
    const { data } = await postApi(`/my-script/${id}`, body)
    return data
  } catch (e) {
    console.log(e.response.data)
  }
}

export async function getMyScriptData () {
  const { data } = await getApi('/my-script')
  return data
}

import axios from 'axios'
import Config from 'react-native-config'

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
    console.log(data)
    return data
  } catch (e) {
    return e.response?.data
  }
}

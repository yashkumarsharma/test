import AsyncStorage from '@react-native-community/async-storage'
import { getStudentCourses } from '../../utilities/api'

export const getCourses = async (dispatch) => {
  dispatch({ type: 'FETCH_COURSES_START' })
  const { courses } = await getStudentCourses()
  dispatch({ type: 'FETCH_COURSES_SUCCESS', courses })
}

export const onSignOut = async (dispatch) => {
  await AsyncStorage.removeItem('user')
  dispatch({ type: 'SIGN_OUT' })
}

export const loadUser = async (dispatch) => {
  try {
    const storedUser = await AsyncStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      dispatch({ type: 'FETCH_USER_SUCCESS', user })
      getCourses(dispatch)
    } else {
      dispatch({ type: 'FETCH_USER_FAIL' })
    }
  } catch (err) {
    console.warn('Error while fetching user from Asycnstorage')
  }
}

export const setUser = (user, dispatch) => {
  dispatch({ type: 'SET_USER', user })
  getCourses(dispatch)
}

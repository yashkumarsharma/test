import React, { createContext, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-community/async-storage'
import { getStudentCourses } from '../../utilities/api'
import reducer from './reducer'

export const AppContext = createContext()

const ContextProvider = ({ children }) => {
  const initialState = {
    isLogin: false,
    isAppReady: false,
    courses: {
      loading: false,
      data: [],
    },
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    loadUser()
  }, [])

  const getCourses = async () => {
    dispatch({ type: 'FETCH_COURSES_START' })
    const { courses } = await getStudentCourses()
    dispatch({ type: 'FETCH_COURSES_SUCCESS', courses })
  }

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        dispatch({ type: 'FETCH_USER_SUCCESS', user })
        getCourses()
      } else {
        dispatch({ type: 'FETCH_USER_FAIL' })
      }
    } catch (err) {
      console.warn('Error while fetching user from Asycnstorage')
    }
  }

  const setUser = (user) => {
    dispatch({ type: 'SET_USER', user })
    getCourses()
  }

  const onSignOut = async () => {
    await AsyncStorage.removeItem('user')
    dispatch({ type: 'SIGN_OUT' })
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUser: setUser,
        getCourses,
        onSignOut,
      }}>
      {children}
    </AppContext.Provider>
  )
}

ContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default ContextProvider

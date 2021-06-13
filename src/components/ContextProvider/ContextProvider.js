import React, { createContext, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-community/async-storage'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

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
    downloads: {},
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    loadUser()
    loadDownloadsData()
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

  const loadDownloadsData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('downloads')
      if (storedData) {
        const data = JSON.parse(storedData)
        dispatch({ type: 'SET_DOWNLOADS_DATA', data })
      }
    } catch (err) {
      console.warn('Error while fetching downloads data from Asycnstorage')
    }
  }

  const updateDownloadsSize = data => {
    // Data will be present on last level
    // Sum it up and update the parent nodes
    for (const [courseId, course] of Object.entries(data)) {
      const chapters = course.chapters
      let courseSize = 0
      for (const [chapterId, chapter] of Object.entries(chapters)) {
        const sections = chapter.sections
        let chapterSize = 0
        for (const [sectionId, section] of Object.entries(sections)) {
          const videos = section.videos
          let sectionSize = 0
          for (const [videoId, video] of Object.entries(videos)) {
            console.log('videoId', videoId)
            sectionSize += video.size
          }
          sections[sectionId].size = sectionSize
          chapterSize += sectionSize
        }
        chapters[chapterId].size = chapterSize
        courseSize += chapterSize
      }
      data[courseId].size = courseSize
    }
    return data
  }

  const addDownloadsData = async data => {
    const stateData = merge(state.downloads, data)

    const updatedData = updateDownloadsSize(stateData)

    dispatch({ type: 'SET_DOWNLOADS_DATA', data: updatedData })
    await AsyncStorage.setItem('downloads', JSON.stringify(updatedData))
  }

  const removeCourseFromDownloads = async selectedCourses => {
    const data = omit(state.downloads, selectedCourses)

    dispatch({ type: 'SET_DOWNLOADS_DATA', data })
    await AsyncStorage.setItem('downloads', JSON.stringify(data))
  }

  const removeChaptersFromDownloads = async (courseId, selectedChapters) => {
    const downloads = { ...state.downloads }
    const chaptersData = omit(downloads[courseId].chapters, selectedChapters)
    downloads[courseId].chapters = chaptersData
    const data = updateDownloadsSize(downloads)

    dispatch({ type: 'SET_DOWNLOADS_DATA', data })
    await AsyncStorage.setItem('downloads', JSON.stringify(data))
  }

  const removeSectionsFromDownloads = async (courseId, chapterId, selectedSections) => {
    const downloads = { ...state.downloads }
    const sectionsData = omit(downloads[courseId].chapters[chapterId].sections, selectedSections)
    downloads[courseId].chapters[chapterId].sections = sectionsData
    const data = updateDownloadsSize(downloads)

    dispatch({ type: 'SET_DOWNLOADS_DATA', data })
    await AsyncStorage.setItem('downloads', JSON.stringify(data))
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUser: setUser,
        getCourses,
        onSignOut,
        addDownloadsData,
        removeCourseFromDownloads,
        removeChaptersFromDownloads,
        removeSectionsFromDownloads,
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

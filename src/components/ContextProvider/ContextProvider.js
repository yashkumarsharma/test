import React, { createContext, useReducer, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-community/async-storage'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import { downloadsStatus } from '../../constants'
import { arrayDiff } from '../../utilities/utilsFunctions'
import { loadUser, getCourses, setUser, onSignOut } from './userActions'
import {
  downloadVideo,
  loadDownloadsData,
  updateDownloadsSize,
} from './downloadsActions'
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
    downloadQueue: [],
    currentDownload: {
      video: null,
      progress: 0,
    },
  }

  const [downloadStatus, setStatus] = useState(downloadsStatus.IDLE)

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    loadUser(dispatch)
    loadDownloadsData(dispatch)
  }, [])

  useEffect(() => {
    if (
      downloadStatus !== downloadsStatus.STARTED &&
      state?.downloadQueue?.length > 0
    ) {
      downloadVideo(state.downloadQueue[0], setStatus, dispatch)
    }
  }, [state.downloadQueue])

  useEffect(() => {
    if (downloadStatus === downloadsStatus.DONE) {
      removeFromDownloadQueue(state.downloadQueue[0])
      setStatus(downloadsStatus.IDLE)
    }
  }, [downloadStatus])

  const removeFromDownloadQueue = async (id) => {
    let newDownloadQueue = []

    if (Array.isArray(id)) {
      newDownloadQueue = state.downloadQueue.filter(
        (entryId) => !id.includes(entryId),
      )
    } else {
      newDownloadQueue = state.downloadQueue.filter((entryId) => entryId !== id)
    }
    dispatch({
      type: 'SET_CURRENT_DOWNLOAD',
      data: {
        video: null,
        progress: 0,
      },
    })
    dispatch({ type: 'UPDATE_DOWNLOAD_QUEUE', data: newDownloadQueue })
    await AsyncStorage.setItem(
      'downloadQueue',
      JSON.stringify(newDownloadQueue),
    )
  }

  const addDownloadsData = async (data, entries) => {
    const stateData = merge(state.downloads, data)
    let newDownloadsQueue = arrayDiff(entries, state?.downloadQueue)

    newDownloadsQueue =
      state.downloadQueue.length > 0
        ? [...state.downloadQueue, ...newDownloadsQueue]
        : newDownloadsQueue

    const updatedData = updateDownloadsSize(stateData)

    dispatch({
      type: 'SET_DOWNLOADS_DATA',
      data: updatedData,
      downloadQueue: newDownloadsQueue,
    })
    await AsyncStorage.setItem('downloads', JSON.stringify(updatedData))
    await AsyncStorage.setItem(
      'downloadQueue',
      JSON.stringify(newDownloadsQueue),
    )
  }

  const deleteDownloadsData = async (data) => {
    dispatch({ type: 'SET_DOWNLOADS_DATA', data: {} })
    await AsyncStorage.setItem('downloads', JSON.stringify({}))
  }

  const removeCourseFromDownloads = async (selectedCourses) => {
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

  const removeSectionsFromDownloads = async (
    courseId,
    chapterId,
    selectedSections,
    videoList,
  ) => {
    const downloads = { ...state.downloads }
    const sectionsData = omit(
      downloads[courseId].chapters[chapterId].sections,
      selectedSections,
    )
    downloads[courseId].chapters[chapterId].sections = sectionsData
    const data = updateDownloadsSize(downloads)

    dispatch({ type: 'SET_DOWNLOADS_DATA', data })
    await AsyncStorage.setItem('downloads', JSON.stringify(data))

    removeFromDownloadQueue(videoList)

    for (let i = 0; i < videoList.length; i++) {
      await AsyncStorage.removeItem(videoList[i])
    }
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUser: (user) => setUser(user, dispatch),
        getCourses: () => getCourses(dispatch),
        onSignOut: () => onSignOut(dispatch),
        addDownloadsData,
        removeCourseFromDownloads,
        removeChaptersFromDownloads,
        removeSectionsFromDownloads,
        deleteDownloadsData,
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

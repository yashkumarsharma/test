import AsyncStorage from '@react-native-community/async-storage'
import RNFetchBlob from 'rn-fetch-blob'
import { downloadsStatus, PARTNER_ID } from '../../constants'

export const loadDownloadsData = async (dispatch) => {
  try {
    const storedData = await AsyncStorage.getItem('downloads')
    const downloadQueue = await AsyncStorage.getItem('downloadQueue')
    if (storedData) {
      const data = JSON.parse(storedData)
      dispatch({
        type: 'SET_DOWNLOADS_DATA',
        data,
        downloadQueue: JSON.parse(downloadQueue),
      })
    }
  } catch (err) {
    console.warn('Error while fetching downloads data from Asycnstorage')
  }
}

export const updateDownloadsSize = (data) => {
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

export const downloadVideo = async (entryId, setStatus, dispatch) => {
  const downloadedPath = await AsyncStorage.getItem(entryId)
  if (!downloadedPath) {
    dispatch({
      type: 'SET_CURRENT_DOWNLOAD',
      data: {
        video: entryId,
        progress: 0,
      },
    })
    setStatus(downloadsStatus.STARTED)
    console.log('---------downloading: ', entryId)
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'mp4',
    })
      .fetch(
        'GET',
        `https://cdnapisec.kaltura.com/p/${PARTNER_ID}/sp/0/playManifest/entryId/${entryId}/format/url/flavorParamId/301971/video.mp4`,
        // 'https://cdnapisec.kaltura.com/p/309/sp/0/playManifest/entryId/1_rcit0qgs/format/url/flavorParamId/301971/video.mp4',
      )
      .progress((received, total) => {
        console.log('progress', (received / total) * 100)

        dispatch({
          type: 'SET_CURRENT_DOWNLOAD',
          data: {
            video: entryId,
            progress: (received / total) * 100,
          },
        })
      })
      .then(async (res) => {
        await AsyncStorage.setItem(entryId, res.path())
        setStatus(downloadsStatus.DONE)
      })
  }
}

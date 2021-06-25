import React, { useEffect, useState, useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Pressable,
} from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import PropTypes from 'prop-types'
import CheckBox from 'react-native-check-box'
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-community/async-storage'
import { loadSectionData } from '../../utilities/api'
import colors from '../../assets/colors'
import { latoFont } from '../../utilities/utilsFunctions'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import { useSelect } from '../../hooks/useSelect'
import ResourceHeader from '../../components/ResourceHeader/ResourceHeader'
import ResourceFooter from '../../components/ResourceFooter/ResourceFooter'
import Download from '../../assets/icons/Download.png'
import Play from '../../assets/icons/Play.svg'
import DownloadIcon from '../../assets/icons/Download.svg'
import DownloadCancel from '../../assets/icons/DownloadCancel.svg'
import { getVideoDurationString } from '../../utilities/dateTimeUtils'
import { AppContext } from '../../components/ContextProvider/ContextProvider'
import CircularProgress from '../../components/CircularProgress/CircularProgress'

const ChapterScreen = ({ route, navigation: { navigate } }) => {
  const {
    course: { id: courseUUID },
    chapter,
    index,
  } = route.params
  const [sections, setSections] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [displayedSections, setDisplayedSections] = useState([])
  const [selectMode, setSelectMode] = useState('')
  const { selectedOptions, reset, add, remove, isSelected } = useSelect([])
  const context = useContext(AppContext)
  const {
    addDownloadsData,
    removeSectionsFromDownloads,
    downloads,
    downloadQueue = [],
    currentDownload,
  } = context

  const getChapterData = async () => {
    const data = await Promise.all(
      chapter?.sections?.map((section) => {
        return loadSectionData(courseUUID, section?.section_uuid)
      }),
    )

    setDisplayedSections(new Array(data.length).fill(true))
    setSections(data)
  }

  const isAllSelected = sections?.length === selectedOptions.length

  useEffect(() => {
    getChapterData()
  }, [])

  const checkboxPress = () => {
    if (isAllSelected) reset()
    else {
      add(
        sections?.map(({ section_uuid: sectionUUID }) => {
          const isDownloaded = Boolean(
            downloads?.[courseUUID]?.chapters?.[chapter.chapter_uuid]
              ?.sections?.[sectionUUID],
          )

          const isRemovable = selectMode === 'remove' && isDownloaded
          const isDownlodable = selectMode === 'download' && !isDownloaded
          if (isDownlodable || isRemovable) return sectionUUID
        }),
      )
    }
  }

  const headerButtonPress = () => {
    if (selectMode) {
      reset()
      setSelectMode('')
    } else setModalVisible(true)
  }

  const getVideosList = () => {
    let videosList = []
    sections.forEach((section) => {
      if (selectedOptions.includes(section?.section_uuid)) {
        const videos =
          section?.section_exe?.multi_lecture_videos?.videos ||
          section?.section_exe?.lecture?.lecturevideos

        videosList = [
          ...videosList,
          ...videos.map((v) => v.kaltura_embed_code || v.kalturaEmbedCode),
        ]
      }
    })
    return videosList
  }

  const triggerDownload = (video, secIndex) => {
    // Add code to download the video
    // If successful, the following code should be executed
    const courseTitle = route?.params?.course?.displayName
    const chapter = route?.params?.chapter || {}
    const chapterTitle = `Chapter ${index + 1}: ${chapter.title || ''}`

    console.log(video, '----', courseTitle, '----')
    if (!video) {
      // const sectionTitle = `${index + 1}.${secIndex + 1}: ${section.title || ''}`
      // The structure is kept generic and it is required for Downloads functionality.
      // It supports multiple chapters/sections/videos.
      // They can be updated in a single call.

      const sectionsList = {}

      for (let i = 0; i < sections.length; i++) {
        if (selectedOptions.includes(sections[i].section_uuid)) {
          sectionsList[selectedOptions[i]] = {
            title: `${index + 1}.${i + 1}: ${sections[i].title || ''}`,
            videos: {},
          }

          const videos =
            sections[i]?.section_exe?.multi_lecture_videos?.videos ||
            sections[i]?.section_exe?.lecture?.lecturevideos

          for (let j = 0; j < videos.length; j++) {
            sectionsList[selectedOptions[i]].videos[
              videos[j].kaltura_embed_code || videos[j].kalturaEmbedCode
            ] = {
              ...videos[j],
              size: 456000,
            }
          }
        }
      }

      const downloadsObject = {
        [courseUUID]: {
          title: courseTitle,
          chapters: {
            [chapter.chapter_uuid]: {
              title: chapterTitle,
              sections: sectionsList,
            },
          },
        },
      }
      console.log(
        downloadsObject,
        '-------object-----',
        getVideosList(),
        '-------list-------',
      )
      addDownloadsData(downloadsObject, getVideosList())

      reset()
      setSelectMode('')
    } else {
      // Add code to download the video
      // If successful, the following code should be executed
      const section = chapter.sections?.[secIndex] || {}
      const sectionTitle = `${index + 1}.${secIndex + 1}: ${
        section.title || ''
      }`
      // The structure is kept generic and it is required for Downloads functionality.
      // It supports multiple chapters/sections/videos.
      // They can be updated in a single call.
      const downloadsObject = {
        [courseUUID]: {
          title: courseTitle,
          chapters: {
            [chapter.chapter_uuid]: {
              title: chapterTitle,
              sections: {
                [section.section_uuid]: {
                  title: sectionTitle,
                  videos: {
                    [video.kaltura_embed_code || video.kalturaEmbedCode]: {
                      // TODO: optimize this after size course/video route is implemented
                      // more videos can be added in a similar fashion
                      ...video,
                      size: 456000, // size in Bytes // Dummy value for now
                    },
                  },
                },
              },
            },
          },
        },
      }
      addDownloadsData(downloadsObject, [
        video.kaltura_embed_code || video.kalturaEmbedCode,
      ])
    }
  }

  const removeSelectedSections = () => {
    // Todo: Delete local files

    // Remove from context
    removeSectionsFromDownloads(
      courseUUID,
      chapter.chapter_uuid,
      selectedOptions,
      getVideosList(),
    )
    reset()
  }

  const getVideoIcon = (video, isDownloaded) => {
    const videoStatus = downloadQueue?.includes(
      video?.kaltura_embed_code || video?.kalturaEmbedCode,
    )

    if (!isDownloaded) {
      return { Icon: DownloadIcon, status: 'NONE' }
    }

    if (videoStatus) return { Icon: DownloadCancel, status: 'DOWNLOADING' }
    return { Icon: Play, status: 'DOWNLOADED' }
  }

  return (
    <>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}>
        <ModalComponent
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setSelectMode={setSelectMode}
        />
        {!sections?.length > 0 ? (
          <View style={{ justifyContent: 'center', flexGrow: 1 }}>
            <ActivityIndicator size='large' color={colors.brand} />
          </View>
        ) : (
          <View style={styles.container}>
            <ResourceHeader
              selectMode={selectMode}
              isAllSelected={isAllSelected}
              title={`Chapter ${index + 1}`}
              onPress={headerButtonPress}
              checkboxPress={checkboxPress}
            />
            {sections?.map((section, secIndex) => {
              const videos =
                section?.section_exe?.multi_lecture_videos?.videos ||
                section?.section_exe?.lecture?.lecturevideos

              const selected = isSelected(section?.section_uuid)
              const isOpen = displayedSections[secIndex]
              const isDownloaded = Boolean(
                downloads?.[courseUUID]?.chapters?.[chapter.chapter_uuid]
                  ?.sections?.[section?.section_uuid],
              )
              const isRemovable = selectMode === 'remove' && isDownloaded
              const isDownlodable = selectMode === 'download' && !isDownloaded

              return (
                <View
                  style={styles.sectionContainer}
                  key={section?.section_uuid}>
                  <Pressable
                    onPress={() => {
                      if (selectMode) {
                        selected
                          ? remove(section?.section_uuid)
                          : add(section?.section_uuid)
                      } else {
                        const newArray = [...displayedSections]
                        newArray[secIndex] = !newArray[secIndex]
                        setDisplayedSections(newArray)
                      }
                    }}
                    style={{
                      ...styles.sectionTitlePressable,
                      marginBottom: isOpen ? 19 : 0,
                    }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.sectionTitle}>
                        {index + 1}.{secIndex + 1}: {section?.title}
                      </Text>
                      <Text
                        style={{
                          ...styles.downloadText,
                          marginLeft: 0,
                          marginTop: 6,
                        }}>
                        22 MB
                      </Text>
                    </View>
                    {isRemovable || isDownlodable ? (
                      <CheckBox
                        onClick={() => {
                          selected
                            ? remove(section?.section_uuid)
                            : add(section?.section_uuid)
                        }}
                        isChecked={selected}
                        checkBoxColor={colors.brand}
                      />
                    ) : (
                      <Icon
                        name={isOpen ? 'chevron-thin-up' : 'chevron-thin-down'}
                        size={16}
                        color='white'
                      />
                    )}
                  </Pressable>
                  {isOpen &&
                    videos?.map((video, videoIndex) => {
                      const isVideoDownloaded = Boolean(
                        downloads?.[courseUUID]?.chapters?.[
                          chapter.chapter_uuid
                        ]?.sections?.[section?.section_uuid]?.videos?.[
                          video?.kaltura_embed_code || video?.kalturaEmbedCode
                        ],
                      )
                      const { Icon, status } = getVideoIcon(
                        video,
                        isVideoDownloaded,
                      )

                      const isCurrent =
                        currentDownload?.video ===
                        (video?.kaltura_embed_code || video?.kalturaEmbedCode)

                      return (
                        <Pressable
                          key={
                            video?.kaltura_embed_code || video?.kalturaEmbedCode
                          }
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            marginBottom:
                              videoIndex === videos.length - 1 ? 0 : 21,
                          }}
                          onPress={async () => {
                            if (isDownloaded) {
                              const videoFile = await AsyncStorage.getItem(
                                video?.kaltura_embed_code ||
                                  video?.kalturaEmbedCode,
                              )
                              if (videoFile) {
                                navigate('video', { video, videoFile })
                              }
                            }
                          }}>
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <FastImage
                              style={{
                                ...styles.thumbnail,
                                opacity: status !== 'DOWNLOADED' ? 0.2 : 1,
                              }}
                              source={{
                                uri: `https://cdnsecakmi.kaltura.com/p/2654411/thumbnail/entry_id/${
                                  video?.kaltura_embed_code ||
                                  video?.kalturaEmbedCode
                                }`,
                              }}
                            />
                            <Pressable
                              style={{
                                position: 'absolute',
                                height: 24,
                                width: 24,
                              }}
                              onPress={() => {
                                if (!isVideoDownloaded) {
                                  triggerDownload(video, secIndex)
                                }
                              }}>
                              <Icon />
                              {isCurrent && (
                                <CircularProgress
                                  progress={currentDownload.progress}
                                />
                              )}
                            </Pressable>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.videoTitle}>
                              {video?.title}
                            </Text>
                            <View style={styles.downloadContainer}>
                              {status === 'DOWNLOADED' && (
                                <>
                                  <Image
                                    source={Download}
                                    style={styles.downloadImage}
                                  />
                                  <Text style={styles.downloadText}>2 GB</Text>
                                </>
                              )}
                              <Text style={styles.downloadText}>
                                {getVideoDurationString(video?.duration)}
                              </Text>
                            </View>
                          </View>
                        </Pressable>
                      )
                    })}
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>
      <ResourceFooter
        selectMode={selectMode}
        selectedOptions={selectedOptions}
        downloadFiles={triggerDownload}
        removeFiles={removeSelectedSections}
      />
    </>
  )
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: colors.bg },
  sectionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
    paddingBottom: 24,
  },
  scrollContent: { flexGrow: 1, paddingHorizontal: 12, paddingVertical: 24 },
  chapterCard: {
    flex: 1,
    height: 110,
    backgroundColor: '#1D1D1F',
    marginBottom: 12,
    borderRadius: 5,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontFamily: latoFont('Bold'), fontSize: 16, color: '#FFFFFF' },
  lockTitle: { fontFamily: latoFont('Bold'), fontSize: 16, color: '#B1BFC5' },
  downloadContainer: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadImage: { height: 12, width: 12, marginRight: 8 },
  downloadText: { fontFamily: latoFont(), color: '#B1BFC5', marginRight: 8 },
  icon: { height: 16, width: 8 },
  lockIcon: { height: 16, width: 12 },
  thumbnail: {
    height: 68,
    width: 120,
    marginRight: 12,
  },
  videoTitle: {
    color: 'white',
    fontFamily: latoFont(),
    fontSize: 16,
    lineHeight: 19,
  },
  sectionTitle: {
    flex: 1,
    color: 'white',
    fontFamily: latoFont('Bold'),
    fontSize: 16,
    lineHeight: 19,
  },
  sectionTitlePressable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

ChapterScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes.any),
  }),
  navigation: PropTypes.objectOf(PropTypes.func),
}

export default ChapterScreen

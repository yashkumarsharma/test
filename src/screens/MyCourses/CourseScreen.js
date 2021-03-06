import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native'
import PropTypes from 'prop-types'
import CheckBox from 'react-native-check-box'
import merge from 'lodash/merge'
import { getCourseData, loadSectionData } from '../../utilities/api'
import colors from '../../assets/colors'
import { isSameArrays, latoFont } from '../../utilities/utilsFunctions'
import Vector from '../../assets/icons/Vector.png'
import Download from '../../assets/icons/Download.png'
import Lock from '../../assets/icons/Lock.png'
import {
  secondsSinceEpoch,
  secondsToFormattedDateShort,
} from '../../utilities/dateTimeUtils'
import { getChapterLockDates } from '../../utilities/chapterUtils'
import {
  getCohortDuration,
  getCohortModifier,
  getCohortSpecialDays,
  getCohortStartSecondsSinceEpoch,
} from '../../utilities/courseUtils'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import { useSelect } from '../../hooks/useSelect'
import ResourceHeader from '../../components/ResourceHeader/ResourceHeader'
import ResourceFooter from '../../components/ResourceFooter/ResourceFooter'
import { AppContext } from '../../components/ContextProvider/ContextProvider'

const CourseScreen = ({ route, navigation: { navigate } }) => {
  const {
    course: { id: courseUUID, name: courseName },
    course,
  } = route.params

  const [chapters, setChapter] = useState(null)
  const [cohortData, setCohortData] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectMode, setSelectMode] = useState('')
  const { selectedOptions, reset, add, remove, isSelected } = useSelect([])
  const context = useContext(AppContext)
  const { addDownloadsData, downloads, removeChaptersFromDownloads } = context

  const getCourseChapters = async () => {
    const { chapters } = await getCourseData(courseUUID)

    const cohortDuration = getCohortDuration(course)
    const cohortModifier = getCohortModifier(chapters, cohortDuration)
    const cohortSpecialDays = getCohortSpecialDays(course)
    const cohortStartDate = getCohortStartSecondsSinceEpoch(course)
    const cohortData = {
      cohortModifier,
      cohortSpecialDays,
      cohortStartDate,
    }
    setCohortData(cohortData)
    setChapter(chapters.filter((chap) => chap?.type === 'chapter'))
  }

  useEffect(() => {
    getCourseChapters()
  }, [])

  const checkboxPress = () => {
    if (isAllSelected) reset()
    else {
      const selectedChapters = chapters?.filter((chapter) => {
        const isDownloaded = isChapterDownloaded(
          chapter?.sections?.map((sec) => sec?.section_uuid),
          chapter.chapter_uuid,
        )

        const isRemovable = selectMode === 'remove' && isDownloaded
        const isDownlodable = selectMode === 'download' && !isDownloaded

        if (isDownlodable || isRemovable) return chapter.chapter_uuid
      })
      add(selectedChapters?.map((c) => c?.chapter_uuid))
    }
  }

  const headerButtonPress = () => {
    if (selectMode) {
      reset()
      setSelectMode(null)
    } else setModalVisible(true)
  }

  const currentDate = secondsSinceEpoch()

  const downloadChapter = async (chapter) => {
    const data = await Promise.all(
      chapter?.sections?.map((section) => {
        return loadSectionData(courseUUID, section?.section_uuid)
      }),
    )

    return data
  }

  const triggerDownload = async () => {
    const selectedChapters = chapters.filter(({ chapter_uuid: chapterUUID }) =>
      selectedOptions.includes(chapterUUID),
    )

    const data = await Promise.all(
      selectedChapters?.map(async (chap) => {
        return { chap, sections: await downloadChapter(chap) }
      }),
    )

    let videosList = []
    let downloadData = {}

    data.forEach(({ chap, sections }) => {
      const courseTitle = route?.params?.course?.displayName
      const chapterIndex = chapters.findIndex(
        (c) => c?.chapter_uuid === chap?.chapter_uuid,
      )
      const chapterTitle = `Chapter ${chapterIndex + 1}: ${chap.title || ''}`

      const sectionsList = {}

      sections.forEach((section, idx) => {
        sectionsList[section?.section_uuid] = {
          title: `${chapterIndex + 1}.${idx + 1}: ${section.title || ''}`,
          videos: {},
          fullDownload: true,
        }

        const videos =
          section?.section_exe?.multi_lecture_videos?.videos ||
          section?.section_exe?.lecture?.lecturevideos

        for (let j = 0; j < videos.length; j++) {
          sectionsList[section?.section_uuid].videos[
            videos[j].kaltura_embed_code || videos[j].kalturaEmbedCode
          ] = {
            ...videos[j],
            size: 456000,
          }
        }
      })

      const downloadsObject = {
        [courseUUID]: {
          title: courseTitle,
          chapters: {
            [chap.chapter_uuid]: {
              title: chapterTitle,
              sections: sectionsList,
            },
          },
        },
      }
      videosList = videosList.concat(getVideosList(sections))
      downloadData = merge(downloadData, downloadsObject)
    })

    addDownloadsData(downloadData, videosList)
    reset()
    setSelectMode('')
  }

  const removeFromDownloads = () => {
    let videosList = []
    selectedOptions.forEach((chapter) => {
      const chapterSections =
        downloads[courseUUID]?.chapters?.[chapter]?.sections

      Object.values(chapterSections).forEach((s) => {
        videosList = [...videosList, ...Object.keys(s?.videos)]
      })
    })
    removeChaptersFromDownloads(course.id, selectedOptions, videosList)
    setSelectMode(null)
    reset()
  }

  const getVideosList = (sections) => {
    let videosList = []
    sections.forEach((section) => {
      const videos =
        section?.section_exe?.multi_lecture_videos?.videos ||
        section?.section_exe?.lecture?.lecturevideos

      videosList = [
        ...videosList,
        ...videos.map((v) => v.kaltura_embed_code || v.kalturaEmbedCode),
      ]
    })
    return videosList
  }

  const isChapterDownloaded = (sections, chapterUUID) => {
    const downloadsChapter =
      downloads?.[courseUUID]?.chapters?.[chapterUUID]?.sections

    if (downloadsChapter && Object.keys(downloadsChapter)?.length > 0) {
      let downloadsChapterSections = []
      Object.keys(downloadsChapter)?.forEach((sectionUUID) => {
        const { fullDownload } = downloadsChapter[sectionUUID]
        if (fullDownload) {
          downloadsChapterSections =
            downloadsChapterSections.length > 0
              ? [...downloadsChapterSections, sectionUUID]
              : [sectionUUID]
        }
      })
      return isSameArrays(sections, downloadsChapterSections)
    }

    return false
  }

  const selectableChapters = useMemo(() => {
    if (!chapters) return []
    let chaptersList = []

    chapters.forEach((chapter, idx) => {
      const isDownloaded = isChapterDownloaded(
        chapter?.sections?.map((sec) => sec?.section_uuid),
        chapter?.chapter_uuid,
      )

      const isRemovable = selectMode === 'remove' && isDownloaded
      const isDownlodable = selectMode === 'download' && !isDownloaded

      if (isRemovable || isDownlodable) {
        chaptersList = chaptersList.concat(chapter?.chapter_uuid)
      }
    })

    return chaptersList
  }, [chapters, selectMode])

  const isAllSelected =
    selectableChapters?.length > 0
      ? selectedOptions?.length === selectableChapters?.length
      : false

  let selectedSize = 0
  for (let i = 0; i < selectedOptions.length; i++) {
    selectedSize += chapters[selectedOptions[i]]?.size || 4500000
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
        {!chapters ? (
          <View style={{ justifyContent: 'center', flexGrow: 1 }}>
            <ActivityIndicator size='large' color={colors.brand} />
          </View>
        ) : (
          <View style={styles.container}>
            <ResourceHeader
              selectMode={selectMode}
              isAllSelected={isAllSelected}
              title={courseName}
              onPress={headerButtonPress}
              checkboxPress={checkboxPress}
            />
            {chapters.map((chapter, index) => {
              const { unlockDate } = getChapterLockDates({
                chapter,
                cohortData,
              })
              const isLocked = unlockDate > currentDate
              const { chapter_uuid: chapterUUID } = chapter

              const selected = isSelected(chapterUUID)

              const isSelectable = selectableChapters.includes(chapterUUID)

              const isDisabled = selectMode && !isSelectable
              return (
                <Pressable
                  style={{
                    ...styles.chapterCard,
                    opacity: isDisabled ? 0.3 : 1,
                  }}
                  key={chapterUUID}
                  onPress={() => {
                    if (!selectMode) {
                      navigate('chapter', {
                        course,
                        chapter,
                        index,
                      })
                    } else {
                      if (!isDisabled) {
                        selected ? remove(chapterUUID) : add(chapterUUID)
                      }
                    }
                  }}>
                  <View
                    style={{
                      paddingRight: 12,
                      flex: 1,
                    }}>
                    <Text
                      style={isDisabled ? styles.lockTitle : styles.title}
                      numberOfLines={2}>
                      Chapter {index + 1}: {chapter?.title}
                    </Text>
                    <View style={styles.downloadContainer}>
                      <Image source={Download} style={styles.downloadImage} />
                      <Text style={styles.downloadText}>2 GB</Text>
                      {isLocked && (
                        <Text style={styles.downloadText}>
                          Unlocks {secondsToFormattedDateShort(unlockDate)}
                        </Text>
                      )}
                    </View>
                  </View>
                  {isSelectable ? (
                    <CheckBox
                      onClick={() => {
                        selected ? remove(chapterUUID) : add(chapterUUID)
                      }}
                      isChecked={selected}
                      checkBoxColor={colors.brand}
                    />
                  ) : (
                    !isDisabled && (
                      <Image
                        source={isLocked ? Lock : Vector}
                        style={isLocked ? styles.lockIcon : styles.icon}
                      />
                    )
                  )}
                </Pressable>
              )
            })}
          </View>
        )}
      </ScrollView>
      <ResourceFooter
        selectMode={selectMode}
        selectedOptions={selectedOptions}
        downloadFiles={triggerDownload}
        removeFiles={removeFromDownloads}
        selectedSize={selectedSize}
      />
    </>
  )
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { flexGrow: 1, paddingHorizontal: 12, paddingVertical: 24 },
  chapterCard: {
    flex: 1,
    height: 110,
    marginBottom: 12,
    backgroundColor: '#1D1D1F',
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
  downloadImage: { height: 12, width: 12 },
  downloadText: { fontFamily: latoFont(), color: '#B1BFC5', marginLeft: 8 },
  icon: { height: 16, width: 8 },
  lockIcon: { height: 16, width: 12 },
})

CourseScreen.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.func),
  route: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes.any),
  }),
}

export default CourseScreen

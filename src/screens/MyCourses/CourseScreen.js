import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native'
import PropTypes from 'prop-types'
import CheckBox from 'react-native-check-box'
import { getCourseData } from '../../utilities/api'
import colors from '../../assets/colors'
import { latoFont } from '../../utilities/utilsFunctions'
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

  const isAllSelected = chapters?.length === selectedOptions.length

  useEffect(() => {
    getCourseChapters()
  }, [])

  const checkboxPress = () => {
    if (isAllSelected) reset()
    else add(chapters?.map(({ chapter_uuid: chapterUUID }) => chapterUUID))
  }

  const headerButtonPress = () => {
    if (selectMode) {
      reset()
      setSelectMode(null)
    } else setModalVisible(true)
  }

  const currentDate = secondsSinceEpoch()

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

              return (
                <TouchableOpacity
                  style={styles.chapterCard}
                  key={chapterUUID}
                  onPress={() => {
                    if (!selectMode) {
                      navigate('chapter', {
                        course,
                        chapter,
                        index,
                      })
                    } else {
                      selected ? remove(chapterUUID) : add(chapterUUID)
                    }
                  }}>
                  <View style={{ paddingRight: 12, flex: 1 }}>
                    <Text
                      style={isLocked ? styles.lockTitle : styles.title}
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
                  {selectMode ? (
                    <CheckBox
                      onClick={() => {
                        selected ? remove(chapterUUID) : add(chapterUUID)
                      }}
                      isChecked={selected}
                      checkBoxColor={colors.brand}
                    />
                  ) : (
                    <Image
                      source={isLocked ? Lock : Vector}
                      style={isLocked ? styles.lockIcon : styles.icon}
                    />
                  )}
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </ScrollView>
      <ResourceFooter
        selectMode={selectMode}
        selectedOptions={selectedOptions}
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
  downloadImage: { height: 12, width: 12 },
  downloadText: { fontFamily: latoFont(), color: '#B1BFC5', marginLeft: 8 },
  icon: { height: 16, width: 8 },
  lockIcon: { height: 16, width: 12 },
})

CourseScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes.any),
  }),
}

export default CourseScreen

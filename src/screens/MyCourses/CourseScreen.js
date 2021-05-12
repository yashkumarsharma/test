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
import { getCourseData } from '../../utilities/api'
import colors from '../../assets/colors'
import { latoFont } from '../../utilities/utilsFunctions'
import Vector from '../../assets/icons/Vector.png'
import Download from '../../assets/icons/Download.png'
import Lock from '../../assets/icons/Lock.png'
import PropTypes from 'prop-types'
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

const CourseScreen = ({ route }) => {
  const {
    course: { id: courseUUID, name: courseName },
    course,
  } = route.params
  const [chapters, setChapter] = useState(null)
  const [cohortData, setCohortData] = useState(null)
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
    setChapter(chapters)
  }

  useEffect(() => {
    getCourseChapters()
  }, [])

  const currentDate = secondsSinceEpoch()
  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}>
      {!chapters
        ? (
        <View style={{ justifyContent: 'center', flexGrow: 1 }}>
          <ActivityIndicator />
        </View>
          )
        : (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.courseTitle}>{courseName}</Text>
            <Text style={styles.selectButton}>SELECT</Text>
          </View>
          {chapters
            .filter(chap => chap?.type === 'chapter')
            .map((chapter, index) => {
              const { unlockDate } = getChapterLockDates({
                chapter,
                cohortData,
              })
              const isLocked = unlockDate > currentDate
              return (
                <TouchableOpacity style={styles.chapterCard}>
                  <View style={{ paddingRight: 12 }}>
                    <Text style={isLocked ? styles.lockTitle : styles.title}>
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
                  <Image
                    source={isLocked ? Lock : Vector}
                    style={isLocked ? styles.lockIcon : styles.icon}
                  />
                </TouchableOpacity>
              )
            })}
        </View>
          )}
    </ScrollView>
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
  headerContainer: {
    flexDirection: 'row',
    paddingBottom: 24,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
  },
  courseTitle: { fontFamily: latoFont('Bold'), fontSize: 14, color: '#B1BFC5' },
  selectButton: {
    fontFamily: latoFont('Bold'),
    fontSize: 14,
    color: colors.brand,
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

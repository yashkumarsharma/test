import React, { useContext, useState } from 'react'
import {
  Image,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'
import CheckBox from 'react-native-check-box'

import colors from '../../assets/colors'
import Download from '../../assets/icons/Download.png'
import Vector from '../../assets/icons/Vector.png'
import { AppContext } from '../../components/ContextProvider/ContextProvider'
import ResourceHeader from '../../components/ResourceHeader/ResourceHeader'
import ResourceFooter from '../../components/ResourceFooter/ResourceFooter'
import config from '../../config'
import { latoFont, getPrettySize } from '../../utilities/utilsFunctions'
import { useSelect } from '../../hooks/useSelect'

const Courses = ({ navigation: { navigate } }) => {
  const [selectMode, setSelectMode] = useState('')
  const { selectedOptions, reset, add, remove, isSelected } = useSelect([])
  const {
    downloads = {},
    removeCourseFromDownloads,
  } = useContext(AppContext)

  const courses = Object.keys(downloads).map(courseId => ({
    id: courseId,
    title: downloads[courseId].title,
  }))
  const { getCourseIcon } = config

  const isAllSelected = courses?.length === selectedOptions.length

  const checkboxPress = () => {
    if (isAllSelected) reset()
    else add(courses?.map(({ id }) => id))
  }

  if (courses.length === 0) {
    return (
      <View style={styles.blankContainer}>
        <Text style={styles.emptyText}> Downloaded resources will be visible here </Text>
      </View>
    )
  }

  const removeSelectedCourses = () => {
    // Todo: Delete local files

    // Remove from context
    removeCourseFromDownloads(selectedOptions)
    reset()
  }

  let totalDownload = 0
  for (const courseId in downloads) {
    totalDownload += downloads[courseId]?.size || 0
  }

  let selectedSize = 0
  for (let i = 0; i < selectedOptions.length; i++) {
    selectedSize += downloads[selectedOptions[i]]?.size || 0
  }

  return (
    <>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleContainer}>
          <ResourceHeader
            selectMode={selectMode}
            isAllSelected={isAllSelected}
            title={`Downloads: ${getPrettySize(totalDownload)}`}
            onPress={() => {
              setSelectMode(selectMode ? '' : 'remove')
              selectMode && reset()
            }}
            checkboxPress={checkboxPress}
          />
        </View>
        <View style={styles.container}>
          {courses.map((course, key) => {
            const Icon = getCourseIcon(course.id)
            const selected = isSelected(course.id)

            return (
              <TouchableOpacity
                key={key}
                style={styles.cardContainer}
                onPress={() => {
                  navigate('downloads-chapters', {
                    course,
                  })
                }}
              >
                <View style={styles.iconContainer}>
                  <Icon height={48} width={48} />
                  {!!selectMode && (
                    <CheckBox
                      onClick={() => {
                        selected
                          ? remove(course.id)
                          : add(course.id)
                      }}
                      isChecked={selected}
                      checkBoxColor={colors.brand}
                    />
                  )}
                </View>
                <View>
                  <Text
                    style={styles.courseName}
                    numberOfLines={2}
                  >
                    {course.title}
                  </Text>
                  <View style={styles.downloadContainer}>
                    <Image source={Download} style={styles.downloadImage} />
                    <Text style={styles.downloadText}>{getPrettySize(downloads[course.id]?.size || 0)}</Text>
                    <Image
                      source={Vector}
                      style={styles.icon}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
      <ResourceFooter
        selectMode={selectMode}
        selectedOptions={selectedOptions}
        selectedSize={selectedSize}
        removeFiles={removeSelectedCourses}
      />
    </>
  )
}

const styles = StyleSheet.create({
  blankContainer: {
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: colors.bg,
  },
  emptyText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: latoFont(),
  },
  scrollContainer: {
    // flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    // flexGrow: 1,
  },
  titleContainer: {
    marginTop: 25,
    marginHorizontal: 12,
  },
  titleText: {
    color: '#B1BFC5',
    fontFamily: latoFont(),
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '700',
  },
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 50,
  },
  gradient: {
    height: '100%',
    width: '100%',
    padding: 12,
    justifyContent: 'flex-end',
  },
  cardContainer: {
    height: 220,
    width: '48%',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    resizeMode: 'cover',
    overflow: 'hidden',
    backgroundColor: '#1D1D1F',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseName: {
    fontFamily: latoFont('Bold'),
    fontSize: 16,
    color: '#FFFFFF',
  },
  downloadContainer: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadImage: {
    height: 12,
    width: 12,
  },
  downloadText: {
    fontFamily: latoFont(),
    color: '#B1BFC5',
    marginLeft: 8,
  },
  icon: {
    height: 16,
    width: 8,
    marginLeft: 'auto',
  },
})

Courses.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.func),
}

export default Courses

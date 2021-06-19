import React, { useContext, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native'
import PropTypes from 'prop-types'
import CheckBox from 'react-native-check-box'

import colors from '../../assets/colors'
import Vector from '../../assets/icons/Vector.png'
import Download from '../../assets/icons/Download.png'
import { AppContext } from '../../components/ContextProvider/ContextProvider'
import ResourceHeader from '../../components/ResourceHeader/ResourceHeader'
import ResourceFooter from '../../components/ResourceFooter/ResourceFooter'
import { useSelect } from '../../hooks/useSelect'
import { latoFont, getPrettySize } from '../../utilities/utilsFunctions'

const Chapters = (props) => {
  const course = props?.route?.params?.course
  const navigate = props?.navigation?.navigate
  const {
    downloads = {},
    removeChaptersFromDownloads,
  } = useContext(AppContext)
  const { selectedOptions, reset, add, remove, isSelected } = useSelect([])
  const [selectMode, setSelectMode] = useState('')
  const chapters = downloads?.[course.id]?.chapters || {}
  const chapterIds = Object.keys(chapters)
  const courseName = course.name
  const isAllSelected = chapterIds.length === selectedOptions.length

  const headerButtonPress = () => {
    setSelectMode(selectMode ? '' : 'remove')
    selectMode && reset()
  }

  const checkboxPress = () => {
    if (isAllSelected) reset()
    else add(chapterIds)
  }

  const removeSelectedChapters = () => {
    // Todo: Delete local files

    // Remove from context
    removeChaptersFromDownloads(course.id, selectedOptions)
    reset()
  }

  let selectedSize = 0
  for (let i = 0; i < selectedOptions.length; i++) {
    selectedSize += chapters[selectedOptions[i]]?.size || 0
  }

  return (
    <>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}>
        {!chapterIds?.length > 0
          ? (
            <View style={{ justifyContent: 'center', flexGrow: 1 }}>
              <Text style={styles.emptyText}> No Chapters Found </Text>
            </View>
            )
          : (
            <View style={styles.container}>
              <ResourceHeader
                selectMode={selectMode}
                isAllSelected={isAllSelected}
                title={courseName}
                onPress={headerButtonPress}
                checkboxPress={checkboxPress}
              />
              {Object.keys(chapters).map(chapterUUID => {
                const selected = isSelected(chapterUUID)

                return (
                  <TouchableOpacity
                    style={styles.chapterCard}
                    key={chapterUUID}
                    onPress={() => {
                      if (!selectMode) {
                        navigate('downloads-chapters', {
                          course,
                          chapter: chapterUUID,
                        })
                      } else {
                        selected ? remove(chapterUUID) : add(chapterUUID)
                      }
                    }}>
                    <View style={{ paddingRight: 12, flex: 1 }}>
                      <Text
                        style={styles.title}
                        numberOfLines={2}
                      >
                        {chapters[chapterUUID]?.title}
                      </Text>
                      <View style={styles.downloadContainer}>
                        <Image source={Download} style={styles.downloadImage} />
                        <Text style={styles.downloadText}>{getPrettySize(chapters[chapterUUID]?.size)}</Text>
                      </View>
                    </View>
                    {selectMode
                      ? (
                        <CheckBox
                          onClick={() => {
                            selected ? remove(chapterUUID) : add(chapterUUID)
                          }}
                          isChecked={selected}
                          checkBoxColor={colors.brand}
                        />
                        )
                      : (
                        <Image
                          source={Vector}
                          style={styles.icon}
                        />
                        )
                    }
                  </TouchableOpacity>
                )
              })}
              </View>
            )}
      </ScrollView>
      <ResourceFooter
        selectMode={selectMode}
        selectedOptions={selectedOptions}
        selectedSize={selectedSize}
        removeFiles={removeSelectedChapters}
      />
    </>
  )
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: colors.bg },
  emptyText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: latoFont(),
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
  downloadContainer: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadImage: { height: 12, width: 12 },
  downloadText: { fontFamily: latoFont(), color: '#B1BFC5', marginLeft: 8 },
  icon: { height: 16, width: 8 },
})

Chapters.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.func),
  route: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes.any),
  }),
}

export default Chapters

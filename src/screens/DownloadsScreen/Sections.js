import React, { useContext, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import PropTypes from 'prop-types'
import CheckBox from 'react-native-check-box'
import FastImage from 'react-native-fast-image'

import colors from '../../assets/colors'
import Download from '../../assets/icons/Download.png'
import Play from '../../assets/icons/Play.png'
import { AppContext } from '../../components/ContextProvider/ContextProvider'
import ResourceHeader from '../../components/ResourceHeader/ResourceHeader'
import ResourceFooter from '../../components/ResourceFooter/ResourceFooter'
import { useSelect } from '../../hooks/useSelect'
import { latoFont, getPrettySize } from '../../utilities/utilsFunctions'
import { getVideoDurationString } from '../../utilities/dateTimeUtils'

const Sections = (props) => {
  const {
    course: { id: courseUUID },
    chapter: chapterId,
  } = props?.route.params
  const [displayedSections, setDisplayedSections] = useState([])
  const [selectMode, setSelectMode] = useState('')
  const { selectedOptions, reset, add, remove, isSelected } = useSelect([])
  const {
    downloads = {},
    removeSectionsFromDownloads,
  } = useContext(AppContext)

  const sections = downloads?.[courseUUID]?.chapters?.[chapterId].sections || {}
  const sectionIds = Object.keys(sections)
  const chapterName = downloads?.[courseUUID]?.chapters?.[chapterId]?.title || ''

  const isAllSelected = sectionIds?.length === selectedOptions.length

  let selectedSize = 0
  for (let i = 0; i < selectedOptions.length; i++) {
    selectedSize += sections[selectedOptions[i]]?.size || 0
  }

  const checkboxPress = () => {
    if (isAllSelected) reset()
    else add(sectionIds)
  }

  const headerButtonPress = () => {
    setSelectMode(selectMode ? '' : 'remove')
    selectMode && reset()
  }

  const removeSelectedSections = () => {
    // Todo: Delete local files

    // Remove from context
    removeSectionsFromDownloads(courseUUID, chapterId, selectedOptions)
    // reset()
  }

  return (
    <>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}>
        {!sectionIds?.length > 0
          ? (
              <View style={{ justifyContent: 'center', flexGrow: 1 }}>
                <Text style={styles.emptyText}> No Sections Found </Text>
              </View>
            )
          : (
            <View style={styles.container}>
              <ResourceHeader
                selectMode={selectMode}
                isAllSelected={isAllSelected}
                title={chapterName.split(':')[0]}
                onPress={headerButtonPress}
                checkboxPress={checkboxPress}
              />
              {Object.keys(sections).map((sectionId, secIndex) => {
                const videos = Object.values(sections[sectionId]?.videos) || []
                const selected = isSelected(sectionId)
                const isOpen = displayedSections[secIndex]
                return (
                  <View key={secIndex} style={styles.sectionContainer}>
                    <Pressable
                      onPress={() => {
                        if (selectMode) {
                          selected
                            ? remove(secIndex)
                            : add(secIndex)
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
                          {sections[sectionId]?.title || ''}
                        </Text>
                        <Text
                          style={{
                            ...styles.downloadText,
                            marginLeft: 0,
                            marginTop: 6,
                          }}>
                          {getPrettySize(sections[sectionId]?.size || 0)}
                        </Text>
                      </View>
                      {selectMode
                        ? (
                            <CheckBox
                              onClick={() => {
                                selected
                                  ? remove(sectionId)
                                  : add(sectionId)
                              }}
                              isChecked={selected}
                              checkBoxColor={colors.brand}
                            />
                          )
                        : (
                            <Icon
                              name={isOpen ? 'chevron-thin-up' : 'chevron-thin-down'}
                              size={16}
                              color='white'
                            />
                          )}
                    </Pressable>
                    {isOpen &&
                      videos?.map((video, videoIndex) => (
                        <View
                          key={videoIndex}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            marginBottom:
                              videoIndex === videos.length - 1 ? 0 : 21,
                          }}>
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <FastImage
                              style={styles.thumbnail}
                              source={{
                                uri: `https://cdnsecakmi.kaltura.com/p/2654411/thumbnail/entry_id/${
                                  video?.kaltura_embed_code ||
                                  video?.kalturaEmbedCode
                                }`,
                              }}
                            />
                            <Image
                              style={{
                                position: 'absolute',
                                height: 24,
                                width: 24,
                              }}
                              source={Play}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.videoTitle}>{video?.title}</Text>
                            <View style={styles.downloadContainer}>
                              <Image
                                source={Download}
                                style={styles.downloadImage}
                              />
                              <Text style={styles.downloadText}>{getPrettySize(video.size)}</Text>
                              <Text style={styles.downloadText}>
                                {getVideoDurationString(video?.duration)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      ))}
                  </View>
                )
              })}
              </View>
            )}
      </ScrollView>
      <ResourceFooter
        selectMode={selectMode}
        selectedOptions={selectedOptions}
        selectedSize={selectedSize}
        removeFiles={removeSelectedSections}
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
  downloadImage: { height: 12, width: 12 },
  downloadText: { fontFamily: latoFont(), color: '#B1BFC5', marginLeft: 8 },
  icon: { height: 16, width: 8 },
  lockIcon: { height: 16, width: 12 },
  thumbnail: { height: 68, width: 120, marginRight: 12 },
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

Sections.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes.any),
  }),
}

export default Sections

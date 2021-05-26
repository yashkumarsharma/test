import React, { useRef, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native'
import PropTypes from 'prop-types'
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/Entypo'
import PDFView from 'react-native-view-pdf'
import colors from '../../assets/colors'
import { latoFont } from '../../utilities/utilsFunctions'

const screenWidth = Math.round(Dimensions.get('window').width)

const VideoScreen = ({ route }) => {
  const { video } = route.params
  const [document, setDocument] = useState('')
  const videoRef = useRef()

  const load = () => {
    videoRef.current.seek(0)
  }

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>{video?.title}</Text>
      <View>
        <Video
          controls={true}
          paused={true}
          ignoreSilentSwitch='ignore'
          playWhenInactive
          playInBackground={false}
          pictureInPicture={true}
          resizeMode='cover'
          ref={videoRef}
          onLoad={load}
          onPictureInPictureStatusChanged={(props) =>
            console.log('PIP STATE CHANGE', props)
          }
          source={{
            uri:
              'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4',
          }}
          style={styles.backgroundVideo}
        />
        <Text style={styles.videoDuration}>{video?.duration}</Text>
      </View>
      {video?.course_download?.map((resource) => (
        <Pressable
          key={resource?.file}
          style={styles.linkContainer}
          onPress={() => setDocument(resource?.file)}>
          <Text style={styles.linkText}>{resource?.title}</Text>
          <Icon name={'chevron-thin-right'} size={16} color='#5FC4B8' />
        </Pressable>
      ))}
      <Modal
        animationType='slide'
        transparent={true}
        visible={document?.length > 0}
        onRequestClose={() => setDocument('')}>
        <TouchableWithoutFeedback onPress={() => setDocument('')}>
          <View style={styles.centeredView}>
            <View style={{ width: '90%', height: '70%' }}>
              <TouchableWithoutFeedback>
                <PDFView
                  fadeInDuration={250.0}
                  style={{ flex: 1 }}
                  resource={document}
                  resourceType={'url'}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: latoFont('Bold'),
    fontSize: 16,
    marginBottom: 24,
  },
  backgroundVideo: {
    height: 200,
    width: '100%',
    marginBottom: 24,
  },
  linkText: {
    color: '#5FC4B8',
    fontFamily: latoFont(),
    fontSize: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  instructorHide: {
    fontSize: screenWidth / 30,
    marginTop: 10,
    width: '100%',
    backgroundColor: 'transparent',
    color: 'white',
  },
  videoDuration: {
    fontFamily: latoFont('Bold'),
    fontSize: 16,
    color: 'white',
    position: 'absolute',
    right: 20,
    bottom: 40,
  },
})

VideoScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes.any),
  }),
}

export default VideoScreen

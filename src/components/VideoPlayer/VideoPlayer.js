import React, { useState, useRef } from 'react'
import { StyleSheet, View, Platform, Dimensions, Modal } from 'react-native'
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls'
import Video from 'react-native-video'
import Orientation from 'react-native-orientation-locker'
import colors from '../../assets/colors'

const screenHeight = Dimensions.get('screen').height

const VideoPlayer = () => {
  const videoPlayer = useRef(null)
  const [duration, setDuration] = useState(0)
  const [paused, setPaused] = useState(true)

  const [currentTime, setCurrentTime] = useState(0)
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PAUSED)
  const [isLoading, setIsLoading] = useState(true)

  const onSeek = (seek) => {
    videoPlayer?.current.seek(seek)
  }

  const onSeeking = (currentVideoTime) => setCurrentTime(currentVideoTime)

  const onPaused = (newState) => {
    setPaused(!paused)
    setPlayerState(newState)
  }

  const onReplay = () => {
    videoPlayer?.current.seek(0)
    setCurrentTime(0)
    if (Platform.OS === 'android') {
      setPlayerState(PLAYER_STATES.PAUSED)
      setPaused(true)
    } else {
      setPlayerState(PLAYER_STATES.PLAYING)
      setPaused(false)
    }
  }

  const onProgress = (data) => {
    if (!isLoading) {
      setCurrentTime(data.currentTime)
    }
  }

  const onLoad = (data) => {
    videoPlayer.current.seek(currentTime || 1)
    setDuration(Math.round(data.duration))
    setIsLoading(false)
  }

  const onLoadStart = () => {
    setIsLoading(true)
  }

  const onEnd = () => {
    setPlayerState(PLAYER_STATES.ENDED)
    setCurrentTime(duration)
  }

  const [isFullScreen, setIsFullScreen] = useState(false)

  const onFullScreen = () => {
    if (!isFullScreen) {
      Orientation.lockToLandscape()
    } else {
      if (Platform.OS === 'ios') {
        Orientation.lockToPortrait()
      }
      Orientation.lockToPortrait()
    }
    setIsFullScreen(!isFullScreen)
  }

  const PlayerWrapper = isFullScreen ? Modal : View

  return (
    <PlayerWrapper
      style={
        !isFullScreen
          ? styles.backgroundVideo
          : styles.backgroundVideoFullScreen
      }
      animationType='slide'
      transparent={true}
      visible={isFullScreen}>
      <Video
        onEnd={onEnd}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        posterResizeMode={'cover'}
        onProgress={onProgress}
        paused={paused}
        ref={(ref) => (videoPlayer.current = ref)}
        resizeMode={'cover'}
        source={{
          uri:
            'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4',
        }}
        style={
          !isFullScreen
            ? styles.backgroundVideo
            : styles.backgroundVideoFullScreen
        }
      />
      <MediaControls
        isFullScreen={isFullScreen}
        duration={duration}
        isLoading={isLoading}
        progress={currentTime}
        onFullScreen={onFullScreen}
        onPaused={onPaused}
        onReplay={onReplay}
        onSeek={onSeek}
        onSeeking={onSeeking}
        mainColor={colors.brand}
        playerState={playerState}
        style={
          isFullScreen
            ? styles.backgroundVideoFullScreen
            : styles.backgroundVideo
        }
        sliderStyle={
          isFullScreen
            ? {
                containerStyle: styles.mediaControls,
                thumbStyle: {},
                trackStyle: {},
              }
            : { containerStyle: {}, thumbStyle: {}, trackStyle: {} }
        }
      />
    </PlayerWrapper>
  )
}

const styles = StyleSheet.create({
  backgroundVideo: {
    height: 250,
    width: '100%',
  },
  mediaControls: {
    width: screenHeight - 170,
    height: '100%',
    flex: 1,
    alignSelf:
      Platform.OS === 'android'
        ? screenHeight < 800
          ? 'center'
          : 'flex-start'
        : 'center',
  },
  backgroundVideoFullScreen: {
    height: '100%',
    width: '100%',
  },
})

export default VideoPlayer

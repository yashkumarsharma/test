import React, { useState, useEffect } from 'react'
import { View, Text, Platform, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import PropTypes from 'prop-types'
import Toast from 'react-native-simple-toast'

import { latoFont } from '../../utilities/utilsFunctions'
import colors from '../../assets/colors'
import { setMyScriptData, getMyScriptData } from '../../utilities/api'

const MathScreenHTML = require('./MathScreen.html')

const Math = ({ navigation: { goBack } }) => {
  const [answer, setAnswer] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [title, setTitle] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      getData()
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const getData = async () => {
    const result = await getMyScriptData()
    if (result?.['last-uuid'] && result['last-uuid'] !== 'nodata') {
      setTitle(result?.meta?.title || '')
      setIsConnected(true)
    } else {
      setTitle('')
      setIsConnected(false)
    }
  }

  const processMessage = (message) => {
    if (message === 'SUBMIT_ANSWER') {
      if (!isConnected) {
        Toast.show('You are not connected to Outlier on desktop')
      } else {
        // Make API Call
        setMyScriptData(title, { answer })
        Toast.show('Answer sent on desktop')
      }
    } else {
      setAnswer(message)
    }
  }
  return (
    <>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.titleContainerRow}>
            <View style={styles.titleContainerRow}>
              {!isConnected
                ? (
                <Icon name={'lan-disconnect'} size={20} color={'#B1BFC5'} />
                  )
                : (
                <Icon name={'lan-connect'} size={20} color={colors.link} />
                  )}
              <Text style={styles.titleText}> {title} </Text>
            </View>
            <EntypoIcon
              onPress={goBack}
              style={styles.cross}
              name={'cross'}
              size={20}
              color={'white'}
            />
          </View>
        </View>
      </View>
      <WebView
        originWhitelist={['*']}
        source={
          Platform.OS === 'ios'
            ? MathScreenHTML
            : { uri: 'file:///android_asset/html/MathScreen.html' }
        }
        style={styles.webviewStyles}
        onMessage={(e) => processMessage(e.nativeEvent.data)}
      />
    </>
  )
}

Math.propTypes = {
  navigation: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 60,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#000',
  },
  titleContainer: {
    height: 38,
    justifyContent: 'flex-end',
    // borderWidth: 1,
    // borderColor: 'red',
    width: '100%',
    // flexDirection: 'row',
    // textAlignVertical: 'bottom',
  },
  titleText: {
    fontFamily: latoFont('Bold'),
    fontSize: 14,
    marginLeft: 6,
    color: '#B1BFC5',
  },
  titleContainerRow: {
    flexDirection: 'row',
  },
  cross: {
    marginLeft: 'auto',
    marginRight: 0,
    paddingLeft: 20,
    // paddingRight: 20,
  },
  webviewStyles: {
    flex: 1,
    backgroundColor: '#161618',
  },
})

export default Math

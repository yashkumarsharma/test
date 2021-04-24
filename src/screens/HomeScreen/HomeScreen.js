import React from 'react'
import { Text, View, Platform } from 'react-native'
import Config from 'react-native-config'

import colors from '../../assets/colors'

function HomeScreen () {
  console.warn('api host is', Config.API_HOST)
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bg,
      }}>
      <Text
        style={{
          color: colors.brand,
          fontFamily: Platform.OS === 'android' ? 'LatoBold' : 'Lato-Bold',
        }}>
        Home Screen
      </Text>
    </View>
  )
}

export default HomeScreen

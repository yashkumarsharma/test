import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { createStackNavigator } from '@react-navigation/stack'

import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import { horizontalTransition } from '../../utilities/navigationUtils'
import VideoScreen from '../MyCourses/VideoScreen'
import Courses from './Courses'
import Chapters from './Chapters'
import Sections from './Sections'

const Downloads = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  const Stack = createStackNavigator()

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        ...Platform.select({
          android: horizontalTransition,
        }),
      }}
      initialRouteName='Downloads'
      headerMode='float'
      {...horizontalTransition}>
      <Stack.Screen
        name='Downloads'
        component={Courses}
        options={{
          header: HeaderComponent,
        }}
      />
      <Stack.Screen
        name='downloads-folders'
        component={Chapters}
        options={{
          header: HeaderComponent,
          headerTitle: 'Chapters',
        }}
      />
      <Stack.Screen
        name='downloads-chapters'
        component={Sections}
        options={{
          header: HeaderComponent,
        }}
      />

      <Stack.Screen
        name='downloads-video'
        component={VideoScreen}
        options={{
          header: HeaderComponent,
        }}
      />
    </Stack.Navigator>
  )
}

export default Downloads

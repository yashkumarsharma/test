import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import { createStackNavigator } from '@react-navigation/stack'

import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import Courses from './Courses'

const Downloads = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  const Stack = createStackNavigator()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Downloads'
        component={Courses}
        options={{
          header: HeaderComponent,
        }}
      />
    </Stack.Navigator>
  )
}

export default Downloads

// In order to use same header component,
// stack is required to be added inside tab components
// There can be more screens added in future.

import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import { createStackNavigator } from '@react-navigation/stack'

import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import OptionsScreen from './OptionsScreen'

const Options = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  const Stack = createStackNavigator()

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Options'
        component={OptionsScreen}
        options={{
          header: HeaderComponent,
        }}
      />
    </Stack.Navigator>
  )
}

export default Options

import React, { useEffect } from 'react'
import { View } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { createStackNavigator } from '@react-navigation/stack'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import colors from '../../assets/colors'

const MyCourses = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  const Stack = createStackNavigator()

  return (
        <Stack.Navigator>
          <Stack.Screen
            name='My Courses'
            component={() => <View style={{ flex: 1, backgroundColor: colors.bg }}/>}
            options={{
              header: HeaderComponent,
            }}
          />
        </Stack.Navigator>
  )
}

export default MyCourses

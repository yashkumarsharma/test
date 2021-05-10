import React, { useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import { createStackNavigator } from '@react-navigation/stack'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import MyCoursesScreen from './MyCoursesScreen'

const MyCourses = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  const Stack = createStackNavigator()

  return (
        <Stack.Navigator>
          <Stack.Screen
            name='My Courses'
            component={MyCoursesScreen}
            options={{
              header: HeaderComponent,
            }}
          />
        </Stack.Navigator>
  )
}

export default MyCourses

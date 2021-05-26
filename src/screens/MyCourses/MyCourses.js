import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Platform } from 'react-native'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import { horizontalTransition } from '../../utilities/navigationUtils'
import MyCoursesScreen from './MyCoursesScreen'
import CourseScreen from './CourseScreen'
import ChapterScreen from './ChapterScreen'

const MyCourses = () => {
  const Stack = createStackNavigator()

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        ...Platform.select({
          android: horizontalTransition,
        }),
      }}
      headerMode='float'
      {...horizontalTransition}>
      <Stack.Screen
        name='My Courses'
        component={MyCoursesScreen}
        options={{
          header: HeaderComponent,
        }}
      />

      <Stack.Screen
        name='chapters'
        component={CourseScreen}
        options={{
          header: HeaderComponent,
        }}
      />
      <Stack.Screen
        name='chapter'
        component={ChapterScreen}
        options={{
          header: HeaderComponent,
        }}
      />
    </Stack.Navigator>
  )
}

export default MyCourses

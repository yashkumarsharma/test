import React from 'react'
import { Image, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import colors from '../../assets/colors'
import MyCoursesInactive from '../../assets/icons/MyCoursesInactive.png'
import MyCoursesActive from '../../assets/icons/MyCoursesActive.png'
import DownloadsActive from '../../assets/icons/DownloadActive.png'
import DownloadsInactive from '../../assets/icons/DownloadInactive.png'
import OptionsActive from '../../assets/icons/PersonActive.png'
import OptionsInactive from '../../assets/icons/PersonInactive.png'
import MathActive from '../../assets/icons/PencilInactive.png'
import MyCourses from '../MyCourses/MyCourses'
import { latoFont } from '../../utilities/utilsFunctions'

const Tab = createBottomTabNavigator()
const IconStyle = { height: 24, width: 24 }

function HomeScreen () {
  // console.warn('api host is', Config.API_HOST)
  return (
    <Tab.Navigator
      initialRouteName='Courses'
      tabBarOptions={{
        tabStyle: {
          borderColor: '#292929',
          borderWidth: 0.5,
          backgroundColor: '#000000',
          borderTopColor: '#000',
          borderBottomColor: '#000',
        },
        style: { borderTopColor: '#000' },
        activeTintColor: '#FFF',
        inactiveTintColor: colors.brand,
        activeBackgroundColor: '#000000',
        inactiveBackgroundColor: '#000000',
        labelStyle: {
          fontFamily: latoFont('Regular'),
          fontSize: 10,
        },
      }}>
      <Tab.Screen
        name='Courses'
        component={MyCourses}
        options={{
          tabBarLabel: 'My Courses',
          tabBarIcon: ({ focused }) => (
            <Image
              style={IconStyle}
              source={focused ? MyCoursesActive : MyCoursesInactive}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Downloads'
        component={() => <View />}
        options={{
          tabBarLabel: 'Downloads',
          tabBarIcon: ({ focused }) => (
            <Image
              style={IconStyle}
              source={focused ? DownloadsActive : DownloadsInactive}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Math'
        component={() => <View style={{ flex: 1, height: 1000, backgroundColor: colors.bg }}/>}
        options={{
          tabBarLabel: 'Math entry',
          tabBarIcon: () => <Image style={IconStyle} source={MathActive} />,
          tabBarVisible: false,
        }}
      />
      <Tab.Screen
        name='Options'
        component={() => <View />}
        options={{
          tabBarLabel: 'Options',
          tabBarIcon: ({ focused }) => (
            <Image
              style={IconStyle}
              source={focused ? OptionsActive : OptionsInactive}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default HomeScreen

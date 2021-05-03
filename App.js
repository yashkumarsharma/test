import React, { useEffect } from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import SplashScreen from 'react-native-splash-screen'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './src/screens/HomeScreen/HomeScreen'
import HeaderComponent from './src/components/HeaderComponent/HeaderComponent'

const App = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  const backgroundStyle = {
    backgroundColor: '#000',
  }

  const Stack = createStackNavigator()

  return (
    <NavigationContainer>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'black'}/>
      </SafeAreaView>

      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{
            header: (props) => <HeaderComponent {...props} />,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

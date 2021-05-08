import React, { useContext, useEffect } from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import SplashScreen from 'react-native-splash-screen'
import { createStackNavigator } from '@react-navigation/stack'

import colors from './src/assets/colors'
import { AppContext } from './src/components/ContextProvider/ContextProvider'
import HomeScreen from './src/screens/HomeScreen/HomeScreen'
import LoginScreen from './src/screens/LoginScreen/LoginScreen'

const App = () => {
  const context = useContext(AppContext)
  const isLogin = context?.user?.username || false

  useEffect(() => {
    SplashScreen.hide()
  }, [])

  const backgroundStyle = {
    backgroundColor: '#000',
    flex: 1,
  }

  const Stack = createStackNavigator()

  return (
    <>
      <NavigationContainer>
        <SafeAreaView style={backgroundStyle}>
          <StatusBar barStyle={'dark-content'} />
          <Stack.Navigator initialRouteName={'Home'}>
            <Stack.Screen
              name='Home'
              component={HomeScreen}
              options={{
                title: 'Home',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name='Math'
              component={() => <View style={{ flex: 1, height: 1000, backgroundColor: colors.bg }}/>}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
      {/* Login screen - This will act as an overlay if user is not authenticated */}
      {!isLogin && <LoginScreen />}
    </>
  )
}

export default App

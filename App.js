import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { createStackNavigator } from '@react-navigation/stack';
import colors from './src/assets/colors';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const backgroundStyle = {
    backgroundColor: colors.bg,
  };

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={'dark-content'} />
      </SafeAreaView>

      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{
            title: 'Home',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

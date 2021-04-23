import { Text, View, Platform } from 'react-native';
import colors from '../../assets/colors';
import React from 'react';

function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bg,
      }}>
      <Text
        style={{
          color: colors.brand,
          fontFamily: Platform.OS === 'android' ? 'LatoBold' : 'Lato-Bold',
        }}>
        Home Screen
      </Text>
    </View>
  );
}

export default HomeScreen;

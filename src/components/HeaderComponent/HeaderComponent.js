import React from 'react'
import PropTypes from 'prop-types'
import { Text, Platform, StyleSheet, Animated, TouchableOpacity, Image, View } from 'react-native'
import colors from '../../assets/colors'
import Caret from '../../assets/icons/Caret.png'
import { latoFont } from '../../utilities/utilsFunctions'

function HeaderComponent ({ scene, previous, navigation: { goBack } }) {
  const progress = Animated.add(scene.progress.current, scene.progress.next || 0)

  const opacity = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  })

  return (
    <Animated.View
      style={{ ...styles.container, opacity }}>
      <View
        style={styles.titleContainer}>
        {previous
          ? <TouchableOpacity onPress={goBack} style={styles.PreviousContainer}>
            <Image source={Caret} style={styles.PreviousIcon}/>
              <Text style={styles.PreviousText}>{previous?.route?.name}</Text>
            </TouchableOpacity>
          : <Text style={styles.titleText}>{scene?.route?.name}</Text>
        }

      </View>
    </Animated.View>
  )
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#000',
  },
  titleContainer: {
    width: '90%',
    height: 38,
    justifyContent: 'flex-end',
  },
  titleText: { color: 'white', fontFamily: latoFont('Bold'), fontSize: 14 },
  PreviousText: { color: colors.brand, fontFamily: latoFont('Bold'), fontSize: 14, textTransform: 'uppercase' },
  PreviousContainer: { flexDirection: 'row', alignItems: 'center' },
  PreviousIcon: { height: 12, width: 6, marginRight: 12 },
})

HeaderComponent.propTypes = {
  scene: PropTypes.shape({
    route: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    progress: PropTypes.objectOf(PropTypes.number),
  }),
  previous: PropTypes.shape({
    route: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  navigation: PropTypes.objectOf(PropTypes.func),
}

export default HeaderComponent

import React, { useContext } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'
import colors from '../../assets/colors'
import { latoFont } from '../../utilities/utilsFunctions'
import config from '../../config'
import { AppContext } from '../../components/ContextProvider/ContextProvider'

const MyCoursesScreen = ({ navigation: { navigate } }) => {
  const { courses: { loading, data: courses }, getCourses } = useContext(AppContext)
  const { getCourseImage } = config
  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={courses.length > 0 && loading}
          onRefresh={getCourses}
          tintColor={'#56aba6'}
          colors={[colors.brand]}
        />
      }>
      {!courses?.length > 0
        ? (
        <View style={{ justifyContent: 'center', flexGrow: 1 }}>
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : (
        <View style={styles.container}>
          {courses.map((course, key) => {
            return (
              <TouchableOpacity
                key={key}
                style={styles.cardContainer}
                onPress={() => {
                  navigate('chapters', {
                    course,
                  })
                }}>
                <ImageBackground
                  source={getCourseImage(course?.id)}
                  style={{ width: '100%' }}>
                  <LinearGradient
                    colors={['#000000', 'transparent']}
                    end={{ x: 0, y: 0.65 }}
                    start={{ x: 0, y: 1 }}
                    style={styles.gradient}>
                    <Text style={styles.courseName}>{course?.name}</Text>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            )
          })}
          <View style={styles.dashboardCard}>
            <Text style={styles.cardText}>
              Visit the full course site to complete the other required work not
              found on this MyCoursesScreen.
            </Text>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('https://dashboard.outlier.org/')
              }}>
              <Text style={styles.cardButton}>Open dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { flexGrow: 1 },
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 50,
  },
  gradient: {
    height: '100%',
    width: '100%',
    padding: 12,
    justifyContent: 'flex-end',
  },
  cardContainer: {
    height: 220,
    width: '48%',
    marginVertical: 10,
    borderRadius: 6,
    resizeMode: 'cover',
    overflow: 'hidden',
  },
  dashboardCard: {
    width: '100%',
    backgroundColor: '#25272B',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingTop: 28,

    paddingBottom: 24,
  },
  cardText: {
    fontFamily: latoFont('Bold'),
    color: '#FFFFFF',
    fontSize: 16,
  },
  cardButton: {
    marginTop: 14,
    fontFamily: latoFont('Bold'),
    color: colors.brand,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  courseName: { color: '#FFF', fontFamily: latoFont('Bold'), fontSize: 16 },
})

MyCoursesScreen.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.func),
}

export default MyCoursesScreen

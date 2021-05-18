import React, { useCallback, useContext } from 'react'
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AntIcon from 'react-native-vector-icons/AntDesign'

import { AppContext } from '../../components/ContextProvider/ContextProvider'
import colors from '../../assets/colors'
import { latoFont } from '../../utilities/utilsFunctions'

const OptionsScreen = () => {
  const context = useContext(AppContext)
  const { updateContext } = context

  const renderDownloadOptionRow = useCallback(() => {
    const downloadedSize = '2.65 GB' // Todo: Fetch from context
    return (
      <View style={[styles.row, styles.downloadRow]}>
        <Text style={styles.rowText}>{downloadedSize} Downloaded</Text>
        <Icon name={'delete-outline'} size={20} color={colors.link} />
      </View>
    )
  }, [])

  const renderVersionOptionRow = useCallback(() => {
    // Todo: Check if update is available.
    const isVersionUpdateAvailable = false
    return (
      <View style={[styles.row]}>
        <Text style={styles.rowText}>Version 1.0.0</Text>
        {isVersionUpdateAvailable && (
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.rowLinkText}>Update available</Text>
            <AntIcon name={'right'} size={20} color={colors.link} />
          </View>
        )}
      </View>
    )
  }, [])

  const renderTermsOfUseRow = useCallback(() => {
    return (
      <Pressable
        style={[styles.row]}
        onPress={() =>
          Linking.openURL('https://dashboard.outlier.org/#/terms-of-use')
        }>
        <Text style={[styles.rowLinkText]}>Terms of Use</Text>
        <AntIcon name={'right'} size={20} color={colors.link} />
      </Pressable>
    )
  }, [])

  const renderPrivacyPolicyRow = useCallback(() => {
    return (
      <Pressable
        style={[styles.row]}
        onPress={() =>
          Linking.openURL('https://dashboard.outlier.org/#/privacy-policy')
        }>
        <Text style={[styles.rowLinkText]}>Privacy Policy</Text>
        <AntIcon name={'right'} size={20} color={colors.link} />
      </Pressable>
    )
  }, [])

  const onSignOut = useCallback(async () => {
    await AsyncStorage.removeItem('user')
    updateContext({ user: {} })
  }, [])

  const renderSignOut = useCallback(
    () => (
      <View style={styles.signOut}>
        <Text onPress={onSignOut} style={[styles.signOutText]}>
          Sign Out
        </Text>
      </View>
    ),
    [],
  )

  return (
    <ScrollView style={styles.scrollContainer}>
      <Text style={styles.description}>
        The Outlier Companion app is designed to be paired with the full version
        of each course. Visit the full course site to complete the other
        required work not found on this app.
      </Text>
      <Text
        style={styles.dashboardLink}
        onPress={() => Linking.openURL('https://dashboard.outlier.org/')}>
        OPEN DASHBOARD
      </Text>
      <View style={styles.supportLink}>
        <Icon
          name={'email-outline'}
          size={16}
          color={colors.link}
          style={styles.emailIcon}
        />
        <Text
          style={styles.supportLinkText}
          onPress={() => Linking.openURL('mailto:success@outlier.org')}>
          CONTACT SUPPORT
        </Text>
      </View>
      {renderDownloadOptionRow()}
      {renderVersionOptionRow()}
      {renderTermsOfUseRow()}
      {renderPrivacyPolicyRow()}
      {renderSignOut()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: colors.bg,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 24,
  },
  description: {
    color: 'white',
    fontFamily: latoFont(),
    lineHeight: 19,
    fontSize: 16,
  },
  dashboardLink: {
    marginTop: 12,
    fontFamily: latoFont(),
    letterSpacing: 1,
    color: colors.link,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
  },
  supportLink: {
    marginTop: 26,
    backgroundColor: '#19252C',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 5,
  },
  supportLinkText: {
    fontFamily: latoFont(),
    color: colors.link,
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 1,
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    alignSelf: 'center',
  },
  emailIcon: {
    marginRight: 12,
    paddingTop: Platform.OS === 'ios' ? 16 : 15,
    paddingBottom: 15,
  },
  row: {
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  downloadRow: {
    marginTop: 24,
  },
  rowText: {
    color: 'white',
    fontFamily: latoFont(),
    fontSize: 16,
    lineHeight: 19,
  },
  rowLinkText: {
    color: colors.link,
    fontFamily: latoFont(),
    fontSize: 16,
    lineHeight: 19,
  },
  signOut: {
    marginTop: 24,
  },
  signOutText: {
    color: colors.link,
    fontFamily: latoFont(),
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '700',
    letterSpacing: 1,
  },
})

export default OptionsScreen

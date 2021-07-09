import React, { useCallback, useContext, useState } from 'react'
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { ConfirmDialog } from 'react-native-simple-dialogs'
import DeviceInfo from 'react-native-device-info'

import { AppContext } from '../../components/ContextProvider/ContextProvider'
import colors from '../../assets/colors'
import { latoFont, getPrettySize } from '../../utilities/utilsFunctions'

const OptionsScreen = () => {
  const {
    onSignOut,
    downloads,
    deleteDownloadsData,
  } = useContext(AppContext)

  console.log('Platform.version', DeviceInfo.getBuildNumber(), DeviceInfo.getVersion())
  const [dialogVisible, setDialogVisible] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [dialogAction, setDialogAction] = useState()

  const downloadedSize = useCallback(() => {
    let totalDownload = 0
    for (const courseId in downloads) {
      totalDownload += downloads[courseId]?.size || 0
    }
    return totalDownload
  }, [downloads])

  const deleteDownload = () => {
    // Remove all files
    deleteDownloadsData()
    setDialogVisible(false)
  }

  const onDeleteDownload = () => {
    setDialogMessage('Do you want to delete all downloaded resources?')
    setDialogVisible(true)
    setDialogAction(() => deleteDownload)
  }

  const renderDownloadOptionRow = useCallback(() => {
    const downloadedBytes = downloadedSize()
    const size = getPrettySize(downloadedBytes)
    return (
      <View style={[styles.row, styles.downloadRow]}>
        <Text style={styles.rowText}>{size} Downloaded</Text>
        {downloadedBytes > 0 && (
          <Icon onPress={onDeleteDownload} name={'delete-outline'} size={20} color={colors.link} />
        )}
      </View>
    )
  }, [downloads])

  const renderVersionOptionRow = useCallback(() => {
    // Todo: Check if update is available.
    const isVersionUpdateAvailable = false
    return (
      <View style={[styles.row]}>
        <Text style={styles.rowText}>Version 1.0.0 {`${DeviceInfo.getBuildNumber()} ${DeviceInfo.getVersion()}`}</Text>
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

  const signOut = () => {
    onSignOut()
    setDialogVisible(false)
  }

  const onSignOutPress = () => {
    setDialogMessage('Do you want to Sign Out?')
    setDialogVisible(true)
    setDialogAction(() => signOut)
  }

  const renderSignOut = useCallback(
    () => (
      <View style={styles.signOut}>
        <Text onPress={onSignOutPress} style={[styles.signOutText]}>
          Sign Out
        </Text>
      </View>
    ),
    [],
  )

  const renderConfirmationDialog = () => (
    <ConfirmDialog
      title={dialogMessage}
      message=''
      visible={dialogVisible}
      onTouchOutside={() => setDialogVisible(false)}
      positiveButton={{
        title: 'YES',
        onPress: dialogAction,
      }}
      negativeButton={{
        title: 'NO',
        onPress: () => setDialogVisible(false),
      }}
    />
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
      {renderConfirmationDialog()}
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
